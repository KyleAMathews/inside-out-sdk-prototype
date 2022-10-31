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
exports.createServer = exports.getPathDependencies = exports.getTargetDependencies = exports.getPreviewPath = exports.getNodeDependencies = exports.createDependency = void 0;
var better_sqlite3_1 = require("better-sqlite3");
var express = require("express");
var options = {
    verbose: console.log
};
var dbPath = "";
if (process.env.TEST) {
    dbPath = ":memory:";
}
else {
    dbPath = "inside-out-service.db";
}
var db = new better_sqlite3_1["default"](dbPath, options);
db.pragma("journal_mode = WAL");
var nodesTable = "CREATE TABLE IF NOT EXISTS nodes('id' TEXT PRIMARY KEY NOT NULL)";
var targetsTable = "CREATE TABLE IF NOT EXISTS targets(\n  id TEXT PRIMARY KEY NOT NULL,\n  path TEXT,\n  type INTEGER\n)";
var nodesDepsTable = "CREATE TABLE nodeDeps(\n    node_id TEXT NOT NULL,\n    target_id TEXT NOT NULL,\n    UNIQUE(node_id, target_id)\n)";
var pathDepsTable = "CREATE TABLE pathDeps(\n    node_id TEXT NOT NULL,\n    path TEXT NOT NULL,\n    UNIQUE(node_id, path)\n)";
db.exec(nodesTable);
db.exec(targetsTable);
db.exec(nodesDepsTable);
db.exec(pathDepsTable);
function createDependency(_a) {
    var nodeId = _a.nodeId, target = _a.target;
    var insertNode = db.prepare("INSERT OR IGNORE INTO nodes (id) VALUES (@nodeId)");
    var insertTarget = db.prepare("INSERT OR IGNORE INTO targets (id, path, type) VALUES (@id, @path, @type)");
    var insertNodeDep = db.prepare("INSERT OR IGNORE INTO nodeDeps (node_id, target_id) VALUES (@nodeId, @targetId)");
    var insertPathDep = db.prepare("INSERT OR IGNORE INTO pathDeps (node_id, path) VALUES (@nodeId, @path)");
    var insert = db.transaction(function (_a) {
        var nodeId = _a.nodeId, target = _a.target;
        insertNode.run({ nodeId: nodeId });
        insertTarget.run(target);
        insertNodeDep.run({ nodeId: nodeId, targetId: target.id });
        insertPathDep.run({ nodeId: nodeId, path: target.path });
    });
    insert({ nodeId: nodeId, target: target });
}
exports.createDependency = createDependency;
/*
 * Useful for invalidating targets + contentsync
 */
function getNodeDependencies(nodeId) {
    var stmt = db.prepare("SELECT\n                            id, type, path\n                          FROM targets\n                          WHERE id\n                          IN (\n                            SELECT target_id\n                            FROM nodeDeps\n                            WHERE node_id=?\n                          )");
    var results = stmt.all(nodeId);
    console.log({ results: results });
    return results;
}
exports.getNodeDependencies = getNodeDependencies;
function getPreviewPath(nodeId) {
    var nodeTargets = getNodeDependencies(nodeId);
    // Some sort of ranking — for now we'll sort by dependencyType (int from 0-5).
    return nodeTargets.sort(function (t) { return t.type; })[0];
}
exports.getPreviewPath = getPreviewPath;
/*
 * Useful for contentsync
 */
function getTargetDependencies(targetId) {
    var stmt = db.prepare("SELECT node_id, target_id from nodeDeps where target_id=?");
    var results = stmt.all(targetId);
    console.log({ results: results });
    return results.map(function (result) { return result.node_id; });
}
exports.getTargetDependencies = getTargetDependencies;
/*
 * Useful for contentsync
 */
function getPathDependencies(path) {
    var stmt = db.prepare("SELECT node_id from pathDeps where path=?");
    var results = stmt.all(path);
    console.log({ results: results });
    return results.map(function (result) { return result.node_id; });
    // return [...pathDeps.get(targetId)]
}
exports.getPathDependencies = getPathDependencies;
function createServer(options) {
    return __awaiter(this, void 0, void 0, function () {
        var app;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log({ options: options });
                    console.log("creating a server");
                    app = express["default"]();
                    app.use(express.json());
                    app.get("/", function (req, res) {
                        res.send("Express + TypeScript Server");
                    });
                    app.post("/create-dependency", function (req, res) {
                        console.log(req.body);
                        try {
                            createDependency(req.body);
                            res.send("ok");
                        }
                        catch (e) {
                            console.log(e);
                            res.statusCode(500).send("error");
                        }
                    });
                    app.get("/node-dependencies", function (req, res) {
                        try {
                            res.json(getNodeDependencies(req.query.nodeId));
                        }
                        catch (e) {
                            console.log(e);
                            res.statusCode(500).send("error");
                        }
                    });
                    app.get("/target-dependencies", function (req, res) {
                        try {
                            res.json(getTargetDependencies(req.query.targetId));
                        }
                        catch (e) {
                            console.log(e);
                            res.statusCode(500).send("error");
                        }
                    });
                    app.get("/path-dependencies", function (req, res) {
                        try {
                            res.json(getPathDependencies(req.query.path));
                        }
                        catch (e) {
                            console.log(e);
                            res.statusCode(500).send("error");
                        }
                    });
                    app.get("/preview-path", function (req, res) {
                        try {
                            res.json(getPreviewPath(req.query.nodeId));
                        }
                        catch (e) {
                            console.log(e);
                            res.statusCode(500).send("error");
                        }
                    });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            app.listen(options.port, function () {
                                console.log("[server]: Server is running at https://localhost:".concat(options.port));
                                resolve(null);
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.createServer = createServer;
