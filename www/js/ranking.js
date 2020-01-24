const BASE_URL = "https://ewserver.di.unimi.it/mobicomp/mostri/";


$(function() {

    getRanking();

    $("#backButton").click(function () {
        window.location = "index.html";
    });

});



function addListItem(posizione,immagine,nomeGiocatore,xp){
    var listContainer = document.getElementById("rankingListContainer");
    var listItem =
        '<div class="rankingListItem"><br>'+
        '<div class="rankingLIstItem_position"><h1>'+posizione+'</h1></div>' +
        '<div class="rankingListItem_image"><img src="'+immagine+'"></div>' +
        '<div class="rankingListItem_playerInfo"><h1>'+nomeGiocatore+'</h1> <p>Punti Esperienza: '+xp+'</p></div>'+
        '<div style="clear: both"></div>';

    listContainer.innerHTML+=listItem;
}


var rankingList;
function getRanking(){
    $.ajax({
        method: 'post',
        url:BASE_URL+"ranking.php",
        data: JSON.stringify(
            {
                session_id : localStorage.getItem("sessionId")
            }),
        dataType: 'json',
        success: function(result) {

            rankingList = result.ranking;
            console.log(rankingList);

            for(let i = 1; i<=rankingList.length; i++){

                var image;
                if(rankingList[i-1].img == null){
                    image = "vectors/warrior_icon.svg";
                }
                else{
                    image = "data:image/png;base64, "+rankingList[i-1].img;
                }

                addListItem(i,image,rankingList[i-1].username,rankingList[i-1].xp);
            }

        },
        error: function(error) { //TODO gestire gli errori
            console.error(error);
        }
    });
}
