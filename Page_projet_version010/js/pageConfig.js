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

//Flag
var flag_buttonArrow=false;

//On crée de nouveau slider
var parentFader = document.getElementById("faderSpace");
var firstChild = parentFader.firstChild;

var buttonArrowLeft = document.createElement('button');
buttonArrowLeft.id = "buttonArrowLeft";
buttonArrowLeft.innerHTML = "<";
parentFader.insertBefore(buttonArrowLeft, firstChild);

/*
  On crée nos nouveaux slider et leurs paramètres dans un tableau de slider, et la variable d'incrémentation
  pour pouvoir lire le tableau.
*/
var iterator = 8;
var nbSlider = 512;
var sliderArray = new Array();
for(i=1; i < nbSlider+1 ; i++) {
  sliderArray[i] = slider;
  sliderArray[i].nameSlider = i.toString();
  sliderArray[i].idMessage = "Fd"+i+".V";
  sliderArray[i].valueSlider = 0;
  sliderArray[i].parent = parentFader;
  sliderArray[i].previousDiv = firstChild;
  sliderArray[i].chromaAccess = true;
  sliderArray[i].redColor= 0;
  sliderArray[i].blueColor= 0;
  sliderArray[i].greenColor= 0;

  sliderArray[i].htmlFunction();

  //On initialise le slider
  sliderArray[i].jqueryId().slider({
    orientation: "vertical",
    range: "min",
    max: 255,
    value: sliderArray[i].valueSlider,
    slide: refreshSwatch,
    change: refreshSwatch
  });

  //On lui applique une valeur d'Initialisation
  sliderArray[i].setValueSlider(sliderArray[i].valueSlider,pourcentConversion(sliderArray[i].valueSlider));


  /*******Evènements*******/

  //Changement des valeurs et envoi des messages quand on agit sur le slider
  if(sliderArray[i].nameSlider !== "red" && sliderArray[i].nameSlider !== "blue" && sliderArray[i].nameSlider !== "green") {
    sliderArray[i].jqueryId().on("slide", function(event, ui){
      document.getElementById(sliderArray[i].nameSlider+"Value").innerHTML = pourcentConversion(ui.value);
      sendMessage("01."+sliderArray[i].idMessage+":" + ui.value.toString(), "general");
    });
  }

  //Demande d'insérer une valeur lorsque l'on clique sur l'afficheur
  document.getElementById(sliderArray[i].nameSlider+"Value").addEventListener("click" , function() {

    //On demande à choisir une valeur en pourcentage entre 0 et 100
    var nValue = Number(prompt("New value ?"));
    //On la convertie en binaire
    var nValueBinary = binaryLevelConversion(nValue);

    if (nValue > 100 || nValue < 0) {
      alert("Veuillez donner une valeur comprise entre 0 et 100%.")
    }
    else {
      document.getElementById(sliderArray[i].nameSlider+"Value").innerHTML = nValue;
      $("#"+sliderArray[i].nameSlider+"").slider("value", nValueBinary);
      sendMessage("01." + sliderArray[i].idMessage+":"+ nValueBinary, "general");
    }

    console.log("The color value of " + this.id + " has been changed for : " + nValue.toString());
  });

  //Changement de nom au click
  document.getElementById(sliderArray[i].nameSlider+"Name").addEventListener("click", sliderArray[i].changeName.bind(sliderArray[i].nameSlider+"Name"));

  //On cache les slider au délà de 8
  if (i > 8) {
    $("#"+sliderArray[i].nameSlider+"Zone").hide(1);
  }
}

var buttonArrowRight = document.createElement('button');
buttonArrowRight.id = "buttonArrowRight";
buttonArrowRight.innerHTML = ">";
parentFader.insertBefore(buttonArrowRight, firstChild);


var sliderMaster = slider;
sliderMaster.nameSlider = "Master";
sliderMaster.idMessage = "Mtr.V";
sliderMaster.valueSlider = 0;
sliderMaster.parent = parentFader;
sliderMaster.previousDiv = firstChild;
sliderMaster.chromaAccess = false;
sliderMaster.htmlFunction();

