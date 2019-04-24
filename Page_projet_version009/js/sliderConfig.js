/**
 * Cette page gère les fonctions des sliders sous forme d'objet
 *
 * CASTEL Brandon
 * 12-04-19
 */

class slider {

  constructor (nameSlider, idMessage, valueSlider, parentDiv, previousDiv, chromaAccess) {
    this.nameSlider  = nameSlider;
    this.valueSlider = valueSlider;
    this.previousDiv = previousDiv;
    this.nameValueSlider = nameSlider + "Value";
    this.idMessage = idMessage;
    this.parent = parentDiv;
    this.chromaAccess = chromaAccess;
    this.access = false;
    this.redColor = 0;
    this.blueColor = 0;
    this.greenColor = 0;
  }

  /**
   * La fonction crée le slider avec tous les paramètres nécessaires.
   */
  createSlider() {
    var nameValue = this.nameValueSlider;
    var nameSlider = this.nameSlider;
    var idMessage = this.idMessage;
    var access = this.access;
    var chromaButtonId = this.nameSlider+"Chroma";

    //On lance les commandes html
    this.htmlConfigSlider();

    //On initialise le slider
    this.jqueryId.slider({
      orientation: "vertical",
      range: "min",
      max: 255,
      value: this.valueSlider,
      slide: refreshSwatch,
      change: refreshSwatch
    });

    //On lui applique une valeur d'Initialisation
    this.setValueSlider(this.valueSlider,pourcentConversion(this.valueSlider));

    /*******Evènements*******/

    //Changement des valeurs et envoi des messages quand on agit sur le slider
    if(this.nameSlider !== "red" && this.nameSlider !== "blue" && this.nameSlider !== "green") {
      this.jqueryId.on("slide", function(event, ui){
        document.getElementById(nameValue).innerHTML = pourcentConversion(ui.value);
        sendMessage("01."+idMessage+":" + ui.value.toString(), "general");
      });
    }

    //Demande d'insérer une valeur lorsque l'on clique sur l'afficheur
    document.getElementById(nameValue).addEventListener("click" , function() {

      //On demande à choisir une valeur en pourcentage entre 0 et 100
      var nValue = Number(prompt("New value ?"));
      //On la convertie en binaire
      var nValueBinary = binaryLevelConversion(nValue);

      if (nValue > 100 || nValue < 0) {
        alert("Veuillez donner une valeur comprise entre 0 et 100%.")
      }
      else {
        document.getElementById(nameValue).innerHTML = nValue;
        $("#"+nameSlider+"").slider("value", nValueBinary);
        sendMessage("01." + idMessage+":"+ nValueBinary, "general");
      }

      console.log("The color value of " + this.id + " has been changed for : " + nValue.toString());
    });

    //On crée l'évènement d'affichage de la zone RVB lorsqu'on clique sur les boutons "C"

    var blueV = this.blueColor;
    var greenV = this.greenColor;
    var redV = this.redColor;
    if (this.chromaAccess == true) {

      document.getElementById(chromaButtonId).addEventListener("click", function() {
          $("#colorSpace").show(1000);
          console.log(redV);

          sliderRed.setValueSlider(redV, pourcentConversion(redV));
          sliderBlue.setValueSlider(blue, pourcentConversion(blue));
          sliderGreen.setValueSlider(green, pourcentConversion(green));

      });
    }
  }

  /**
   * Cette fonction initialise le slider en appliquant les nouveaux éléments HTML
   */
  htmlConfigSlider () {
    //On crée le div global
    var newSliderZone = document.createElement('div');
    newSliderZone.id = this.nameSlider + "Zone";
    newSliderZone.className = "sliderZone";

    //On crée le nom du nouveau slider
    var newP = document.createElement('p');
    newP.className = "colorText";
    newP.appendChild(document.createTextNode(this.nameSlider));
    newSliderZone.appendChild(newP);//On l'ajoute dans le div global

    //On crée la zone de valeur
    var newValue = document.createElement('div');
    newValue.id = this.nameSlider + "Value";
    newValue.className = "sliderValue";
    newSliderZone.appendChild(newValue);//On l'ajoute dans le div global

    //On crée le slider
    var newSlider = document.createElement('div');
    newSlider.id = this.nameSlider;
    newSlider.className = "slider";
    newSliderZone.appendChild(newSlider);//On l'ajoute dans le div global

    //On crée un bouton de chromaticité
    if (this.chromaAccess == true) {
      newSliderZone.appendChild(this.getChromaButton);//On l'ajoute dans le div global
    }
    //On applique le nouveau slider avant l'élèment indiqué dans le constructeur
    this.parent.insertBefore(newSliderZone, this.previousDiv);
  }

  /**
   * Cette fonction change la valeur du slider et de son afficheur.
   * @param {value} pourcentValue [Value in pourcent]
   * @param {value} binaryValue   [Value in binary]
   */
  setValueSlider(binaryValue, pourcentValue) {
    document.getElementById(this.nameSlider + "Value").innerHTML = pourcentValue;
    this.jqueryId.slider("value", binaryValue);
  }

  /**
   * Retourne la notation du slider sous forme d'écriture jquery
   * @return {[text]} [Id jquery]
   */
  get jqueryId() {
    return $("#"+this.nameSlider+"");
  }

  get getChromaButton() {
    var newChromaButton = document.createElement('button');
    newChromaButton.title = "Color Management";
    newChromaButton.id = this.nameSlider + "Chroma";
    newChromaButton.className = "chromaButton";
    newChromaButton.innerHTML = "C";
    return newChromaButton;
  }

  getRed() {
    return this.red;
  }
  setRed(newValue) {
    this.red = newValue;
  }
}
