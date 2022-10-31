import { Target } from "./index"
import got from "got"

async function createDependency({
  nodeId,
  target,
  clientOptions,
}: {
  nodeId: string
  target: Target
  clientOptions: { port: number }
}) {
  const url = new URL(
    `/create-dependency`,
    `http://localhost:${clientOptions.port}`
  )
  const result = await got.post(url, { json: { nodeId, target } })
  return result.body
}

async function invalidateNode({
  nodeId,
  clientOptions,
}: {
  nodeId: string
  clientOptions: { port: number }
}) {
  const url = new URL(
    `/invalidate-node`,
    `http://localhost:${clientOptions.port}`
  )
  const result = await got.post(url, { json: { nodeId } }).json()
  return result
}

async function getNodeDependencies({ nodeId, clientOptions }) {
  const url = new URL(
    `/node-dependencies`,
    `http://localhost:${clientOptions.port}`
  )
  url.searchParams.append(`nodeId`, nodeId)
  const result = await got(url).json()
  return result
}

async function getTargetDependencies({ targetId, clientOptions }) {
  const url = new URL(
    `/target-dependencies`,
    `http://localhost:${clientOptions.port}`
  )
  url.searchParams.append(`targetId`, targetId)
  const result = await got(url).json()
  return result
}

async function getPathDependencies({ path, clientOptions }) {
  const url = new URL(
    `/path-dependencies`,
    `http://localhost:${clientOptions.port}`
  )
  url.searchParams.append(`path`, path)
  const result = await got(url).json()
  return result
}

async function getPreviewPath({ nodeId, clientOptions }) {
  const url = new URL(`/preview-path`, `http://localhost:${clientOptions.port}`)
  url.searchParams.append(`nodeId`, nodeId)
  const result = await got(url).json()
  return result
}

export default function client(clientOptions) {
  return {
    createDependency: (args) => createDependency({ ...args, clientOptions }),
    invalidateNode: (args) => invalidateNode({ ...args, clientOptions }),
    getNodeDependencies: (args) =>
      getNodeDependencies({ ...args, clientOptions }),
    getTargetDependencies: (args) =>
      getTargetDependencies({ ...args, clientOptions }),
    getPathDependencies: (args) =>
      getPathDependencies({ ...args, clientOptions }),
    getPreviewPath: (args) => getPreviewPath({ ...args, clientOptions }),
  }
}
