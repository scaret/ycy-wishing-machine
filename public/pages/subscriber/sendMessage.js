var sending = false;
function sendTextMessage(id){
    var elem = document.getElementById("textMessage" + id);
    var text = elem.value;
    if (!sending && text){
        sending = true;
        axios.post("/api/memobird/text", {
            deviceId: id,
            nickname: nickname,
            text: text
        }).then(function(resp){
            sending = false;
            console.log(resp);
            elem.value = "";
            $("#sendTextModal" + id).modal('hide');
        }).catch(function(e){
            console.error(e);
            sending = false;
        });
    }
};