"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var insideOut = require("./service");
(0, vitest_1.describe)("stores dependencies and lets you query them", function () {
    (0, vitest_1.test)("Adding a dependency", function () {
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "123",
            target: {
                id: "/-header",
                type: 0,
                path: "/",
                otherData: true
            }
        });
        (0, vitest_1.expect)(insideOut.getNodeDependencies("123")[0].path).toEqual("/");
        (0, vitest_1.expect)(insideOut.getTargetDependencies("/-header")[0]).toEqual("123");
        (0, vitest_1.expect)(insideOut.getPathDependencies("/")[0]).toEqual("123");
    });
    (0, vitest_1.test)("Adding multiple target dependencies on one node", function () {
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "123",
            target: {
                id: "/-header",
                type: 0,
                path: "/",
                otherData: true
            }
        });
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "123",
            target: {
                id: "/hi-header",
                type: 0,
                path: "/hi",
                otherData: true
            }
        });
        var nodeDeps = insideOut.getNodeDependencies("123");
        (0, vitest_1.expect)(nodeDeps).toHaveLength(2);
        (0, vitest_1.expect)(nodeDeps.find(function (dep) { return dep.path === "/hi"; }).path).toEqual("/hi");
        (0, vitest_1.expect)(nodeDeps.find(function (dep) { return dep.path === "/"; }).path).toEqual("/");
        (0, vitest_1.expect)(insideOut.getTargetDependencies("/hi-header")[0]).toEqual("123");
        (0, vitest_1.expect)(insideOut.getTargetDependencies("/-header")[0]).toEqual("123");
        (0, vitest_1.expect)(insideOut.getPathDependencies("/hi")[0]).toEqual("123");
        (0, vitest_1.expect)(insideOut.getPathDependencies("/")[0]).toEqual("123");
    });
    (0, vitest_1.test)("Adding multiple node dependencies for one path", function () {
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "123",
            target: {
                id: "/-header",
                type: 0,
                path: "/",
                otherData: true
            }
        });
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "124",
            target: {
                id: "/-header",
                type: 0,
                path: "/",
                otherData: true
            }
        });
        (0, vitest_1.expect)(insideOut.getNodeDependencies("123").find(function (dep) { return dep.path === "/"; }).path).toEqual("/");
        (0, vitest_1.expect)(insideOut.getTargetDependencies("/-header")).toMatchInlineSnapshot("\n      [\n        \"123\",\n        \"124\",\n      ]\n    ");
        (0, vitest_1.expect)(insideOut.getPathDependencies("/")).toMatchInlineSnapshot("\n      [\n        \"123\",\n        \"124\",\n      ]\n    ");
    });
    (0, vitest_1.test)("querying most likely page to redirect user to for preview", function () {
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "123",
            target: {
                id: "/-header",
                type: 0,
                path: "/",
                otherData: true
            }
        });
        insideOut.createDependency({
            // Node is in a different system but the target is only knowable within
            // the current system.
            nodeId: "123",
            target: {
                id: "/hi-header",
                type: 1,
                path: "/hi",
                otherData: true
            }
        });
        var page = insideOut.getPreviewPath("123");
        (0, vitest_1.expect)(page.path).toEqual("/");
    });
});
