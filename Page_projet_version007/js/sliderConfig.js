/**
 * Cette page gère les fonctions des sliders sous forme d'objet
 *
 * CASTEL Brandon
 * 24-04-19
 */

class slider {

  constructor (nameSlider, idMessage, valueSlider, parentDiv, previousDiv) {
    this.nameSlider  = nameSlider;
    this.valueSlider = valueSlider;
    this.previousDiv = previousDiv;
    this.nameValueSlider = nameSlider + "Value";
    this.idMessage = idMessage;
    this.parent = parentDiv;
  }

  /**
   * La fonction crée le slider avec tous les paramètres nécessaires.
   */
  createSlider() {
    var nameValue = this.nameValueSlider;
    var nameSlider = this.nameSlider;
    var idMessage = this.idMessage;

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
    this.jqueryId.on("slide", function(event, ui){
      document.getElementById(nameValue).innerHTML = pourcentConversion(ui.value);
      sendMessage("01."+idMessage+":" + ui.value.toString(), "general");
    });

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

      console.log("The value of " + this.id + " has been changed for : " + nValue.toString());
    });
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
}

class generalSlider extends slider {

  constructor(nameSlider, idMessage, valueSlider, parentDiv, previousDiv) {
    super(nameSlider, valueSlider, previousDiv, idMessage, parent);
    this.access = false;
  }

  createSlider() {
    var chromaButtonId = this.getChromaButton.id;
    var access = this.access;
    super.createSlider();

    //On lance les commandes html
    this.htmlConfigSlider();

    //On crée l'évènement d'affichage de la zone RVB lorsqu'on clique sur les boutons "C"
    document.getElementById(chromaButtonId).addEventListener("click", function() {
      if (access == false) {
        $("#colorSpace").show(1000);
        access = true;
      } else if (access == true) {
        $("#colorSpace").hide(1000);
        access = false;
      }
    });
  }

  /**
   * Cette fonction initialise le slider en appliquant les nouveaux éléments HTML
   */
  htmlConfigSlider () {
    super.htmlConfigSlider();

    //On crée un bouton de chromaticité
    if (this.nameSlider !== "red" && this.nameSlider !== "green" && this.nameSlider !== "blue") {
      newSliderZone.appendChild(this.getChromaButton);//On l'ajoute dans le div global
    }
    //On applique le nouveau slider avant l'élèment indiqué dans le constructeur
    this.parent.insertBefore(newSliderZone, this.previousDiv);
  }

  get getChromaButton() {
    var newChromaButton = document.createElement('button');
    newChromaButton.title = "Color Management";
    newChromaButton.id = this.nameSlider + "Chroma";
    newChromaButton.className = "chromaButton";
    newChromaButton.innerHTML = "C";
    return newChromaButton;
  }
}

class colorSlider extends slider {
  constructor(nameSlider, idMessage, valueSlider, parentDiv, previousDiv) {
      super(nameSlider);
      super(valueSlider);
      super(previousDiv);
      super(nameValueSlider);
      super(idMessage);
      super(parent);
  }

  createSlider() {
    super.createSlider();
    //On lance les commandes html
    this.htmlConfigSlider();
  }

  htmlConfigSlider() {
    super.htmlConfigSlider();
    //On applique le nouveau slider avant l'élèment indiqué dans le constructeur
    this.parent.insertBefore(newSliderZone, this.previousDiv);
  }
}