//On initialise le slider
sliderMaster.jqueryId().slider({
  orientation: "vertical",
  range: "min",
  max: 255,
  value: sliderMaster.valueSlider,
  slide: refreshSwatch,
  change: refreshSwatch
});

//On lui applique une valeur d'Initialisation
sliderMaster.setValueSlider(sliderMaster.valueSlider,pourcentConversion(sliderMaster.valueSlider));


/*******Evènements*******/

//Changement des valeurs et envoi des messages quand on agit sur le slider
if(sliderMaster.nameSlider !== "red" && sliderMaster.nameSlider !== "blue" && sliderMaster.nameSlider !== "green") {
  sliderMaster.jqueryId().on("slide", function(event, ui){
    document.getElementById(sliderMaster.nameSlider+"Value").innerHTML = pourcentConversion(ui.value);
    sendMessage("01."+sliderMaster.idMessage+":" + ui.value.toString(), "general");
  });
}

//Demande d'insérer une valeur lorsque l'on clique sur l'afficheur
document.getElementById(sliderMaster.nameSlider+"Value").addEventListener("click" , function() {

  //On demande à choisir une valeur en pourcentage entre 0 et 100
  var nValue = Number(prompt("New value ?"));
  //On la convertie en binaire
  var nValueBinary = binaryLevelConversion(nValue);

  if (nValue > 100 || nValue < 0) {
    alert("Veuillez donner une valeur comprise entre 0 et 100%.")
  }
  else {
    document.getElementById(sliderMaster.nameSlider+"Value").innerHTML = nValue;
    $("#"+sliderMaster.nameSlider+"").slider("value", nValueBinary);
    sendMessage("01." + sliderMaster.idMessage+":"+ nValueBinary, "general");
  }

  console.log("The color value of " + this.id + " has been changed for : " + nValue.toString());
});


//On crée l'évènement d'affichage de la zone RVB lorsqu'on clique sur les boutons "C"
for(i=1; i < nbSlider+1; i++) {
  if (sliderMaster.chromaAccess == true) {

    sliderMaster.sliderRed =  new slider("red", "Red.V", 255, parentColor, secondChild);
    sliderMaster.sliderGreen = new slider("green", "Gre.V", 255, parentColor, secondChild);
    sliderMaster.sliderBlue = new slider("blue", "Blu.V", 255, parentColor, secondChild);

    console.log("this.redColor :" + this.redColor);
    $("#"+this.nameSlider+"Chroma").on("click", function() {
      $("#colorSpace").show(1000);
      console.log("redV :"+this.redColor);

      this.sliderRed.setValueSlider(this.redColor, pourcentConversion(this.redColor));
      this.sliderBlue.setValueSlider(this.blueColor, pourcentConversion(this.blueColor));
      this.sliderGreen.setValueSlider(this.greenColor, pourcentConversion(this.greenColor));
    });

    $("#red").on("slide", function(event, ui){
      document.getElementById("redValue").innerHTML = pourcentConversion(ui.value);
      sendMessage("01.Red.V:" + ui.value.toString(), "general");
      this.redColor = ui.value;
      console.log("this.redColor :"+this.redColor);
    });

    $("#blue").on("slide", function(event, ui){
      document.getElementById("blueValue").innerHTML = pourcentConversion(ui.value);
      sendMessage("01.Blu.V:" + ui.value.toString(), "general");
      this.blueColor = ui.value;
    });

    $("#green").on("slide", function(event, ui){
      document.getElementById("greenValue").innerHTML = pourcentConversion(ui.value);
      sendMessage("01.Gre.V:" + ui.value.toString(), "general");
      this.greenColor = ui.value;
    });
  }
}





/******************************************
             Initialisation
******************************************/
//On initialise le visionneur
refreshSwatch();

