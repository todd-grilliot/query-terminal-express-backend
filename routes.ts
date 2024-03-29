import express from 'express';
import { main, client, createQuery, readOneQuery, queries, metadata, veto, answerQuery } from '.';
import { queryType } from './types';
import { MongoClient } from 'mongodb';

const router = express.Router();


// will we need to get by id? should users be able to delete? probs veto is enough..
//users can answer questions.. they can create questions.. and they can veto... is that the whole of it?

router.get('/', async (req, res) => {
    const data = await readOneQuery(queries);
    if(!data) res.status(400).json({msg: 'query failed'});
    res.json(data);
});

router.put('/answer/:id', async (req, res) => {
    if (req.params.id.length !== 24)
    return res.status(400).json({msg: 'id is not a string of 24 hex characters'});
    if(!req.body.answer) 
    return res.status(400).json({msg: 'no answer included in the body'});

    const orgQuery = await answerQuery(req.params.id, req.body.answer);
    if(!orgQuery?.answer)
    return res.status(400).json({...orgQuery, msg: 'original query is missing answer field'});
    
    return res.json(orgQuery);
});


router.post('/create', (req, res) => {
    if(!req.body.query)
        return res.status(400).json({msg: 'no query included in the body'});

    if(!req.body.answer) 
        return res.status(400).json({msg: 'no answer included in the body'});

    const query = createQuery( req.body );
    res.send(!!query);
});

router.put('/veto/:id', async (req, res) => {

    if (req.params.id.length !== 24)
        return res.status(400).json({msg: 'id is not a string of 24 hex characters'});

    const vetoCount: number = await veto(req.params.id);

    if(vetoCount === (null || undefined))
        return res.status(400).json({msg: 'query failed'});

    if(vetoCount === -1)
        return res.json({msg: `id ${req.params.id} has been deleted`});
    
    res.json({msg: `id ${req.params.id} currently has ${vetoCount + 1} vetos`});
});


export { router }