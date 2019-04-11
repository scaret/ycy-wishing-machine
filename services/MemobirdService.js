var request = require("request");
var moment = require("moment");
var iconv = require('iconv-lite');

var access_key = "7b9fc31e8f834245acdea01eb189e317";

var getOptions = function(){
  return {
    ak: access_key,
    timestamp: moment().format("YYYY-MM-DD hh:mm:ss")
  };
};

var base64_en = function(text){
  return Buffer.from(iconv.encode(text, 'GBK')).toString('base64');
};

function Memobird(memobirdID, callback){
  var self = this;
  self.memobirdID = memobirdID;
  var options = getOptions();
  options.memobirdID = memobirdID;

  var reqOpt = {
    uri: "http://open.memobird.cn/home/setuserbind",
    method: "post",
    form: options
  };
  request(reqOpt, function(err, res, body){
    if (err){
      console.error(err);
      return callback(err);
    }
    try{
      var data = JSON.parse(body);
    }catch(e){
      return callback.call(self, e);
    }
    if (data && data.showapi_userid){
      self.userid = data.showapi_userid;
      callback.call(self, null);
    }else{
      callback.call(self, data);
    }
  }) ;
}

Memobird.prototype.printText = function (text, callback){
  var self = this;
  var options = getOptions();

  options.printcontent = "T:" + base64_en(text);
  options.memobirdID = self.memobirdID;
  options.userid = self.userid;

  var reqOpt = {
    uri: "http://open.memobird.cn/home/printpaper",
    method: "post",
    form: options
  };

  request(reqOpt, function(err, res, body){
    var data = JSON.parse(body);
    if (callback){
      if (data && data.result){
        callback(null, data);
      }
      else{
        callback(err);
      }
    }
  }) ;
};
/*
new Memobird("1a495e9b9adc6b51", function(){
  var memobird = this;
  memobird.printText("Hello, World");
});
*/
module.exports.Memobird = Memobird;
