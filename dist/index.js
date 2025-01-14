import { getMatchByPlayerName, startTracking } from "./Storage/matches.js";
import express from 'express';
startTracking();
const app = express();
app.get('/api/getMatch/:text', (req, res) => {
    const inputText = req.params.text;
    const answer = getMatchByPlayerName(inputText);
    res.json({
        "data": answer,
    });
});
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map