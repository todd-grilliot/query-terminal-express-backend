import dotenv from 'dotenv';
import { metadataType, queryType } from './types'
dotenv.config();
import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { Collection, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const PASS = process.env.PASS;

const app = express();
app.use(cors());
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
    const queriesCreated = meta?.queries_created;
    const query = {
        ...reqQuery,
        vetos: 0,
        creation_timestamp: Date.now(),
        index: queriesCreated + 1,
        answer_count: 1,
        author: 'anon',
    }
    await queries.insertOne(query);
    await metadata.updateOne({}, { $set: {"queries_created": queriesCreated + 1 }});
}

export async function answerQuery( id: string, answer: string ){
    const query = await queries.findOne({ _id: new ObjectId(id) });

    try { await queries.updateOne({ _id: new ObjectId(id) }, { $set: {"answer": answer }}) }
    catch (error) { console.error(`error in answerQuery: ${error}`) }

    return query;
}

export async function readOne(collection: Collection){
    const meta = await metadata.findOne();
    const queryCount = meta?.queries_created - meta?.queries_deleted;
    const randomIndex = Math.floor(Math.random() * queryCount);
    console.log('randomIndex', randomIndex);

    // const result = await collection.findOne();
    const result = await collection.findOne({}, {skip: randomIndex});

    return result;
}

export async function veto( id: string){
    const query = await queries.findOne({ _id: new ObjectId(id) });
    let vetoCount = query?.vetos;

    if(vetoCount >= 5){
        console.log('deleting it')
        const meta = await metadata.findOne();
        const queriesDeleted = meta?.queries_deleted;
        //these calls might all need validation to make sure they go through before the action is recorded..
        await queries.deleteOne({ _id: new ObjectId(id) });
        await metadata.updateOne({}, { $set: {"queries_deleted": queriesDeleted + 1 }});
        vetoCount = -1;
    }else{
        console.log('updating')
        await queries.updateOne({ _id: new ObjectId(id) }, { $set: {"vetos": vetoCount + 1 }});
    }

    return vetoCount;
    //we want to know if it exists, if we found it.. then we want to know the length.. or else that it was deleted.
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});

process.on('SIGINT', ()=>{
    console.log('SIGINT closing...');
    client.close();
    process.exit(0);
});