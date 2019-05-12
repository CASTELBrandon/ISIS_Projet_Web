/*
  Ce code source permet de gérer les animations et la gestion
  de la page web.

  30-04-19
  CASTEL Brandon
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

//On crée un variable pour appeller le slider appeleur du optionSpace
var caller;

//Flag
var flag_buttonArrow=false;

//On crée de nouveau slider
var parentFader = document.getElementById("faderSpace");
var firstChild = parentFader.firstChild;

var parentColor = document.getElementById("optionSpace");
var secondChild = parentColor.firstChild;

//Flèches de sélections
var buttonArrowLeft = document.createElement('button');
buttonArrowLeft.id = "buttonArrowLeft";
buttonArrowLeft.innerHTML = "<";
parentFader.insertBefore(buttonArrowLeft, firstChild);

/*
  On crée nos nouveaux slider dans un tableau de slider, ils sont automatiquement crée
  dans le fichier MQTT.js, à la réception des messages systèmes.
*/
var iterator = 8;
var nbProj;
var nameSlider = new Array();
var channelSlider = new Array();
var sliderArray = new Array();

/******************************************
             Initialisation
******************************************/
//On initialise le visionneur
refreshSwatch();

//On cache les fonctions jusqu'à la connexion de l'utilisateur
$("#colorPicker").hide();
$(".inputConnect").hide();
$("#optionSpace").hide();
$("#faderSpace").hide();

//On amorce le color picker
$(document).ready(function() {
    $('#colorPicker').farbtastic('#color');
});

