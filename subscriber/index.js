const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

const port = 8314;

app.get("/", (req, res)=>{
    res.redirect("/pages/subscriber/subscriber.html");
});

app.listen(port, ()=>{
    console.log(`http://localhost:${port}/pages/subscriber/subscriber.html`);
});