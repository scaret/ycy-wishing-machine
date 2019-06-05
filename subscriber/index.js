const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const Memobird = require('../services/MemobirdService').Memobird;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

const port = 8314;

var ipCount = {};
setInterval(()=>{
    ipCount = {};
}, 300000);

app.post("/api/memobird/text", function(req, res, next){
    var text = req.body.text;
    var nickname = req.body.nickname;
    var deviceId = req.body.deviceId;
    var message = `${text}\n\n        ---- by ${nickname}`;
    var ip = req.headers["x-forwarded-for"];
    console.log("Received text", ip, nickname, text, deviceId);
    if (!ipCount[ip]){
        ipCount[ip] = 0;
    }
    ipCount[ip]++;
    if (ipCount[ip] > 10){
        console.error(`DDOS User ${ip}`);
        return res.end("您太频繁了");
    }
    var deviceList= ["1a495e9b9adc6b51", "1a495e9b9adc6b51", "85fb680dafb4f990"];
    new Memobird(deviceList[deviceId] || deviceList[0], function(err){
        if (err){
            console.error(err);
            res.status(500).end(err.message);
        }else{
            console.log("Success", message);
            var memobird = this;
            memobird.printText(message, function(err, data){
                if (err){
                    console.error(err);
                    res.status(500).json(err);
                }else{
                    res.json(data);
                }
            });
        }
    });
});

app.listen(port, ()=>{
    console.log(`http://localhost:${port}/`);
});