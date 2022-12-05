import express from 'express';
import { main, listDatabases, client } from '.';
import { MongoClient } from 'mongodb';


const router = express.Router();
// const app = express();
// wowow I don't understand this router magic but it seems really cool.
// i used to use app.get.. which was from express().. but now i use router.get... from express.Router()... 

// used to be /api/members
// gets all members..
router.get('/',(req, res)=>{
    // console.log(router.locals.db);
    listDatabases(client);
    // main(); // oh that works... so we can pass in callbacks inside the endpoint.. but how to make sure that they are connected?? main everytime??
    res.json({data: 'data'});
});

// used to be '/api/members/:id'
router.get('/:id', (req, res)=>{
    // res.send(req.params.id); // params.<whatever> can grab any url parameter.. in this case we are grabbing an id..
    // const found = members.some(member => member.id === Number(req.params.id));
    
    // did we find a member??
    // if(found){
        // res.json(members.filter((val)=>{
            // return val.id === Number(req.params.id);
        // }
        // ))
    // } else {
        // res.status(400).json({ msg: `No member with the Id of ${req.params.id}`})
    // }
});

// Create Member...
router.post('/', (req, res) => {
    // res.send(req.body) // this was doing the sending?? i'm not sure what this was doing..

    const newMember = {
        // id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }
})


export { router }