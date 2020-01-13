
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');


        if(isFirtsUse()){
            getUserId();
        }
        else {
            console.log("no first use. sessionId: "+localStorage.getItem("sessionId"));
            getUserData();
        }

        $("#goToMapButton").click(function(){
            console.log("goToMapButton clicked");
            window.location = "map.html";
        });
        $("#goToRankingButton").click(function(){
            console.log("goToRankingButton clicked");
            window.location = "ranking.html";
        });

        $("#playerImageNewImageButton").click(function () {
            console.log("goToRankingButton playerImageNewImageButton");
        });
        $("#playerEditNameButton").click(function () {
            console.log("playerEditNameButton playerImageNewImageButton");

            $("#userNameLabel").css("display", "none");
            $("#newUserName").css("display", "inline");
            $("#playerEditNameButton").css("display", "none");
            $("#playerEditNameDeleteButton").css("display", "inline");

        });
        $("#newUserName").keyup(function () {
            if($("#newUserName").val() != ""){
                $("#playerEditNameDeleteButton").css("display", "none");
                $("#playerEditSaveButton").css("display", "inline");
            }
            else {
                $("#playerEditSaveButton").css("display", "none");
                $("#playerEditNameDeleteButton").css("display", "inline");

            }
        });

        $("#playerEditNameDeleteButton").click(function () {
            $("#newUserName").css("display", "none");
            $("#userNameLabel").css("display", "inline");
            $("#playerEditNameDeleteButton").css("display", "none");
            $("#playerEditNameButton").css("display", "inline");
        });

        $("#playerEditSaveButton").click(function () {
            changeName($("#newUserName").val());
            $("#newUserName").css("display", "none");
            $("#userNameLabel").css("display", "inline");
            $("#playerEditSaveButton").css("display", "none");
            $("#playerEditNameButton").css("display", "inline");
        });



    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};




const BASE_URL = "https://ewserver.di.unimi.it/mobicomp/mostri/";

function isFirtsUse(){
    return localStorage.getItem("sessionId")==null
}
function getUserId(){
    $.ajax({
        method: 'get',
        url: BASE_URL+"register.php",
        dataType: 'json',
        success: function(result) {
            console.log(result.session_id);
            localStorage.setItem("sessionId", result.session_id);
            getUserData();
        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });
}


function getUserData(){
    $.ajax({
        method: 'post',
        url:BASE_URL+"getprofile.php",
        data: JSON.stringify(
            {
                session_id : localStorage.getItem("sessionId")
            }),
        dataType: 'json',
        success: function(result) {
            console.log(result);
            if(result.username == null){
                sessionStorage.setItem("userName", "Guerriero senza nome");
            }
            else {
                sessionStorage.setItem("userName", result.username);
            }
            sessionStorage.setItem("userImg", result.img);
            sessionStorage.setItem("userLp", result.lp);
            sessionStorage.setItem("userXp", result.xp);
            showUserData();
        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });
}

function showUserData(){
    $("#userNameLabel").html(sessionStorage.getItem("userName"));
    $("#userLpLabel").html(sessionStorage.getItem("userLp"));
    $("#userXpLabel").html(sessionStorage.getItem("userXp"));
}


function changeName(newName){
    sessionStorage.setItem("userName", newName);

    $.ajax({
        method: 'post',
        url:BASE_URL+"setprofile.php",
        data: JSON.stringify(
            {
                session_id : localStorage.getItem("sessionId"),
                username : newName
            }),
        dataType: 'json',
        success: function(result) {
            console.log(result);
            showUserData();
        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });
}
