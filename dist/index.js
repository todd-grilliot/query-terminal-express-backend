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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOne = exports.createQuery = exports.main = exports.metadata = exports.queries = exports.client = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const mongodb_1 = require("mongodb");
const PASS = process.env.PASS;
const app = (0, express_1.default)();
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
        const queryCount = meta === null || meta === void 0 ? void 0 : meta.query_count;
        const query = Object.assign(Object.assign({}, reqQuery), { vetos: 0, "timestamp": Date.now(), index: queryCount + 1 });
        yield exports.queries.insertOne(query);
        yield exports.metadata.updateOne({}, { $set: { "query_count": queryCount + 1 } });
    });
}
exports.createQuery = createQuery;
function readOne(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield collection.findOne();
        console.log(result);
        return result;
    });
}
exports.readOne = readOne;
// export async function veto( id: string){
//     console.log(`adding veto to ${id}`);
//     const query = await queries.findOne({"_id": id});
//     console.log('query found', query);
//     console.log(query);
//     // const vetoCount = 
// }
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
process.on('SIGINT', () => {
    exports.client.close();
    console.log('disconnected Mongo');
    process.exit(0);
});
