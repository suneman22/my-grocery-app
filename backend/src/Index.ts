import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

type Item = { id: string; name: string; quantity: number };
let items: Item[] = [];

app.get('/items', (req, res) => res.json(items));
app.post('/items', (req, res) => {
    const item: Item = { id: Date.now().toString(), ...req.body };
    items.push(item);
    res.json(item);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
