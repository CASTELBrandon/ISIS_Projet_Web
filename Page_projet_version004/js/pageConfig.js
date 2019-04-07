/*
  Ce code source permet de gérer les animations et la gestion
  de la page web.

  CASTEL Brandon
  06-04-19
*/

/******************************************
        Les paramètres par défaut
******************************************/
/*
  On utilise tous les widgets de jquery avec un mode tactile grâce au widget "draggable".
*/
$(".ui-slider-handle").draggable();

//On recupère l'Id du bouton de connexion
var buttonConnect = document.getElementById("buttonConnect");

//Flag
var flag_buttonArrow=false;

var _redValue   = $( "#red" ),
    _greenValue = $( "#green" ),
    _blueValue  = $( "#blue" );

var mqtt = new MQTTjs("","","");










/******************************************
              Les fonctions
******************************************/
/**********Fonctions de conversions des valeurs***********/
/*
  Cette fonction convertie les valeurs binaires en pourcentage.
*/
function pourcentConversion(binaryValue) {
  return Math.round((binaryValue*100)/255) + "%";
}

/*
  Cette fonction convertie les valeurs en pourcentage en niveaux binaires.
*/
function binaryLevelConversion(pourcentValue) {
  return Math.round((pourcentValue*255)/100);
}

/*
  Cette fonction convertie les valeurs rgb en valeur hexadécimale
*/
function hexFromRGB(r, g, b) {
  var hex = [
    r.toString( 16 ),
    g.toString( 16 ),
    b.toString( 16 )
  ];
  $.each( hex, function( nr, val ) {
    if ( val.length === 1 ) {
      hex[ nr ] = "0" + val;
    }
  });
  return hex.join( "" ).toUpperCase();
}

function rgbFromHEX(hex) {
  hex = hex.replace("#","");//On supprime le #
  var r = parseInt(hex.substring(0,2), 16),
      g = parseInt(hex.substring(2,4), 16),
      b = parseInt(hex.substring(4,6), 16);

  var colorArray = [r, g, b];
  return colorArray;
}

/****************Fonctions de couleur*******************/
function refreshSwatch() {
  var red = $( "#red" ).slider( "value" ),
    green = $( "#green" ).slider( "value" ),
    blue  = $( "#blue" ).slider( "value" ),
    hex   = hexFromRGB( red, green, blue );
  $( "#swatch" ).css( "background-color", "#" + hex );
}

function colorValueChangePourcent(id, value) {
	switch (id) {
      case "redValue":
        document.getElementById("redValue").innerHTML = value + "%";
        $("#red").slider("value", binaryLevelConversion(value));
        break;
      case "greenValue":
        document.getElementById("greenValue").innerHTML = value + "%";
        $("#green").slider("value", binaryLevelConversion(value));
        break;
      default :
        document.getElementById("blueValue").innerHTML = value + "%";
        $("#blue").slider("value", binaryLevelConversion(value));
    }
}

function colorValueChangeBinary(id, value) {
	switch (id) {
      case "redValue":
        document.getElementById("redValue").innerHTML = pourcentConversion(value);
        $("#red").slider("value", value);
        break;
      case "greenValue":
        document.getElementById("greenValue").innerHTML = pourcentConversion(value);
        $("#green").slider("value", value);
        break;
      default :
        document.getElementById("blueValue").innerHTML = pourcentConversion(value);
        $("#blue").slider("value", value);
    }
}

