// Creates server instance & runs the same tests — just copy them over and add awaits.
import { expect, test, describe, beforeAll } from "vitest"
import createClient from "./client"
import * as service from "./service"

const port = 11111
const client = createClient({ port })

beforeAll(async () => {
  await service.createServer({ port })
})

describe(`stores dependencies and lets you query them`, () => {
  test(`Adding a dependency`, async () => {
    console.log(`hi`)
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/-header`,
        type: 0,
        path: `/`,
        otherData: true,
      },
    })

    const nodeDeps = await client.getNodeDependencies({ nodeId: `123` })
    const targetDeps = await client.getTargetDependencies({
      targetId: `/-header`,
    })
    const pathDeps = await client.getPathDependencies({ path: `/` })
    expect(nodeDeps[0].path).toEqual(`/`)
    expect(targetDeps[0]).toEqual(`123`)
    expect(pathDeps[0]).toEqual(`123`)
  })
  test(`Adding multiple target dependencies on one node`, async () => {
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/-header`,
        type: 0,
        path: `/`,
        otherData: true,
      },
    })
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/hi-header`,
        type: 0,
        path: `/hi`,
        otherData: true,
      },
    })

    const nodeDeps = await client.getNodeDependencies({ nodeId: `123` })
    console.log({ nodeDeps })
    expect(nodeDeps).toHaveLength(2)
    expect(nodeDeps.find((dep) => dep.path === `/hi`).path).toEqual(`/hi`)
    expect(nodeDeps.find((dep) => dep.path === `/`).path).toEqual(`/`)

    const targetDepsHi = await client.getTargetDependencies({
      targetId: `/hi-header`,
    })
    expect(targetDepsHi[0]).toEqual(`123`)

    const targetDepsHeader = await client.getTargetDependencies({
      targetId: `/hi-header`,
    })
    expect(targetDepsHeader[0]).toEqual(`123`)

    const pathDepsHi = await client.getPathDependencies({ path: `/hi` })
    expect(pathDepsHi[0]).toEqual(`123`)

    const pathDepsIndex = await client.getPathDependencies({ path: `/` })
    expect(pathDepsIndex[0]).toEqual(`123`)
  })
  test(`Adding multiple node dependencies for one path`, async () => {
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/-header`,
        type: 0,
        path: `/`,
        otherData: true,
      },
    })
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `124`,
      target: {
        id: `/-header`,
        type: 0,
        path: `/`,
        otherData: true,
      },
    })

    const nodeDeps = await client.getNodeDependencies({ nodeId: `123` })
    expect(nodeDeps.find((dep) => dep.path === `/`).path).toEqual(`/`)

    const targetDeps = await client.getTargetDependencies({
      targetId: `/-header`,
    })
    console.log({ targetDeps })
    expect(targetDeps).toMatchInlineSnapshot(`
      [
        "123",
        "124",
      ]
    `)
    const pathDeps = await client.getPathDependencies({ path: `/` })
    expect(pathDeps).toMatchInlineSnapshot(`
      [
        "123",
        "124",
      ]
    `)
  })
  test(`querying most likely page to redirect user to for preview`, async () => {
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/-header`,
        type: 0,
        path: `/`,
        otherData: true,
      },
    })

    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/hi-header`,
        type: 1,
        path: `/hi`,
        otherData: true,
      },
    })
    const page = await client.getPreviewPath({ nodeId: `123` })
    expect(page.path).toEqual(`/`)
  })
})

describe.only(`client can invalidate nodes`, () => {
  test(`invalidating a node deletes the node + all dependencies`, async () => {
    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/-header`,
        type: 0,
        path: `/`,
        otherData: true,
      },
    })

    await client.createDependency({
      // Node is in a different system but the target is only knowable within
      // the current system.
      nodeId: `123`,
      target: {
        id: `/hi-header`,
        type: 0,
        path: `/hi`,
        otherData: true,
      },
    })
    const invalidatedTargets = await client.invalidateNode({
      nodeId: `123`,
    })
    const targetDeps = await client.getTargetDependencies({
      targetId: `/-header`,
    })
    expect(invalidatedTargets).toHaveLength(2)
    expect(targetDeps).toHaveLength(0)
  })
})
