import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { router } from './routes';
import { MongoClient, ServerApiVersion } from 'mongodb';

const PASS = process.env.PASS;

// try catch finally.. this is interesting syntax..
async function main() {
    const uri = `mongodb+srv://tbgrilpw8:${PASS}@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await listDatabases(client);

    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();

    console.log('Databases:');
    databasesList.databases.forEach(db => console.log(` -${db.name}`));
}
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
    //   const collection = client.db("test").collection("devices");
    //   // perform actions on the collection object
    //   client.close();
    // });
    
const app = express();
console.log('anasdfdfs');

app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
});