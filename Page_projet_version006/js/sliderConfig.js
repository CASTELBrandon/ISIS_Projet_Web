/**
 * Cette page gère les fonctions des sliders sous forme d'objet
 *
 * CASTEL Brandon
 * 09-04-19
 */

class slider {

  constructor (nameSlider, valueSlider, previousDiv) {
    this.nameSlider  = nameSlider;
    this.valueSlider = valueSlider;
    this.previousDiv = previousDiv;
  }

  /**
   * La fonction crée le slider avec tous les paramètres nécessaires.
   */
  createSlider() {
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
  }

  /**
   * Retourne la notation du slider sous forme d'écriture jquery
   * @return {[text]} [Id jquery]
   */
  get jqueryId() {
    return $("#"+this.nameSlider+"");
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

    //On applique le nouveau slider avant l'élèment indiqué dans le constructeur
    parent.insertBefore(newSliderZone, this.previousDiv);
  }

  /**
   * Cette fonction change la valeur du slider et de son afficheur.
   * @param {value} pourcentValue [Value in pourcent]
   * @param {value} binaryValue   [Value in binary]
   */
  setValueSlider(binaryValue, pourcentValue) {
    document.getElementById(this.nameSlider + "Value").innerHTML = pourcentValue + "%";
    this.jqueryId.slider("value", binaryValue);
  }
}
