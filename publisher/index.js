const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

const port = 8313;

app.listen(port, ()=>{
    console.log(`http://localhost:${port}/pages/publisher/publisher.html`);
});