/*
  Cette fonction récupère l'objet qui a déclenché l'évènement (donc la fonction)
  à l'aide de "this" et récupère l'id de cette objet. On cherche à savoir si c'est
  l'objet rouge, vert ou bleu qui l'a déclenché. Puis, on demande à l'utilisateur
  la nouvelle valeur du curseur.
*/
function colorValueTrigger() {
  var nColorValue = Number(prompt("New value ?"));
  if (nColorValue > 100 || nColorValue < 0) {
    alert("Veuillez donner une valeur comprise entre 0 et 100%.")
  }
  else {
    colorValueChangePourcent(this.id, nColorValue);
    switch (this.id) {
      case "redValue":
        sendMessage("01.Clr.R:" + binaryLevelConversion(nColorValue), "test");
        break;
      case "greenValue":
        sendMessage("01.Clr.G:" + binaryLevelConversion(nColorValue), "test");
        break;
      default :
        sendMessage("01.Clr.B:" + binaryLevelConversion(nColorValue), "test");
    }
  }

  console.log("The color value of " + this.id + " has been changed for : " + nColorValue.toString());
}

/*
  Cette fonction affiche un sélectionneur de couleur lorsque l'on clique sur
  le visualiseur de couleur. Elle aggrandit et rétrécit également le "div" des couleurs.
*/
function colorPickerDisplay () {
  var _colorSpace  = document.getElementById("colorSpace").style.width,//On se sert de la méthode "parseInt" pour transformer la valeur en base 10.
      _colorPicker = $("#colorPicker");

  if(_colorPicker.css("display") == "none") {
    anime({
      targets: '#colorSpace',
      width: '470px',
      duration: 500,
      easing: 'easeInOutExpo'
    });
    _colorPicker.show(1000);
  }
  else {
    _colorPicker.hide(500);
    anime({
      targets: '#colorSpace',
      width: '270px',
      duration: 1000,
      easing: 'easeInOutExpo'
    });
  }
}

/****************Fonctions du bouton de connexion****************/
function buttonConnectStyle(message, color) {
  buttonConnect.innerHTML = message;
  anime.timeline({
    duration: 300,
    easing: 'easeInOutQuad'
  }).add({ targets: '#buttonConnect', borderColor: color}, 0);
  buttonConnect.style.boxShadow = "0 0 5px " + color;
  buttonConnect.style.transition = "box-shadow 0.3s ease-in-out";
}

function getbuttonConnectTrigger() {
  mqtt.buttonConnectTrigger();
}

function buttonConnectRefresh() {
  buttonConnect.innerHTML = "Se connecter";
  anime.timeline({
    duration: 300,
    easing: 'easeInOutQuad'
  }).add({ targets: '#buttonConnect', borderColor: "#585858"}, 0);
  buttonConnect.style.boxShadow = "";
  buttonConnect.style.transition = "";
}

function buttonArrowOpen() {
  if (flag_buttonArrow === false) {
    anime({
      targets: '.inputConnect',
      translateX: 5,
      duration: 100,
      easing: 'spring(1, 100, 10, 20)'
    });
    $(".inputConnect").show(100);
    $("#buttonArrow").html("<");
    flag_buttonArrow = true;
  } else if (flag_buttonArrow === true) {
    anime({
      targets: '.inputConnect',
      translateX: -5,
      duration: 100,
      easing: 'spring(1, 100, 10, 20)'
    });
    $(".inputConnect").hide(100);
    $("#buttonArrow").html(">");
    flag_buttonArrow = false;
  }
}








/******************************************
            Les évènements
******************************************/
/***************Évènement sur support tactile*****************/
  //>>Évènement des curseurs de couleur


