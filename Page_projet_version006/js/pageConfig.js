/*
  Ce code source permet de gérer les animations et la gestion
  de la page web.

  12-04-19
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

var _redValue   = $( "#red" ),
    _greenValue = $( "#green" ),
    _blueValue  = $( "#blue" ),
    _satValue   = $( "#sat");

//On crée de nouveau slider
var parent = document.getElementById("colorSpace");
var premier_fils = parent.firstChild;


var sliderMaster = new slider("master", "Mtr.V", 0, premier_fils);
sliderMaster.createSlider();
var sliderRed = new slider("red", "Red.V", 128, premier_fils);
sliderRed.createSlider();
var sliderGreen =  new slider("green", "Gre.V", 10, premier_fils);
sliderGreen.createSlider();
var sliderBlue = new slider("blue", "Blu.V", 255, premier_fils);
sliderBlue.createSlider();



/******************************************
             Initialisation
******************************************/
//On initialise le visionneur
refreshSwatch();

//On cache les fonctions jusqu'à la connexion de l'utilisateur
$("#colorPicker").hide();
$(".inputConnect").hide();
$("#colorSpace").hide();

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
    anime({
      targets: '#colorSpace',
      width: '530px',
      duration: 500,
      easing: 'easeInOutExpo'
    });
    _colorPicker.show(1000);
  }
  else {
    _colorPicker.hide(500);
    anime({
      targets: '#colorSpace',
      width: '330px',
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
    $("#colorSpace").show(1000);
  }
  else if (access == false) {
    $("#colorSpace").hide(1000);
  }

}


/******************************************
            Les évènements
******************************************/

/***************Évènement sur support tactile*****************/
  //>>Évènement des curseurs de couleur


/***************Évènement sur support cliquable***************/
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
      sendMessage("01.Clr.R:" + _redValue.slider("value"), "general");
    }

    if (colorArray[1] !== initValues[1]) {
      //Affectation des nouvelles valeuvar sliderMaster = new slider("master", 0, premier_fils);
      _greenValue.slider( "value" , colorArray[1]);
      //Changement des valeurs de pourcentage
      document.getElementById("greenValue").innerHTML = pourcentConversion(_greenValue.slider( "value" ));
      //Envoi des valeurs au serveur
      sendMessage("01.Clr.G:" + _greenValue.slider( "value" ), "general");
    }

    if (colorArray[2] !== initValues[2]) {
      //Affectation des nouvelles valeurs
      _blueValue.slider( "value" , colorArray[2]);
      //Changement des valeurs de pourcentage
      document.getElementById("blueValue").innerHTML  = pourcentConversion(_blueValue.slider( "value" ));
      //Envoi des valeurs au serveur
      sendMessage("01.Clr.B:" + _blueValue.slider( "value" ), "general");
    }

    //Changement de la couleur du swatch
    $("#swatch").css("background-color", color);
  });

  //>>Évènement du "swatch"
  document.getElementById("swatch").addEventListener('click', colorPickerDisplay);

  //>>Evènement des boutons de connexion
  document.getElementById("buttonConnect").addEventListener("click", buttonConnectTrigger);
  document.getElementById("buttonConnect").addEventListener("touch", buttonConnectTrigger);
  document.getElementById("buttonArrow").addEventListener("click", buttonArrowOpen);
  document.getElementById("buttonArrow").addEventListener("touch", buttonArrowOpen);
