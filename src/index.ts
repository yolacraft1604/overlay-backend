import {getMatchByPlayerName, getMatches, startTracking} from "./Storage/matches.js";
import express, { Request, Response } from 'express';


startTracking()

const app = express();

app.get('/api/getMatch/:text', (req: Request, res: Response) => {
    const inputText = req.params.text;

    const answer = getMatchByPlayerName(inputText);

    res.json(
        {
            "data": answer,
        }
    );
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});