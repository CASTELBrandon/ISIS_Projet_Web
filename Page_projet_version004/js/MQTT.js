/**
 * Bibliothèque de gestion de la communication MQTT
 * avec le serveur. Il gère le système de connexion
 * avec le broker MQTT.
 *
 * CASTEL Brandon
 * 06-04-19
 */

class MQTTjs {
  /**
   * Constructeur de la classe
   */
  constructor(host, user, pswd) {
    this.address = host;
    this.usernam = user;
    this.password = pswd;
    this.flag = true;
    this.reconnectTimeOut = 2000;
    this.client;
  }

  buttonConnectTrigger() {
    if (this.flag == true) {
  		this.address  = document.getElementById("IP").value;
  		this.username = document.getElementById("username").value;
  		this.password = document.getElementById("password").value;

      console.log(this.address);
  		//port = prompt("Port");

  		//Si l'adresse est nulle ou la demande annulé, on remet par défaut
  		if (this.address == null || this.address == "") {
  			console.log("Any address was specified");
  			alert("Veuillez spécifier une addresse IP.");
  			buttonConnectRefresh();
  		} else if (this.username == null || this.username == "") {
  			console.log("Any username was specified");
  			alert("Veuillez spécifier un nom d'utilisateur.");
  			buttonConnectRefresh();
  		} else if (this.password == null || this.password == "") {
  			console.log("Any password was specified");
  			alert("Veuillez spécifier un mot de passe.");
  			buttonConnectRefresh();
  		} else {
  			this.MQTTConnect(this.address, this.username, this.password);
  		}

  	} else if (this.flag == false) {
  		this.flag = true;

  		//On se déconnecte du serveur
  		console.log("Client is disconnected.");
  		this.client.disconnect();
  	}
  }

  MQTTConnect(host, user, passwd) {
    //On réinitialise le button et redémarre la connexion
    buttonConnectRefresh();
    buttonConnectStyle("Connexion...", "#FFA500");

    console.log("connecting to " + host + " :9001");
    this.client = new Paho.MQTT.Client(host, 9001, "01");
    var options = {
      //useSSL: true,
      userName: user,
      password: passwd,
      onSuccess: this.onConnect,
      onFailure: this.onFailure //Si il y a échec de connexion
    }

    this.client.onConnectionLost = this.onConnectionLost; //Si on perd la connexion
    this.client.onMessageArrived = this.onMessageArrived; //Appelle la fonction associée à la réception d'un message

    this.client.connect(options);

    console.log(this.client);
  }

  onConnect() {
    //Modification du style du bouton
  	buttonConnectStyle("Connecté","#00FFFF"); //Fonction de mise en page

  	//Fonction de connexion
  	console.log("Connected");
  	var message = new Paho.MQTT.Message("New Test 2");
  	message.destinationName = "test";

    console.log(this.client);
  	this.client.subscribe("#");
  	this.client.send(message);
  	this.flag = false;
  }

  onFailure(message) {
    //Modification du style du bouton
    	buttonConnectStyle("Échec de connexion","#cc0000"); //Fonction de mise en page

  	//Gestion de l'échec de connexion
  	console.log("Connection failed: " + message.errorMessage + ".");
  	//setTimeout(MQTTConnect, reconnectTimeOut);
  }

  onConnectionLost(message) {
    //setTimeout(MQTTconnect, reconnectTimeout);
  	console.log("connection lost: " + message.errorMessage + ".");
  	buttonConnectRefresh();
  }

  onMessageArrived(message) {
    var mesReceiv = message.payloadString,
  		value = mesReceiv.substr(9),
  		id = mesReceiv.slice(0,8);
  	console.log(mesReceiv);

  	switch (id) {
  		case "00.Clr.R":
  			colorValueChangeBinary("redValue", value);
  			break;
  		case "00.Clr.G":
  			colorValueChangeBinary("greenValue", value);
  			break;
  		case "00.Clr.B":
  			colorValueChangeBinary("blueValue", value);
  			break;
  	}
  }

  sendMessage(message, topic) {
    var mes = new Paho.MQTT.Message(message);
    	mes.destinationName = topic;
    	this.client.send(mes);
  }
}
