const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Test-Verse API is up and already for your use...' });
});