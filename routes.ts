import express from 'express';
import { main, client, createQuery, readOne, queries, metadata} from '.';
import { MongoClient } from 'mongodb';


const router = express.Router();

router.get('/', async (req, res) => {
    const data = await readOne(queries);
    res.json(data);
});

// will we need to get by id? should users be able to delete? probs veto is enough..
//users can answer questions.. they can create questions.. and they can veto... is that the whole of it?

router.post('/', (req, res) => {
    if(!req.body.query)
        return res.status(400).json({msg: 'no query included in the body'});

    if(!req.body.answer) 
        return res.status(400).json({msg: 'no answer included in the body'});

    const query = createQuery( req.body );
    res.json(query);
});

router.put('/:id', (req, res) => {
    // veto(req.params.id);
    res.json({msg: `adding veto to ${req.params.id}`});
});


export { router }