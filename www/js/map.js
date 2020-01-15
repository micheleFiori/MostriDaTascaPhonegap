var map;

$(function() {
    getMapObjects();
    $("#map").css("height", $(window).height()); //mette la mappa ad altezza tutto schermo
    $("#backButton").click(function () {
        window.location = "index.html";
    });

    mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGVsZWZpb3JpIiwiYSI6ImNrMzRhcG56MDA1dnMzZGx0a2F2ZGh2bzMifQ.xAwunHM49L77LfvoIerzYg';
    map = new mapboxgl.Map({
        container: 'map',
        center: new mapboxgl.LngLat(9.547826, 45.399986), //todo da centrare nella posizione attuale
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

            mapObjects = result.mapobjects;
            console.log(mapObjects);

            mapObjects.forEach(function(marker) { //crea i marker e gli aggiunge il click listener
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
                el.style.zIndex = "99";
                el.style.width = "38px";
                el.style.height = "38px";

                el.addEventListener('click', function() {
                    openInteractionDiv(marker.id);
                });

                // add marker to map
                new mapboxgl.Marker(el)
                    .setLngLat(new mapboxgl.LngLat(marker.lon, marker.lat))
                    .addTo(map);
            });

            /*for(let i = 0; i<mapObjects.length; i++){
                console.log(mapObjects[i])
            }*/

            /**********************orribile**************************/
           document.getElementsByClassName("mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate")[0].click();
           //TODO: trovare un metodo migliore, a quanto pare non c'è, l'ha detto anche il prof, anche per la posizione non è il massimo, però messo qui funziona

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

    //cambia titolo della wooden action bar:
    var actionBarNewTitle = "";
    var interactionButtonText = ""
    if(currentMapObject.type == "MO"){
        actionBarNewTitle = "Combattimento";
        interactionButtonText = "Combatti";
    }
    else if(currentMapObject.type == "CA"){
        actionBarNewTitle = "Rifornimento";
        interactionButtonText = "Mangia";
    }
    $("#woodenActionBar").children()[1].innerHTML = actionBarNewTitle;
    $("#mapObjectInteragisciButton").html(interactionButtonText);

    $("#backButton").css("display", "none"); //toglie il tasto indietro dalla actionbar

    $("#map").css("display", "none");
    $("#mapObjectInteractionResultDiv").css("display", "none");
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

    var probSopr = calcolaProbabilitaSopravivenza(currentMapObject.size)+"%";
    if(currentMapObject.type == "MO"){
        $("#mapObjectProbabSoprText").css("display", "block");
        $("#mapObjectProbabSopr").html(probSopr);
    }

    if(/*todo lasciare: distance(currentMapObject.lat, currentMapObject.lon, map.transform.center.lat, map.transform.center.lng, "K")>50*/false){
        console.log("distanza maggiore di 50m !!!");
        $("#mapObjectDistWarning").css("display", "block");

        $("#mapObjectInteragisciButton").addClass("woodenButtonDisabled");
    }


    $("#mapObjectAnnullaButton").click(function () {
        location.reload(); //todo non è il masssimo, vedi se trovi una soluzione migliore

        $("#map").css("display", "block");
        $("#mapObjectInteractionDiv").css("display", "none");
        //todo resettare il div a com'è originale nell'html, cioè far sparire i testi che devono sparire ecc.
    });
    $("#mapObjectInteragisciButton").click(function () {
        console.log("click sul pulsante di interazione");
        fightEat(oid);
    });


    //todo caricare l'immagine del map object
    //todo sistemare graficamente
}



function fightEat(oid){
    $("#mapObjectInteractionResultDiv").css("display", "block");
    $("#map").css("display", "none");
    $("#mapObjectInteractionDiv").css("display", "none");

    fightEatCall(oid);
}

var callResult;
function fightEatCall(oid){
    var currentMapObject;
    for(let i = 0; i<mapObjects.length; i++){
        if(mapObjects[i].id == oid){
            currentMapObject = mapObjects[i];
        }
    }

    $.ajax({
        method: 'post',
        url:BASE_URL+"fighteat.php",
        data: JSON.stringify(
            {
                session_id : localStorage.getItem("sessionId"),
                target_id : oid
            }),
        dataType: 'json',
        success: function(result) {
            console.log(result);
            callResult = result;
            showresult(currentMapObject);
            currentMapObject = null;
        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });

}

function showresult(currentMapObject) {
    if(currentMapObject.type == "CA"){
        $("#InteractionResultDescription").html("Hai mangiato la caramella <br>Nuovi punti vita: <br>"+callResult.lp);
        $("#InteractionResultButton").click(function () {
            console.log("click su indietro da caramella - torna a mappa"); //TODO torna a mappa
            location.reload(); //todo non è il masssimo, vedi se trovi una soluzione migliore

            /* todo va bene così????????????

            $("#InteractionResultDescription").html("");
            $("#InteractionResultLabel").html("");
            callResult = null;
            currentMapObject = null;

            $("#map").css("display", "block");
            $("#mapObjectInteractionResultDiv").css("display", "none");
            $("#mapObjectInteractionDiv").css("display", "none");


*/
        });
    }
    else if(currentMapObject.type == "MO"){
        if(/*sei vivo*/!callResult.died){

            $("#InteractionResultLabel").html("Hai vinto!");
            $("#InteractionResultDescription").html("Punti esperienza:<br>"+callResult.xp+"<br>Punti vita:<br>"+callResult.lp);

            $("#InteractionResultButton").click(function () {
                console.log("click su indietro da mostro con vittoria - torna a mappa"); //TODO torna a mappa
                location.reload(); //todo non è il masssimo, vedi se trovi una soluzione migliore
            });
        }
        else{/*sei morto*/
            $("#InteractionResultLabel").html("Hai perso!");
            $("#InteractionResultDescription").html("Perdi tutti i punti esperienza<br>e torni a 100 punti vita");

            $("#InteractionResultButton").click(function () {
                console.log("click su indietro da mostro con sconfitta - torna a home");
                window.location = "index.html";
            });
        }
    }

}





/*metodi "utils"*/
function calcolaProbabilitaSopravivenza(size){

    let puntiVita = sessionStorage.getItem("userLp");

    let dannoMin = -1;
    let prob;

    if(size == 'S'){
        dannoMin = 0;
    }
    else if(size == 'M'){
        dannoMin = 25;
    }
    else if(size == 'L'){
        dannoMin = 50;
    }
    else{
        dannoMin = 50;
    }

    prob = Math.round(((puntiVita-dannoMin-1)/51.00)*100.00);

    if(prob>100) prob = 100;
    if(prob<0) prob = 0;

    return prob;
}
function distance(lat1, lon1, lat2, lon2, unit) {


    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1609.344 } //metri
        if (unit=="N") { dist = dist * 0.8684 } //miglia
        return dist;
    }
}



//TODO quando ritorno sulla mappa devo riaggiornare i markers dei mapObjects fatto perchè riaggiorno (?????????)




