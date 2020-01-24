
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

        var lat = null;
        var lon = null;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setPosition);
        }
        else{

        }

        function setPosition(position) {
            /*todo alert("Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude);*/

            lat = position.coords.latitude;
            lon = position.coords.longitude;

            sessionStorage.setItem("currentLat",lat);
            sessionStorage.setItem("currentLon",lon);
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
            console.log("playerImageNewImageButton playerImageNewImageButton");
            /*TODO questo se voglio caricarlo dalla camera

                    navigator.camera.getPicture(onSuccess, onFail, { quality: 20,
                        destinationType: Camera.DestinationType.FILE_URL
                    });
                     */
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 20,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    destinationType: Camera.DestinationType.FILE_URL

                });

        });

        // Change image source
        function onSuccess(imageData) {
            getFileContentAsBase64(imageData,function (base64Image) {
                //alert(base64Image);
                $("#playerImage").attr("style","background-image: url('"+base64Image+"')");


                if(base64Image.length >= 137000) {
                    alert("Immagine troppo grande");
                }
                else{
                    uploadImage(base64Image);
                }

            });

        }

        function onFail(message) {
            alert('Spiacenti, si è verificato un errore: ' + message);

        }






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
    $("#playerImage").attr("style","background-image: url('data:image/png;base64, "+sessionStorage.getItem("userImg")+"')");
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




function uploadImage(img){

    var imgb64 = img.substring(img.indexOf("base64,")+7);

    console.log(img);
    console.log(imgb64);

    sessionStorage.setItem("userImg", imgb64);

    $.ajax({
        method: 'post',
        url:BASE_URL+"setprofile.php",
        data: JSON.stringify(
            {
                session_id : localStorage.getItem("sessionId"),
                img : imgb64
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



/**
 * This function will handle the conversion from a file to base64 format
 *
 * @path string
 * @callback function receives as first parameter the content of the image
 *
 * https://ourcodeworld.com/articles/read/80/how-to-convert-a-image-from-the-device-to-base64-with-javascript-in-cordova
 */
function getFileContentAsBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);

    function fail(e) {
        alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var content = this.result;
                callback(content);
            };
            // The most important point, use the readAsDatURL Method from the file plugin
            reader.readAsDataURL(file);
        });
    }
}