/***************Évènement sur support cliquable***************/
  //>>Évènement des curseurs de couleur
  document.getElementById("redValue").addEventListener('click', colorValueTrigger);
  document.getElementById("greenValue").addEventListener('click', colorValueTrigger);
  document.getElementById("blueValue").addEventListener('click', colorValueTrigger);

  /*
    On modifie la valeur des afficheurs R, V, B à chaque modification du slider
    grâce à l'évènement "slide". Les valeurs sont converties en %.
  */
  $("#red").on("slide", function(event, ui){
    document.getElementById("redValue").innerHTML   = pourcentConversion(ui.value);
    sendMessage("01.Clr.R:" + ui.value.toString(), "test");
  });
  $("#green").on("slide", function(event, ui){
    document.getElementById("greenValue").innerHTML = pourcentConversion(ui.value);
    sendMessage("01.Clr.G:" + ui.value.toString(), "test");
  });
  $("#blue").on("slide", function(event, ui){
    document.getElementById("blueValue").innerHTML  = pourcentConversion(ui.value);
    sendMessage("01.Clr.B:" + ui.value.toString(), "test");
  });

  /*
    On récupère la valeur du color picker grâce à un callback de farbtastic.
    On change ensuite l'afficheur par la couleur sélectionnée.
  */
  $("#colorPicker").farbtastic(function(color) {
    //On récupère les valeurs
    var colorArray = rgbFromHEX(color);

    //Valeurs initiales
    var initValues = [_redValue.slider("value"), _greenValue.slider("value"), _blueValue.slider("value")];

    if (colorArray[0] !== initValues[0]) {
      //Affectation des nouvelles valeurs
      _redValue.slider( "value" , colorArray[0]);
      //Changement des valeurs de pourcentage
      document.getElementById("redValue").innerHTML   = pourcentConversion(_redValue.slider( "value" ));
      //Envoi des valeurs au serveur
      sendMessage("01.Clr.R:" + _redValue.slider("value"), "test");
    }

    if (colorArray[1] !== initValues[1]) {
      //Affectation des nouvelles valeurs
      _greenValue.slider( "value" , colorArray[1]);
      //Changement des valeurs de pourcentage
      document.getElementById("greenValue").innerHTML = pourcentConversion(_greenValue.slider( "value" ));
      //Envoi des valeurs au serveur
      sendMessage("01.Clr.G:" + _greenValue.slider( "value" ), "test");
    }

    if (colorArray[2] !== initValues[2]) {
      //Affectation des nouvelles valeurs
      _blueValue.slider( "value" , colorArray[2]);
      //Changement des valeurs de pourcentage
      document.getElementById("blueValue").innerHTML  = pourcentConversion(_blueValue.slider( "value" ));
      //Envoi des valeurs au serveur
      sendMessage("01.Clr.B:" + _blueValue.slider( "value" ), "test");
    }

    //Changement de la couleur du swatch
    $("#swatch").css("background-color", color);
  });

  //>Évènement du "swatch"
  document.getElementById("swatch").addEventListener('click', colorPickerDisplay);

  //Evènement des boutons de connexion
  document.getElementById("buttonConnect").addEventListener("click", getbuttonConnectTrigger);
  document.getElementById("buttonConnect").addEventListener("touch", getbuttonConnectTrigger);
  document.getElementById("buttonArrow").addEventListener("click", buttonArrowOpen);//Voir fichier js de la page
  document.getElementById("buttonArrow").addEventListener("touch", buttonArrowOpen);









/******************************************
              Initialisation
******************************************/
$( "#red, #green, #blue" ).slider({
  orientation: "vertical",
  range: "min",
  max: 255,
  value: 127,
  slide: refreshSwatch,
  change: refreshSwatch
});

//On intialise les valeurs des curseurs
$( "#red" ).slider( "value", 255);
$( "#green" ).slider( "value", 140);
$( "#blue" ).slider( "value", 60);

//On initialise le visionneur
refreshSwatch();

//On amorce le color picker
$(document).ready(function() {
    $('#colorPicker').farbtastic('#color');
});

//On cache le color picker et les input d'identification
$("#colorPicker").hide();
$(".inputConnect").hide();

/*
  On initialise les afficheurs à leurs valeurs par défaut en pourcentage (%).
  Pour cela on appelle la fonction "pourcentConversion" créée plus haut.
*/
document.getElementById("redValue").innerHTML   = pourcentConversion(_redValue.slider( "value" ));
document.getElementById("greenValue").innerHTML = pourcentConversion(_greenValue.slider( "value" ));
document.getElementById("blueValue").innerHTML  = pourcentConversion(_blueValue.slider( "value" ));
