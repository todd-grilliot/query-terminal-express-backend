import express from 'express';
import { router } from './routes';
import { MongoClient, ServerApiVersion } from 'mongodb';


const PASS = process.env.PASS;
console.log('pass', PASS);
const uri = "mongodb+srv://tbgrilpw8:1011087Grill0t@clusterqueryterminal.w4lvodt.mongodb.net/?retryWrites=true&w=majority";

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