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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.veto = exports.readOneQuery = exports.answerQuery = exports.createQuery = exports.main = exports.metadata = exports.queries = exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const mongodb_1 = require("mongodb");
const PASS = process.env.PASS;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api', routes_1.router);
const uri = `mongodb+srv://tbgrilpw8:${PASS}@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority`;
exports.client = new mongodb_1.MongoClient(uri);
exports.queries = exports.client.db('query_terminal').collection('queries');
exports.metadata = exports.client.db('query_terminal').collection('metadata');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('attempting to connect to client');
        yield exports.client.connect();
        console.log('connected to client');
        return 'done.';
    });
}
exports.main = main;
main()
    .then(console.log)
    .catch(console.error);
function createQuery(reqQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = yield exports.metadata.findOne();
        if (!meta)
            return console.warn('no metaData found');
        const queriesCreated = meta === null || meta === void 0 ? void 0 : meta.queries_created;
        const query = Object.assign(Object.assign({}, reqQuery), { vetos: 0, creation_timestamp: Date.now(), index: queriesCreated + 1, answer_count: 1, author: 'anon' });
        yield exports.queries.insertOne(query);
        yield exports.metadata.updateOne({}, { $set: { "queries_created": queriesCreated + 1 } });
    });
}
exports.createQuery = createQuery;
function answerQuery(id, answer) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = yield exports.queries.findOne({ _id: new mongodb_1.ObjectId(id) });
        try {
            yield exports.queries.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { "answer": answer, "updates": ((_a = query === null || query === void 0 ? void 0 : query.updates) !== null && _a !== void 0 ? _a : 0) + 1 } });
        }
        catch (error) {
            console.error(`error in answerQuery: ${error}`);
        }
        return query;
    });
}
exports.answerQuery = answerQuery;
function readOneQuery(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = yield exports.metadata.findOne();
        if (!meta)
            return console.warn('no metaData found');
        const queryCount = (meta === null || meta === void 0 ? void 0 : meta.queries_created) - (meta === null || meta === void 0 ? void 0 : meta.queries_deleted);
        const randomIndex = Math.floor(Math.random() * queryCount);
        const res = yield collection.findOne({}, { skip: randomIndex });
        if (!res)
            return console.warn('no query found: ', res);
        const { answer } = res, result = __rest(res, ["answer"]);
        return result;
    });
}
exports.readOneQuery = readOneQuery;
function veto(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = yield exports.queries.findOne({ _id: new mongodb_1.ObjectId(id) });
        let vetoCount = query === null || query === void 0 ? void 0 : query.vetos;
        if (vetoCount >= 5) {
            console.log('deleting it');
            const meta = yield exports.metadata.findOne();
            const queriesDeleted = meta === null || meta === void 0 ? void 0 : meta.queries_deleted;
            //these calls might all need validation to make sure they go through before the action is recorded..
            yield exports.queries.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            yield exports.metadata.updateOne({}, { $set: { "queries_deleted": queriesDeleted + 1 } });
            vetoCount = -1;
        }
        else {
            console.log('updating');
            yield exports.queries.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { "vetos": vetoCount + 1 } });
        }
        return vetoCount;
        //we want to know if it exists, if we found it.. then we want to know the length.. or else that it was deleted.
    });
}
exports.veto = veto;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
process.on('SIGINT', () => {
    console.log('SIGINT closing...');
    exports.client.close();
    process.exit(0);
});
