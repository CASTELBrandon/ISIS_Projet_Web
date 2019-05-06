/**
 * Cette page gère les fonctions des sliders sous forme d'objet
 *
 * CASTEL Brandon
 * 30-04-19
 */

 var parentColor = document.getElementById("colorSpace");
 var secondChild = parentColor.firstChild;

var slider = {
    /**
     * Cette fonction change la valeur du slider et de son afficheur.
     * @param {value} pourcentValue [Value in pourcent]
     * @param {value} binaryValue   [Value in binary]
     */
    setValueSlider: function(binaryValue, pourcentValue) {
      document.getElementById(this.nameSlider + "Value").innerHTML = pourcentValue;
      this.jqueryId().slider("value", binaryValue);
    },

    /**
     * Retourne la notation du slider sous forme d'écriture jquery
     * @return {[text]} [Id jquery]
     */
    jqueryId: function() {
      return $("#"+this.nameSlider+"");
    },

    getChromaButton: function() {
      var newChromaButton = document.createElement('button');
      newChromaButton.title = "Color Management";
      newChromaButton.id = this.nameSlider + "Chroma";
      newChromaButton.className = "chromaButton";
      newChromaButton.innerHTML = "C";
      return newChromaButton;
    },

    changeName: function(name) {
      let newName;
      newName = prompt("New name ?");
      if (newName === "" || newName === " "){
        alert("Veuillez donner un nom complet.");
      } else {
        document.getElementById(name).innerHTML = newName;
      }
    },

    htmlFunction: function() {
      //On crée le div global
      var newSliderZone = document.createElement('div');
      newSliderZone.id= this.nameSlider + "Zone";
      newSliderZone.className = "sliderZone";

      //On crée le nom du nouveau slider
      var newP = document.createElement('p');
      newP.className = "colorText";
      newP.id = this.nameSlider+"Name";
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
        newSliderZone.appendChild(this.getChromaButton());//On l'ajoute dans le div global
      }
      //On applique le nouveau slider avant l'élèment indiqué dans le constructeur
      this.parent.insertBefore(newSliderZone, this.previousDiv);
    }
}
