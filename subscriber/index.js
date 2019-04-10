const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

const port = 8314;

app.listen(port, ()=>{
    console.log(`http://localhost:${port}/pages/subscriber/subscriber.html`);
});