//On cache les fonctions jusqu'à la connexion de l'utilisateur
$("#colorPicker").hide();
$(".inputConnect").hide();
$("#colorSpace").hide();
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
  var _colorSpace  = document.getElementById("colorSpace").style.width,//On se sert de la méthode "parseInt" pour transformer la valeur en base 10.
      _colorPicker = $("#colorPicker");

  if(_colorPicker.css("display") == "none") {
    /*anime({
      targets: '#colorSpace',
      width: '530px',
      duration: 500,
      easing: 'easeInOutExpo'
    });*/
    _colorPicker.show(1000);
  }
  else {
    _colorPicker.hide(500);
    /*anime({
      targets: '#colorSpace',
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
 * @param  {[boolean]} chroma [Accès ou non aux fonctions RGB]
 * @return [On retourne le slider]
 */
function newSlider(name, id, value, chroma) {
  var nslider = new slider(name, id, value, parentFader, firstChild, chroma);
  return nslider;
}

function buttonArrowRightTrigger() {
  var j = iterator-7;
  for(j; j < iterator+1 && j+8 < nbSlider+1 ; j++) {
    $("#"+sliderArray[j].nameSlider+"Zone").hide(1);
    $("#"+sliderArray[j+8].nameSlider+"Zone").show(1);
    console.log("j :" + j);
  }
  console.log("iterator avant : " + iterator);
  if (iterator < nbSlider) {
    iterator = iterator + 8;
  }
  console.log("iterator après : " + iterator);
}

function buttonArrowLeftTrigger() {
  var j = iterator;
  for(j; j > iterator-8 && j-8 > 0 ; j--) {
    $("#"+sliderArray[j].nameSlider+"Zone").hide(1);
    $("#"+sliderArray[j-8].nameSlider+"Zone").show(1);
    console.log("j :" + j);
  }
  console.log("iterator avant : " + iterator);
  if (iterator > 8) {
    iterator = iterator - 8;
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
    $("#colorSpace").hide(1000);
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
    var initValues = [sliderRed.jqueryId.slider("value"), sliderGreen.jqueryId.slider("value"), sliderBlue.jqueryId.slider("value")];

    if (colorArray[0] !== initValues[0]) {
      //Modification des valeurs
      sliderRed.setValueSlider(colorArray[0], pourcentConversion(colorArray[0]));
      //Envoi des valeurs au serveur
      sendMessage("01."+sliderRed.idMessage+":" + initValues[0], "general");
    }

    if (colorArray[1] !== initValues[1]) {
      //Modification des valeurs
      sliderGreen.setValueSlider(colorArray[1], pourcentConversion(colorArray[1]));
      //Envoi des valeurs au serveur
      sendMessage("01."+sliderGreen.idMessage+":" + initValues[1], "general");
    }


    if (colorArray[2] !== initValues[2]) {
      //Modification des valeurs
      sliderBlue.setValueSlider(colorArray[2], pourcentConversion(colorArray[2]));
      //Envoi des valeurs au serveur
      sendMessage("01."+sliderBlue.idMessage+":" + initValues[2], "general");
    }

    //Changement de la couleur du swatch
    $("#swatch").css("background-color", color);
  });

  //>>Évènement du "swatch"
  document.getElementById("swatch").addEventListener('click', colorPickerDisplay);

  //>>Evènement du bouton Close
  document.getElementById("buttonClose").addEventListener('click', function() {
    $("#colorSpace").hide(1000);
  });

  //>>Evènement des boutons de connexion
  document.getElementById("buttonConnect").addEventListener("click", buttonConnectTrigger);
  document.getElementById("buttonConnect").addEventListener("touch", buttonConnectTrigger);
  document.getElementById("buttonArrow").addEventListener("click", buttonArrowOpen);
  document.getElementById("buttonArrow").addEventListener("touch", buttonArrowOpen);

  //>>Evènement des flèches de défilement des sliderSheet
  document.getElementById("buttonArrowRight").addEventListener("click", buttonArrowRightTrigger);
  document.getElementById("buttonArrowLeft").addEventListener("click", buttonArrowLeftTrigger);
  document.getElementById("buttonArrowRight").addEventListener("touch", buttonArrowRightTrigger);
  document.getElementById("buttonArrowLeft").addEventListener("touch", buttonArrowLeftTrigger);