/******************************************
              Les fonctions
******************************************/
/**********Fonctions de conversions des valeurs***********/
/*
  Cette fonction convertie les valeurs binaires en pourcentage.
*/
function pourcentConversion(binaryValue) {
  return Math.round((binaryValue*100)/255);
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

/*
  Cette fonction affiche un sélectionneur de couleur lorsque l'on clique sur
  le visualiseur de couleur. Elle aggrandit et rétrécit également le "div" des couleurs.
*/
function colorPickerDisplay () {
  var _optionSpace  = document.getElementById("optionSpace").style.width,//On se sert de la méthode "parseInt" pour transformer la valeur en base 10.
      _colorPicker = $("#colorPicker");

  if(_colorPicker.css("display") == "none") {
    /*anime({
      targets: '#optionSpace',
      width: '530px',
      duration: 500,
      easing: 'easeInOutExpo'
    });*/
    _colorPicker.show(1000);
  }
  else {
    _colorPicker.hide(500);
    /*anime({
      targets: '#optionSpace',
      width: '330px',
      duration: 1000,
      easing: 'easeInOutExpo'
    });*/
  }
}


/****************Fonctions des sliders*******************/
/**
 * [newSlider description]
 * @param  {[text]} name  [Nom du slider]
 * @param  {[text]} id    [Id à l'envoi d'une valeur]
 * @param  {[binaryValue]} value [Valeur à initiliser]
 * @param  {[Id html]} parent [Div parent où on doit insérer le slider]
 * @param  {[Id html]} child [Le premier enfant du div parent]
 * @param  {[boolean]} chroma [Accès ou non aux fonctions RGB]
 * @return [La fonction crée le slider avec tous les paramètres nécessaires.]
 */
function newSlider(name, id, value, parent, child, chroma) {
  var nslider = new slider(name, id, value, parent, child, chroma);
  nslider.create();

  //On initialise le slider
  nslider.jqueryId().slider({
    orientation: "vertical",
    range: "min",
    max: 255,
    value: nslider.valueSlider,
    slide: refreshSwatch,
    change: refreshSwatch
  });

  //On lui applique une valeur d'Initialisation
  nslider.setValueSlider(nslider.valueSlider,pourcentConversion(nslider.valueSlider));

  //Changement des valeurs et envoi des messages quand on agit sur le slider
  if(nslider.nameSlider !== "red" && nslider.nameSlider !== "blue" && nslider.nameSlider !== "green") {
    nslider.jqueryId().on("slide", function(event, ui){
      document.getElementById(nslider.nameValueSlider).innerHTML = pourcentConversion(ui.value);
      sendMessage("C1."+nslider.idMessage+":" + ui.value.toString(), "general");
    });
  }

  //Demande d'insérer une valeur lorsque l'on clique sur l'afficheur
  document.getElementById(nslider.nameValueSlider).addEventListener("click" , function() {

    //On demande à choisir une valeur en pourcentage entre 0 et 100
    var nValue = Number(prompt("New value ?"));
    //On la convertie en binaire
    var nValueBinary = binaryLevelConversion(nValue);

    if (nValue > 100 || nValue < 0) {
      alert("Veuillez donner une valeur comprise entre 0 et 100%.")
    }
    else {
      document.getElementById(nslider.nameValueSlider).innerHTML = nValue;
      $("#"+nslider.nameSlider+"").slider("value", nValueBinary);
      sendMessage("C1." + nslider.idMessage+":"+ nValueBinary, "general");
    }

    console.log("The color value of " + nslider.id + " has been changed for : " + nValue.toString());
  });

  //Changement de nom au click
  document.getElementById(nslider.nameId).addEventListener("click", nslider.changeName.bind(nslider.nameId));//bind donne toutes les infos, ils faut les sélectionnés avec target

  //Evènement de slide des fader RGB
  if(nslider.nameSlider === "red" || nslider.nameSlider === "blue" || nslider.nameSlider === "green") {
    //On intègre une variable d'appeleur du slider
    nslider.caller;

    $("#red").on("slide", function(event, ui){
      document.getElementById("redValue").innerHTML = pourcentConversion(ui.value);
      sendMessage("C1.Red.V:" + ui.value.toString(), "general");
      nslider.caller.redColor = ui.value;
      console.log("nslider.redColor :"+nslider.redColor);
    });

    $("#blue").on("slide", function(event, ui){
      document.getElementById("blueValue").innerHTML = pourcentConversion(ui.value);
      sendMessage("C1.Blu.V:" + ui.value.toString(), "general");
      nslider.caller.blueColor = ui.value;
    });

    $("#green").on("slide", function(event, ui){
      document.getElementById("greenValue").innerHTML = pourcentConversion(ui.value);
      sendMessage("C1.Gre.V:" + ui.value.toString(), "general");
      nslider.caller.greenColor = ui.value;
    });
  }

  //On crée l'évènement d'affichage de la zone RVB lorsqu'on clique sur les boutons "C"
  if (nslider.chromaAccess == true) {
    $("#"+nslider.nameSlider+"Chroma").on("click", function() {
      document.getElementById("TitreOptionZone").innerHTML = nslider.nameSlider;

      //On rafraichit l'appeleur
      caller = nslider;

      //On rafraichit les valeurs de l'appeleur dans les slider RGB
      sliderRed.caller = nslider;
      sliderBlue.caller = nslider;
      sliderGreen.caller = nslider;

      sliderRed.setValueSlider(nslider.redColor, pourcentConversion(nslider.redColor));
      sliderBlue.setValueSlider(nslider.blueColor, pourcentConversion(nslider.blueColor));
      sliderGreen.setValueSlider(nslider.greenColor, pourcentConversion(nslider.greenColor));

      $("#optionSpace").show(1000);
    });
  }

  return nslider;
}

function getSliderAttribute(array, nameSlider ,attribute) {
  let attributeGot;
  let slider;

  for(i=1; i < nbProj+1 ; i++) {
    if(array[i].nameSlider === nameSlider){
      slider = array[i];
      attributeGot = slider[attribute];
    }
  }

  return attributeGot;
}

function buttonArrowRightTrigger() {
  var j = iterator-8;
  for(j; j < iterator && j+8 < nbProj ; j++) {
    $("#"+sliderArray[j].nameSlider+"Zone").hide(1);
    $("#"+sliderArray[j+8].nameSlider+"Zone").show(1);
  }
  console.log("iterator avant : " + iterator);
  if (iterator < nbProj) {
    if (nbProj-iterator > 8) {
      iterator = iterator + 8;
    } else {
      sliderCounter = nbProj-iterator;
      iterator = iterator + sliderCounter;
    }

  }
  console.log("iterator après : " + iterator);
}

function buttonArrowLeftTrigger() {
  var j = iterator-1;
  for(j; j > iterator-9 && j-8 > -1 ; j--) {
    $("#"+sliderArray[j].nameSlider+"Zone").hide(1);
    $("#"+sliderArray[j-8].nameSlider+"Zone").show(1);
  }
  console.log("iterator avant : " + iterator);
  if (iterator > 9) {
    if (nbProj-iterator < sliderCounter) {
      iterator = iterator - sliderCounter;
    } else {
      iterator = iterator - 8;
    }
  }
  console.log("iterator après : " + iterator);
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


/************************Fonctions de permission**********************/
/**
 * Cette fonction affiche ou non les fonctions de la page si on est connecté ou
 * déconnecté. Cela a pour but de ne pas donner l'accès à l'utilisateur si les
 * conditions ci-dessous ne sont pas remplies.
 */
function permission (access) {
  if (access == true) {
    $("#faderSpace").show(1000);
  }
  else if (access == false) {
    $("#faderSpace").hide(1000);
    $("#optionSpace").hide(1000);
  }
}


/******************************************
            Les évènements
******************************************/
  /*
    On récupère la valeur du color picker grâce à un callback de farbtastic.
    On change ensuite l'afficheur par la couleur sélectionnée.
  */
  $("#colorPicker").farbtastic(function(color) {
    //On récupère les valeurs
    var colorArray = rgbFromHEX(color);

    //Valeurs initiales
    var initValues = [sliderRed.jqueryId().slider("value"), sliderGreen.jqueryId().slider("value"), sliderBlue.jqueryId().slider("value")];

    if (colorArray[0] !== initValues[0]) {
      //Modification des valeurs
      sliderRed.setValueSlider(colorArray[0], pourcentConversion(colorArray[0]));
      caller.redColor = colorArray[0];
      //Envoi des valeurs au serveur
      sendMessage("C1."+sliderRed.idMessage+":" + initValues[0], "general");
    }

    if (colorArray[1] !== initValues[1]) {
      //Modification des valeurs
      sliderGreen.setValueSlider(colorArray[1], pourcentConversion(colorArray[1]));
      caller.greenColor = colorArray[1];
      //Envoi des valeurs au serveur
      sendMessage("C1."+sliderGreen.idMessage+":" + initValues[1], "general");
    }


    if (colorArray[2] !== initValues[2]) {
      //Modification des valeurs
      sliderBlue.setValueSlider(colorArray[2], pourcentConversion(colorArray[2]));
      caller.blueColor = colorArray[2];
      //Envoi des valeurs au serveur
      sendMessage("C1."+sliderBlue.idMessage+":" + initValues[2], "general");
    }

    //Changement de la couleur du swatch
    $("#swatch").css("background-color", color);
  });

  //>>Évènement du "swatch"
  document.getElementById("swatch").addEventListener('click', colorPickerDisplay);

  //>>Evènement du bouton Close
  document.getElementById("buttonClose").addEventListener('click', function() {
    $("#optionSpace").hide(1000);
  });

  //>>Evènement des boutons de connexion
  document.getElementById("buttonConnect").addEventListener("click", buttonConnectTrigger);
  document.getElementById("buttonConnect").addEventListener("touch", buttonConnectTrigger);
  document.getElementById("buttonArrow").addEventListener("click", buttonArrowOpen);
  document.getElementById("buttonArrow").addEventListener("touch", buttonArrowOpen);

  //>>Evènement des flèches de défilement des sliderSheet
  document.getElementById("buttonArrowLeft").addEventListener("click", buttonArrowLeftTrigger);
  document.getElementById("buttonArrowLeft").addEventListener("touch", buttonArrowLeftTrigger);
