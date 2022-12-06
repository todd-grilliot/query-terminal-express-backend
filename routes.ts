import express from 'express';
import { main, client, createQuery, readOne, queries, metadata } from '.';
import { MongoClient } from 'mongodb';


const router = express.Router();
// const app = express();
// wowow I don't understand this router magic but it seems really cool.
// i used to use app.get.. which was from express().. but now i use router.get... from express.Router()... 

// used to be /api/members
// gets all members..
router.get('/', async (req, res) => {
    const data = await readOne(queries);
    res.json(data);
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

router.post('/', (req, res) => {
    if(!req.body.query)
        return res.status(400).json({msg: 'no query included in the body'});

    if(!req.body.answer) 
        return res.status(400).json({msg: 'no answer included in the body'});

    const query = createQuery( req.body );
    res.json(query);
})

router.put('/:id', (req, res) => {
    console.log(`adding one veto to ${req.params.id}`);
    res.json({msg: 'updating +1 veto'});
})


export { router }