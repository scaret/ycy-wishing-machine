var sending = false;
function sendTextMessage(){
    var elem = document.getElementById("textMessage")
    var text = elem.value;
    if (!sending && text){
        sending = true;
        axios.post("/api/memobird/text", {
            nickname: nickname,
            text: text
        }).then(function(resp){
            sending = false;
            console.log(resp);
            elem.value = "";
            $("#sendTextModal").modal('hide');
        }).catch(function(e){
            console.error(e);
            sending = false;
        });
    }
};