
$(function() {

    getMapObjects();


    $("#map").css("height", $(window).height());



    $("#backButton").click(function () {
        window.location = "index.html";
    });









    mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGVsZWZpb3JpIiwiYSI6ImNrMzRhcG56MDA1dnMzZGx0a2F2ZGh2bzMifQ.xAwunHM49L77LfvoIerzYg';

    var map = new mapboxgl.Map({
        container: 'map',
        center: new mapboxgl.LngLat(45.533600, 9.034100),
        style: 'mapbox://styles/michelefiori/ck3g2w4xm03rc1cpijwkgk2h4',
    });

});



const BASE_URL = "https://ewserver.di.unimi.it/mobicomp/mostri/";
var mapObjects;

function getMapObjects(){
    $.ajax({
        method: 'post',
        url:BASE_URL+"getmap.php",
        data: JSON.stringify(
            {
                session_id : localStorage.getItem("sessionId")
            }),
        dataType: 'json',
        success: function(result) {
            console.log(result);
            mapObjects = result.mapObjects;
            console.log(mapObjects);
        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });
}