const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const cors = require('cors');
const path = require('path');


app.listen(5001);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use ( bodyParser.json( { type: "*/*" } ));

app.use(express.static(__dirname + '/'));

app.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.sendFile(path.join(__dirname + 'index.html'));
});