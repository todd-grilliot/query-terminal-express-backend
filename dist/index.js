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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const mongodb_1 = require("mongodb");
const PASS = process.env.PASS;
// try catch finally.. this is interesting syntax..
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = `mongodb+srv://tbgrilpw8:${PASS}@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority`;
        const client = new mongodb_1.MongoClient(uri);
        try {
            yield client.connect();
            yield listDatabases(client);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            yield client.close();
        }
    });
}
main().catch(console.error);
function listDatabases(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const databasesList = yield client.db().admin().listDatabases();
        console.log('Databases:');
        databasesList.databases.forEach(db => console.log(` -${db.name}`));
    });
}
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
const app = (0, express_1.default)();
console.log('anasdfdfs');
app.use('/api', routes_1.router);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
