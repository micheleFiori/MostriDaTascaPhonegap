var map;

$(function() {

    getMapObjects();


    $("#map").css("height", $(window).height());



    $("#backButton").click(function () {
        window.location = "index.html";
    });



    mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGVsZWZpb3JpIiwiYSI6ImNrMzRhcG56MDA1dnMzZGx0a2F2ZGh2bzMifQ.xAwunHM49L77LfvoIerzYg';




    map = new mapboxgl.Map({
        container: 'map',
        center: new mapboxgl.LngLat(9.547826, 45.399986),
        zoom: 16.5,
        style: 'mapbox://styles/michelefiori/ck3g2w4xm03rc1cpijwkgk2h4',
    });

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: true
    }));











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
            mapObjects = result.mapobjects;
            console.log(mapObjects);


            mapObjects.forEach(function(marker) {
                // create a DOM element for the marker
                var el = document.createElement('div');
                el.className = 'marker';

                if(marker.type == "MO"){
                    el.style.backgroundImage = "url(../vectors/dragon_icon.svg)";
                }
                else if(marker.type == "CA"){
                    el.style.backgroundImage = "url(../vectors/candy_icon.svg)";
                }
                el.style.backgroundPosition = "center";
                el.style.backgroundRepeat = "no-repeat";
                el.style.backgroundSize = "cover";


                el.style.width = "32px";
                el.style.height = "32px";

                el.addEventListener('click', function() {
                    openInteractionDiv(marker.id);
                });

// add marker to map
                new mapboxgl.Marker(el)
                    .setLngLat(new mapboxgl.LngLat(marker.lon, marker.lat))
                    .addTo(map);
            });




            for(let i = 0; i<mapObjects.length; i++){
                console.log(mapObjects[i])
            }


            /**********************orribile**************************/
           document.getElementsByClassName("mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate")[0].click();
           //TODO: trovare un metodo migliore,


        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });
}














function openInteractionDiv(oid) {
    console.log("clicked element "+oid);


    var currentMapObject;

    for(let i = 0; i<mapObjects.length; i++){
        if(mapObjects[i].id == oid){
            currentMapObject = mapObjects[i];
        }
    }
    console.log(currentMapObject);



    $("#map").css("display", "none");
    $("#mapObjectInteractionDiv").css("display", "block");


    let mapObjectSizeText;
    if(currentMapObject.type == "MO"){
        switch (currentMapObject.size) {
            case "S":
                mapObjectSizeText = "Mostro piccolo";
                break;
            case "M":
                mapObjectSizeText = "Mostro medio";
                break;
            case "L":
                mapObjectSizeText = "Mostro grande";
                break;
        }
    }
    else if(currentMapObject.type == "CA"){
        switch (currentMapObject.size) {
            case "S":
                mapObjectSizeText = "Caramella piccola";
                break;
            case "M":
                mapObjectSizeText = "Caramella media";
                break;
            case "L":
                mapObjectSizeText = "Caramella grande";
                break;
        }
    }

    $("#mapObjectName").html(currentMapObject.name);
    $("#mapObjectDim").html(mapObjectSizeText);

    var probSopr = "100%" //todo calcolare la probabilita
    if(currentMapObject.type == "MO"){
        $("#mapObjectProbabSoprText").css("display", "block");
        $("#mapObjectProbabSopr").html(probSopr);
    }


    if(true){ //TODO controllo della distanza
        $("#mapObjectDistWarning").css("display", "block");
    }


    $("#mapObjectAnnullaButton").click(function () {
        $("#map").css("display", "block");
        $("#mapObjectInteractionDiv").css("display", "none");
        //todo resettare il div a com'è originale nell'html, cioè far sparire i testi che devono sparire ecc.
    });

    //$("#").html();



    //todo cambiare titolo della wooden action bar
    //todo togliere il tasto indietro dalla actionbar
    //todo creare il div per il risultato
    //todo gestire il click su combatti
    //todo caricare l'immagine del map object
    //todo sistemare graficamente
}

