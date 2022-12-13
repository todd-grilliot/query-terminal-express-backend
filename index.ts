import dotenv from 'dotenv';
import { metadataType, queryType } from './types'
dotenv.config();
import express from 'express';
import { router } from './routes';
import { Collection, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const PASS = process.env.PASS;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api', router);

const uri = `mongodb+srv://tbgrilpw8:${PASS}@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority`;
export const client = new MongoClient(uri);
export const queries = client.db('query_terminal').collection('queries');
export const metadata = client.db('query_terminal').collection('metadata');
export async function main() {
    console.log('attempting to connect to client');
    await client.connect();
    console.log('connected to client');
    return 'done.';
}
main()
.then(console.log)
.catch(console.error)



export async function createQuery( reqQuery: queryType ){
    const meta = await metadata.findOne();
    const queryCount = meta?.query_count;
    const query = {...reqQuery, vetos: 0, "timestamp": Date.now(), index: queryCount + 1}
    await queries.insertOne(query);
    await metadata.updateOne({}, {$set: {"query_count": queryCount + 1}});
}

export async function readOne(collection: Collection){
    const result = await collection.findOne();
    console.log(result);
    return result;
}

// export async function veto( id: string){
//     console.log(`adding veto to ${id}`);
//     const query = await queries.findOne({"_id": id});
//     console.log('query found', query);
//     console.log(query);
//     // const vetoCount = 
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});

process.on('SIGINT', ()=>{
    console.log('SIGINT closing...');
    client.close();
    process.exit(0);
});