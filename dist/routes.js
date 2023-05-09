"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const router = express_1.default.Router();
exports.router = router;
// will we need to get by id? should users be able to delete? probs veto is enough..
//users can answer questions.. they can create questions.. and they can veto... is that the whole of it?
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, _1.readOne)(_1.queries);
    res.json(data);
}));
router.put('/answer/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id.length !== 24)
        return res.status(400).json({ msg: 'id is not a string of 24 hex characters' });
    if (!req.body.answer)
        return res.status(400).json({ msg: 'no answer included in the body' });
    const orgQuery = yield (0, _1.answerQuery)(req.params.id, req.body.answer);
    if (!(orgQuery === null || orgQuery === void 0 ? void 0 : orgQuery.answer))
        return res.status(400).json(Object.assign(Object.assign({}, orgQuery), { msg: 'original query is missing answer field' }));
    return res.json(orgQuery);
}));
router.post('/create', (req, res) => {
    if (!req.body.query)
        return res.status(400).json({ msg: 'no query included in the body' });
    if (!req.body.answer)
        return res.status(400).json({ msg: 'no answer included in the body' });
    const query = (0, _1.createQuery)(req.body);
    res.send(!!query);
});
router.put('/veto/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id.length !== 24)
        return res.status(400).json({ msg: 'id is not a string of 24 hex characters' });
    const vetoCount = yield (0, _1.veto)(req.params.id);
    if (vetoCount === (null || undefined))
        return res.status(400).json({ msg: 'query failed' });
    if (vetoCount === -1)
        return res.json({ msg: `id ${req.params.id} has been deleted` });
    res.json({ msg: `id ${req.params.id} currently has ${vetoCount + 1} vetos` });
}));
