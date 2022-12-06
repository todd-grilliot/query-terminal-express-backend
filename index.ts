import dotenv from 'dotenv';
import { metadataType, queryType } from './types'
dotenv.config();
import express from 'express';
import { router } from './routes';
import { Collection, MongoClient, ServerApiVersion } from 'mongodb';

const PASS = process.env.PASS;
let documentCount: number;


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api', router);



const uri = `mongodb+srv://tbgrilpw8:${PASS}@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority`;
export const client = new MongoClient(uri);
export const queries = client.db('query_terminal').collection('queries');
export const metadata = client.db('query_terminal').collection('metadata');
export async function main() {
    await client.connect();
    return 'done.';
}
main()
.then(console.log)
.catch(console.error)

    
// export async function listDatabases(client: MongoClient){
//     const databasesList = await client.db().admin().listDatabases();
    
    
//     console.log('Databases:');
//     databasesList.databases.forEach((db) => console.log(` -${db.name}`));
// }

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
// listDatabases(client);
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
    //   const collection = client.db("test").collection("devices");
    //   // perform actions on the collection object
    //   client.close();
    // });
    

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});

process.on('SIGINT', ()=>{
    client.close();
    console.log('disconnected Mongo');
    process.exit(0);
});