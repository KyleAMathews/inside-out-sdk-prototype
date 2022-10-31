"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var got_1 = require("got");
function createDependency(_a) {
    var nodeId = _a.nodeId, target = _a.target, clientOptions = _a.clientOptions;
    return __awaiter(this, void 0, void 0, function () {
        var url, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("/create-dependency", "http://localhost:".concat(clientOptions.port));
                    return [4 /*yield*/, got_1["default"].post(url, { json: { nodeId: nodeId, target: target } })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, result.body];
            }
        });
    });
}
function getNodeDependencies(_a) {
    var nodeId = _a.nodeId, clientOptions = _a.clientOptions;
    return __awaiter(this, void 0, void 0, function () {
        var url, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("/node-dependencies", "http://localhost:".concat(clientOptions.port));
                    url.searchParams.append("nodeId", nodeId);
                    return [4 /*yield*/, (0, got_1["default"])(url).json()];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function getTargetDependencies(_a) {
    var targetId = _a.targetId, clientOptions = _a.clientOptions;
    return __awaiter(this, void 0, void 0, function () {
        var url, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("/target-dependencies", "http://localhost:".concat(clientOptions.port));
                    url.searchParams.append("targetId", targetId);
                    return [4 /*yield*/, (0, got_1["default"])(url).json()];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function getPathDependencies(_a) {
    var path = _a.path, clientOptions = _a.clientOptions;
    return __awaiter(this, void 0, void 0, function () {
        var url, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("/path-dependencies", "http://localhost:".concat(clientOptions.port));
                    url.searchParams.append("path", path);
                    return [4 /*yield*/, (0, got_1["default"])(url).json()];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function getPreviewPath(_a) {
    var nodeId = _a.nodeId, clientOptions = _a.clientOptions;
    return __awaiter(this, void 0, void 0, function () {
        var url, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = new URL("/preview-path", "http://localhost:".concat(clientOptions.port));
                    url.searchParams.append("nodeId", nodeId);
                    return [4 /*yield*/, (0, got_1["default"])(url).json()];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function client(clientOptions) {
    return {
        createDependency: function (args) { return createDependency(__assign(__assign({}, args), { clientOptions: clientOptions })); },
        getNodeDependencies: function (args) {
            return getNodeDependencies(__assign(__assign({}, args), { clientOptions: clientOptions }));
        },
        getTargetDependencies: function (args) {
            return getTargetDependencies(__assign(__assign({}, args), { clientOptions: clientOptions }));
        },
        getPathDependencies: function (args) {
            return getPathDependencies(__assign(__assign({}, args), { clientOptions: clientOptions }));
        },
        getPreviewPath: function (args) { return getPreviewPath(__assign(__assign({}, args), { clientOptions: clientOptions })); }
    };
}
exports["default"] = client;
