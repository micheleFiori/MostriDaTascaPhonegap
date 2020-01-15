
$(function() {

    $("#backButton").click(function () {
        window.location = "index.html";
    });

});



function addListItem(posizione,immagine,nomeGiocatore,xp){
    var listContainer = document.getElementById("rankingListContainer");
    var listItem =
        '<div class="rankingListItem"><br>'+
        '<div class="rankingLIstItem_position"><h1>'+posizione+'</h1></div>' +
        '<div class="rankingListItem_image"><img src="res/icon/android/drawable-hdpi-icon.png"></div>' +
        '<div class="rankingListItem_playerInfo"><h1>'+nomeGiocatore+'</h1> <p>Punti Esperienza: '+xp+'</p></div>'+
        '<div style="clear: both"></div>';

    listContainer.innerHTML+=listItem;
}



/*

<div class="rankingListItem" >
    <br>

    <div class="rankingLIstItem_position"><h1>1°</h1></div>

    <div class="rankingListItem_image"><img src="res/icon/android/drawable-hdpi-icon.png"></div>

    <div class="rankingListItem_playerInfo"><h1>Nome giocatore</h1> <p>Punti Esperienza: 999</p></div>
    <div style="clear: both"></div>

</div>
 */