import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { router } from './routes';
import { MongoClient, ServerApiVersion } from 'mongodb';

const PASS = process.env.PASS;


const app = express();
app.use('/api', router);


const uri = `mongodb+srv://tbgrilpw8:${PASS}@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority`;
export const client = new MongoClient(uri);
export async function main() {
        await client.connect();
        // await listDatabases(client);

        // const db = client.db('query_terminal');
        app.locals.db = client.db('query_terminal');
        const collection = app.locals.db.collection('queries');

        // console.log(app.locals.db);

        // const insertResult = await collection.insertMany([{a: 1}, {b: 2}, {c: 3}]);
        // console.log(`inserted:`, insertResult);
        // console.log(`is connected ${await client.isConnected}`)

        // const PORT = process.env.PORT || 5000;
        // app.listen(PORT, ()=>{
        //     console.log(`server started on port ${PORT}`);
        // });
        
        return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    // .finally(() => client.close());

    
    export async function listDatabases(client: MongoClient){
        const databasesList = await client.db().admin().listDatabases();
        
        
        console.log('Databases:');
        databasesList.databases.forEach((db) => console.log(` -${db.name}`));
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