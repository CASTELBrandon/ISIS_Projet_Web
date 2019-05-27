/**
 * Cette page gère les fonctions des sliders sous forme d'objet
 *
 * CASTEL Brandon
 * 30-04-19
 */



class slider {
  constructor(nameSlider, idMessage, valueSlider, parentSlider, previousDiv, chromaAccess){
    this.nameSlider  = nameSlider;
    this.idMessage = idMessage;
    this.valueSlider = valueSlider;
    this.parentSlider = parentSlider;
    this.previousDiv = previousDiv;
    this.chromaAccess = chromaAccess;
    this.nameValueSlider = nameSlider + "Value";
    this.nameId = this.idMessage+"Name";

    this.nameConfig = nameSlider;

    this.redColor = 0;
    this.blueColor = 0;
    this.greenColor = 0;
  }



    /**
     * Cette fonction change la valeur du slider et de son afficheur.
     * @param {value} pourcentValue [Value in pourcent]
     * @param {value} binaryValue   [Value in binary]
     */
    setValueSlider(binaryValue, pourcentValue) {
      document.getElementById(this.nameValueSlider).innerHTML = pourcentValue;
      this.jqueryId().slider("value", binaryValue);
    }

    /**
     * Retourne la notation du slider sous forme d'écriture jquery
     * @return {[text]} [Id jquery]
     */
    jqueryId() {
      return $("#"+this.nameSlider+"");
    }

    getChromaButton() {
      var newChromaButton = document.createElement('button');
      newChromaButton.title = "Color Management";
      newChromaButton.id = this.nameSlider + "Chroma";
      newChromaButton.className = "chromaButton";
      newChromaButton.innerHTML = "C";
      return newChromaButton;
    }

    getValue(id) {
      return $("#"+this.nameSlider).slider("value");
    }

    getName() {
      return document.getElementById(this.idMessage+"Name").innerHTML;
    }

    changeName(id) {
      let newName;
      console.log(id.target.id);
      newName = prompt("New name ?");
      if (newName === "" || newName === " " || newName === null || newName.length != 4){
        alert("Veuillez donner un nom de 4 caractères.");
      } else {
        document.getElementById(id.target.id).innerHTML = newName;
        sendMessage("C1."+id.target.id.slice(0,4)+".N:"+newName,"general");
      }
    }

    /**
     * Cette fonction initialise le slider en appliquant les nouveaux éléments HTML
     */
    create(){
      //On crée le div global
      var newSliderZone = document.createElement('div');
      newSliderZone.id = this.nameSlider + "Zone";
      newSliderZone.className = "sliderZone";

      //On crée le nom du nouveau slider
      var newP = document.createElement('p');
      newP.className = "colorText";
      newP.id = this.idMessage+"Name";
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
        var newChromaButton = document.createElement('button');
        newChromaButton.title = "Color Management";
        newChromaButton.id = this.nameSlider + "Chroma";
        newChromaButton.className = "chromaButton";
        newChromaButton.innerHTML = "C";
        newSliderZone.appendChild(newChromaButton);//On l'ajoute dans le div global
      }
      //On applique le nouveau slider avant l'élèment indiqué dans le constructeur
      this.parentSlider.insertBefore(newSliderZone, this.previousDiv);
    }
}
