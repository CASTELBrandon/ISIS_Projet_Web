/**
 * Cette page gère les fonctions des sliders sous forme d'objet
 *
 * CASTEL Brandon
 * 30-04-19
 */

 var parentColor = document.getElementById("colorSpace");
 var secondChild = parentColor.firstChild;

function slider (nameSlider, idMessage, valueSlider, parentDiv, previousDiv, chromaAccess) {
    this.nameSlider  = nameSlider;
    this.valueSlider = valueSlider;
    this.previousDiv = previousDiv;
    this.nameValueSlider = nameSlider + "Value";
    this.idMessage = idMessage;
    this.parent = parentDiv;
    this.chromaAccess = chromaAccess;
    redColor = 0;
    blueColor = 0;
    greenColor = 0;


    /**
     * Cette fonction change la valeur du slider et de son afficheur.
     * @param {value} pourcentValue [Value in pourcent]
     * @param {value} binaryValue   [Value in binary]
     */
    this.setValueSlider = function(binaryValue, pourcentValue) {
      document.getElementById(this.nameSlider + "Value").innerHTML = pourcentValue;
      this.jqueryId().slider("value", binaryValue);
    }

    /**
     * Retourne la notation du slider sous forme d'écriture jquery
     * @return {[text]} [Id jquery]
     */
    this.jqueryId = function() {
      return $("#"+this.nameSlider+"");
    }

    this.getChromaButton = function() {
      var newChromaButton = document.createElement('button');
      newChromaButton.title = "Color Management";
      newChromaButton.id = this.nameSlider + "Chroma";
      newChromaButton.className = "chromaButton";
      newChromaButton.innerHTML = "C";
      return newChromaButton;
    }

    this.changeName = function(name) {
      let newName;
      newName = prompt("New name ?");
      if (newName === "" || newName === " "){
        alert("Veuillez donner un nom complet.");
      } else {
        document.getElementById(name).innerHTML = newName;
      }
    }

    /**
     * Cette fonction initialise le slider en appliquant les nouveaux éléments HTML
     */
      //On crée le div global
      var newSliderZone = document.createElement('div');
      newSliderZone.id = this.nameSlider + "Zone";
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

  /**
   * La fonction crée le slider avec tous les paramètres nécessaires.
   */
    var nameValue = this.nameValueSlider;
    var nameSlider = this.nameSlider;
    var idMessage = this.idMessage;
    var access = this.access;
    var chromaButtonId = this.nameSlider+"Chroma";


    //On initialise le slider
    this.jqueryId().slider({
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
      this.jqueryId().on("slide", function(event, ui){
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

    //Changement de nom au click

    document.getElementById(this.nameSlider+"Name").addEventListener("click", this.changeName.bind(this.nameSlider+"Name"));

  //On crée l'évènement d'affichage de la zone RVB lorsqu'on clique sur les boutons "C"
  if (this.chromaAccess == true) {

    this.sliderRed = new slider("red", "Red.V", 255, parentColor, secondChild);
    this.sliderGreen =  new slider("green", "Gre.V", 255, parentColor, secondChild);
    this.sliderBlue = new slider("blue", "Blu.V", 255, parentColor, secondChild);

    console.log("this.redColor :" + this.redColor);
    $("#"+this.nameSlider+"Chroma").on("click", function() {
      $("#colorSpace").show(1000);
      console.log("redV :"+this.redColor);

      this.sliderRed.setValueSlider(redV, pourcentConversion(redV));
      this.sliderBlue.setValueSlider(blueV, pourcentConversion(blueV));
      this.sliderGreen.setValueSlider(greenV, pourcentConversion(greenV));
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
