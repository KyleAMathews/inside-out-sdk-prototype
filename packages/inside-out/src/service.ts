import Database from "better-sqlite3"
import { Target } from "./index"
import * as express from "express"

const options = {
  verbose: console.log,
}

let dbPath = ``
if (process.env.TEST) {
  dbPath = `:memory:`
} else {
  dbPath = `inside-out-service.db`
}
const db = new Database(dbPath, options)
db.pragma(`journal_mode = WAL`)

const nodesTable = `CREATE TABLE IF NOT EXISTS nodes('id' TEXT PRIMARY KEY NOT NULL)`
const targetsTable = `CREATE TABLE IF NOT EXISTS targets(
  id TEXT PRIMARY KEY NOT NULL,
  path TEXT,
  type INTEGER
)`
const nodesDepsTable = `CREATE TABLE IF NOT EXISTS nodeDeps(
    node_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    UNIQUE(node_id, target_id)
)`
const pathDepsTable = `CREATE TABLE IF NOT EXISTS pathDeps(
    node_id TEXT NOT NULL,
    path TEXT NOT NULL,
    UNIQUE(node_id, path)
)`
db.exec(nodesTable)
db.exec(targetsTable)
db.exec(nodesDepsTable)
db.exec(pathDepsTable)

export function createDependency({
  nodeId,
  target,
}: {
  nodeId: string
  target: Target
}) {
  const insertNode = db.prepare(
    `INSERT OR IGNORE INTO nodes (id) VALUES (@nodeId)`
  )
  const insertTarget = db.prepare(
    `INSERT OR IGNORE INTO targets (id, path, type) VALUES (@id, @path, @type)`
  )
  const insertNodeDep = db.prepare(
    `INSERT OR IGNORE INTO nodeDeps (node_id, target_id) VALUES (@nodeId, @targetId)`
  )
  const insertPathDep = db.prepare(
    `INSERT OR IGNORE INTO pathDeps (node_id, path) VALUES (@nodeId, @path)`
  )
  const insert = db.transaction(({ nodeId, target }) => {
    insertNode.run({ nodeId })
    insertTarget.run(target)
    insertNodeDep.run({ nodeId, targetId: target.id })
    insertPathDep.run({ nodeId, path: target.path })
  })
  insert({ nodeId, target })
}

export function invalidateNode({ nodeId }: { nodeId: string }) {
  const targets = getNodeDependencies(nodeId)
  const deleteNode = db.prepare(`DELETE FROM nodes where id = @nodeId`)
  const deleteNodeDeps = db.prepare(
    `DELETE FROM nodeDeps where node_id = @nodeId`
  )
  const deletePathDep = db.prepare(
    `DELETE FROM pathDeps where node_id = @nodeId`
  )
  const deleteTransaction = db.transaction((nodeId) => {
    deleteNode.run({ nodeId })
    deleteNodeDeps.run({ nodeId })
    deletePathDep.run({ nodeId })
  })
  deleteTransaction(nodeId)
  return targets
}

/*
 * Useful for invalidating targets + contentsync
 */
export function getNodeDependencies(nodeId) {
  const stmt = db.prepare(`SELECT
                            id, type, path
                          FROM targets
                          WHERE id
                          IN (
                            SELECT target_id
                            FROM nodeDeps
                            WHERE node_id=?
                          )`)
  const results = stmt.all(nodeId)
  console.log({ results })
  return results
}

export function getPreviewPath(nodeId) {
  const nodeTargets = getNodeDependencies(nodeId)
  // Some sort of ranking — for now we'll sort by dependencyType (int from 0-5).
  return nodeTargets.sort((t) => t.type)[0]
}

/*
 * Useful for contentsync
 */
export function getTargetDependencies(targetId) {
  const stmt = db.prepare(
    `SELECT node_id, target_id from nodeDeps where target_id=?`
  )
  const results = stmt.all(targetId)
  console.log({ results })
  return results.map((result) => result.node_id)
}

/*
 * Useful for contentsync
 */
export function getPathDependencies(path) {
  const stmt = db.prepare(`SELECT node_id from pathDeps where path=?`)
  const results = stmt.all(path)
  console.log({ results })
  return results.map((result) => result.node_id)
  // return [...pathDeps.get(targetId)]
}

export async function createServer(options) {
  console.log({ options })
  console.log(`creating a server`)
  const app = express.default()
  app.use(express.json())

  app.get(`/`, (req, res) => {
    res.send(`Express + TypeScript Server`)
  })
  app.post(`/create-dependency`, (req, res) => {
    console.log(req.body)
    try {
      createDependency(req.body)
      res.send(`ok`)
    } catch (e) {
      console.log(e)
      res.statusCode(500).send(`error`)
    }
  })
  app.post(`/invalidate-node`, (req, res) => {
    console.log(`body`, req.body)
    try {
      res.json(invalidateNode(req.body))
    } catch (e) {
      console.log(e)
      res.statusCode(500).send(`error`)
    }
  })
  app.get(`/node-dependencies`, (req, res) => {
    try {
      res.json(getNodeDependencies(req.query.nodeId))
    } catch (e) {
      console.log(e)
      res.statusCode(500).send(`error`)
    }
  })
  app.get(`/target-dependencies`, (req, res) => {
    try {
      res.json(getTargetDependencies(req.query.targetId))
    } catch (e) {
      console.log(e)
      res.statusCode(500).send(`error`)
    }
  })
  app.get(`/path-dependencies`, (req, res) => {
    try {
      res.json(getPathDependencies(req.query.path))
    } catch (e) {
      console.log(e)
      res.statusCode(500).send(`error`)
    }
  })
  app.get(`/preview-path`, (req, res) => {
    try {
      res.json(getPreviewPath(req.query.nodeId))
    } catch (e) {
      console.log(e)
      res.statusCode(500).send(`error`)
    }
  })

  await new Promise((resolve) => {
    app.listen(options.port, () => {
      console.log(
        `[server]: Server is running at https://localhost:${options.port}`
      )
      resolve(null)
    })
  })
}
