import { expect, test, describe } from "vitest"
import * as insideOut from "./service"

describe(`stores dependencies and lets you query them`, () => {
  test(`Adding a dependency`, () => {
    insideOut.createDependency({
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

    expect(insideOut.getNodeDependencies(`123`)[0].path).toEqual(`/`)
    expect(insideOut.getTargetDependencies(`/-header`)[0]).toEqual(`123`)
    expect(insideOut.getPathDependencies(`/`)[0]).toEqual(`123`)
  })
  test(`Adding multiple target dependencies on one node`, () => {
    insideOut.createDependency({
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
    insideOut.createDependency({
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

    const nodeDeps = insideOut.getNodeDependencies(`123`)
    expect(nodeDeps).toHaveLength(2)
    expect(nodeDeps.find((dep) => dep.path === `/hi`).path).toEqual(`/hi`)
    expect(nodeDeps.find((dep) => dep.path === `/`).path).toEqual(`/`)
    expect(insideOut.getTargetDependencies(`/hi-header`)[0]).toEqual(`123`)
    expect(insideOut.getTargetDependencies(`/-header`)[0]).toEqual(`123`)
    expect(insideOut.getPathDependencies(`/hi`)[0]).toEqual(`123`)
    expect(insideOut.getPathDependencies(`/`)[0]).toEqual(`123`)
  })
  test(`Adding multiple node dependencies for one path`, () => {
    insideOut.createDependency({
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
    insideOut.createDependency({
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

    expect(
      insideOut.getNodeDependencies(`123`).find((dep) => dep.path === `/`).path
    ).toEqual(`/`)
    expect(insideOut.getTargetDependencies(`/-header`)).toMatchInlineSnapshot(`
      [
        "123",
        "124",
      ]
    `)
    expect(insideOut.getPathDependencies(`/`)).toMatchInlineSnapshot(`
      [
        "123",
        "124",
      ]
    `)
  })
  test(`querying most likely page to redirect user to for preview`, () => {
    insideOut.createDependency({
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

    insideOut.createDependency({
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
    const page = insideOut.getPreviewPath(`123`)
    expect(page.path).toEqual(`/`)
  })
})
