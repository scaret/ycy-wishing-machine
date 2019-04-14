const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const Memobird = require('../services/MemobirdService').Memobird;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

const port = 8314;

app.get("/", (req, res)=>{
    res.redirect("/pages/subscriber/subscriber.html");
});

app.post("/api/memobird/text", function(req, res, next){
    var text = req.body.text;
    var nickname = req.body.nickname;
    var message = `${nickname} 说：\n${text}`;
    console.log("Received text", nickname, text);
    new Memobird("1a495e9b9adc6b51", function(err){
        if (err){
            console.error(err);
            res.status(500).end(err);
        }else{
            var memobird = this;
            memobird.printText(message, function(err, data){
                if (err){
                    console.error(err);
                    res.status(500).end(err);
                }else{
                    res.json(data);
                }
            });
        }
    });
});

app.listen(port, ()=>{
    console.log(`http://localhost:${port}/pages/subscriber/subscriber.html`);
});