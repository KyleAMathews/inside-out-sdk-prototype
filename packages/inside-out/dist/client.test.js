"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Creates server instance & runs the same tests — just copy them over and add awaits.
var vitest_1 = require("vitest");
var client_1 = require("./client");
var service = require("./service");
var port = 11111;
var client = (0, client_1["default"])({ port: port });
(0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, service.createServer({ port: port })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
vitest_1.describe.only("stores dependencies and lets you query them", function () {
    (0, vitest_1.test)("Adding a dependency", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeDeps, targetDeps, pathDeps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("hi");
                    return [4 /*yield*/, client.createDependency({
                            // Node is in a different system but the target is only knowable within
                            // the current system.
                            nodeId: "123",
                            target: {
                                id: "/-header",
                                type: 0,
                                path: "/",
                                otherData: true
                            }
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.getNodeDependencies({ nodeId: "123" })];
                case 2:
                    nodeDeps = _a.sent();
                    return [4 /*yield*/, client.getTargetDependencies({
                            targetId: "/-header"
                        })];
                case 3:
                    targetDeps = _a.sent();
                    return [4 /*yield*/, client.getPathDependencies({ path: "/" })];
                case 4:
                    pathDeps = _a.sent();
                    (0, vitest_1.expect)(nodeDeps[0].path).toEqual("/");
                    (0, vitest_1.expect)(targetDeps[0]).toEqual("123");
                    (0, vitest_1.expect)(pathDeps[0]).toEqual("123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("Adding multiple target dependencies on one node", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeDeps, targetDepsHi, targetDepsHeader, pathDepsHi, pathDepsIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.createDependency({
                        // Node is in a different system but the target is only knowable within
                        // the current system.
                        nodeId: "123",
                        target: {
                            id: "/-header",
                            type: 0,
                            path: "/",
                            otherData: true
                        }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.createDependency({
                            // Node is in a different system but the target is only knowable within
                            // the current system.
                            nodeId: "123",
                            target: {
                                id: "/hi-header",
                                type: 0,
                                path: "/hi",
                                otherData: true
                            }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getNodeDependencies({ nodeId: "123" })];
                case 3:
                    nodeDeps = _a.sent();
                    console.log({ nodeDeps: nodeDeps });
                    (0, vitest_1.expect)(nodeDeps).toHaveLength(2);
                    (0, vitest_1.expect)(nodeDeps.find(function (dep) { return dep.path === "/hi"; }).path).toEqual("/hi");
                    (0, vitest_1.expect)(nodeDeps.find(function (dep) { return dep.path === "/"; }).path).toEqual("/");
                    return [4 /*yield*/, client.getTargetDependencies({
                            targetId: "/hi-header"
                        })];
                case 4:
                    targetDepsHi = _a.sent();
                    (0, vitest_1.expect)(targetDepsHi[0]).toEqual("123");
                    return [4 /*yield*/, client.getTargetDependencies({
                            targetId: "/hi-header"
                        })];
                case 5:
                    targetDepsHeader = _a.sent();
                    (0, vitest_1.expect)(targetDepsHeader[0]).toEqual("123");
                    return [4 /*yield*/, client.getPathDependencies({ path: "/hi" })];
                case 6:
                    pathDepsHi = _a.sent();
                    (0, vitest_1.expect)(pathDepsHi[0]).toEqual("123");
                    return [4 /*yield*/, client.getPathDependencies({ path: "/" })];
                case 7:
                    pathDepsIndex = _a.sent();
                    (0, vitest_1.expect)(pathDepsIndex[0]).toEqual("123");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("Adding multiple node dependencies for one path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var nodeDeps, targetDeps, pathDeps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.createDependency({
                        // Node is in a different system but the target is only knowable within
                        // the current system.
                        nodeId: "123",
                        target: {
                            id: "/-header",
                            type: 0,
                            path: "/",
                            otherData: true
                        }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.createDependency({
                            // Node is in a different system but the target is only knowable within
                            // the current system.
                            nodeId: "124",
                            target: {
                                id: "/-header",
                                type: 0,
                                path: "/",
                                otherData: true
                            }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getNodeDependencies({ nodeId: "123" })];
                case 3:
                    nodeDeps = _a.sent();
                    (0, vitest_1.expect)(nodeDeps.find(function (dep) { return dep.path === "/"; }).path).toEqual("/");
                    return [4 /*yield*/, client.getTargetDependencies({
                            targetId: "/-header"
                        })];
                case 4:
                    targetDeps = _a.sent();
                    console.log({ targetDeps: targetDeps });
                    (0, vitest_1.expect)(targetDeps).toMatchInlineSnapshot("\n      [\n        \"123\",\n        \"124\",\n      ]\n    ");
                    return [4 /*yield*/, client.getPathDependencies({ path: "/" })];
                case 5:
                    pathDeps = _a.sent();
                    (0, vitest_1.expect)(pathDeps).toMatchInlineSnapshot("\n      [\n        \"123\",\n        \"124\",\n      ]\n    ");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.test)("querying most likely page to redirect user to for preview", function () { return __awaiter(void 0, void 0, void 0, function () {
        var page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.createDependency({
                        // Node is in a different system but the target is only knowable within
                        // the current system.
                        nodeId: "123",
                        target: {
                            id: "/-header",
                            type: 0,
                            path: "/",
                            otherData: true
                        }
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.createDependency({
                            // Node is in a different system but the target is only knowable within
                            // the current system.
                            nodeId: "123",
                            target: {
                                id: "/hi-header",
                                type: 1,
                                path: "/hi",
                                otherData: true
                            }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.getPreviewPath({ nodeId: "123" })];
                case 3:
                    page = _a.sent();
                    (0, vitest_1.expect)(page.path).toEqual("/");
                    return [2 /*return*/];
            }
        });
    }); });
});
