/*
	Bibliothèque de gestion de la communication MQTT
	avec le serveur. Il gère le système de connexion
	avec le broker MQTT.

	Version 0.0.0.1
	CASTEL Brandon
*/

class MQTTClient {
	/******************************************
			Déclaration des variables
	******************************************/
	constructor(host, port, idClient) {
		this.reconnectTimeOut = 2000;
		this.client = new Paho.MQTT.Client(host, port, idClient);
	}


	/******************************************
					Fonctions
	******************************************/
	MQTTConnect(user, passwd) {
		//On réinitialise le button et redémarre la connexion
		buttonConnectRefresh();
		buttonConnectStyle("Connexion...", "#FFA500")

		console.log("connecting to " + this.client.host + " :9001");
		let options = {
			//useSSL: true,
			userName: user,
			password: passwd,
			onSuccess: this.onConnect,
			onFailure: this.onFailure //Si il y a échec de connexion
		}

		this.client.onConnectionLost = this.onConnectionLost; //Si on perd la connexion
		this.client.onMessageArrived = this.onMessageArrived; //Appelle la fonction associée à la réception d'un message

		this.client.connect(options);
	}

	onConnect() {
		//Modification du style du bouton
		buttonConnectStyle("Connecté","#00FFFF"); //Fonction de mise en page

		//Fonction de connexion
		console.log("Connected");
		client.subscribe("#");
		//this.sendMessage("Salut salut !", "test");
		flag = false;
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
	  	console.log("connection lost: " + message.errorMessage);
	  	buttonConnectRefresh();
	}

	onMessageArrived(message) {
		let mesReceiv = message.payloadString;
		let infoMes = "New message received (topic " + message.destinationName + ") : " + mesReceiv;
		console.log(infoMes);
	}

	sendMessage(message, topic) {
		let mes = new Paho.MQTT.Message(message);
	  	mes.destinationName = topic;
	  	this.client.send(mes);
	}

};
