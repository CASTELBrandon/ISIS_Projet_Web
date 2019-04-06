/*
	Bibliothèque de gestion de la communication MQTT
	avec le serveur. Il gère le système de connexion
	avec le broker MQTT. 
	
	Version 0.0.0.1
	CASTEL Brandon
*/

/******************************************
		Déclaration des variables
******************************************/
var	reconnectTimeOut = 2000,
	flag = true,
	address, username, password;

/******************************************
				Fonctions
******************************************/
function buttonConnectTrigger() {
	if (flag == true) {
		address  = document.getElementById("IP").value;
		username = document.getElementById("username").value;
		password = document.getElementById("password").value;
		//port = prompt("Port");

		//Si l'adresse est nulle ou la demande annulé, on remet par défaut
		if (address == null || address == "") {
			console.log("Any address was specified");
			alert("Veuillez spécifier une addresse IP.");
			buttonConnectRefresh();
		} else if (username == null || username == "") {
			console.log("Any username was specified");
			alert("Veuillez spécifier un nom d'utilisateur.");
			buttonConnectRefresh();
		} else if (password == null || password == "") {
			console.log("Any password was specified");
			alert("Veuillez spécifier un mot de passe.");
			buttonConnectRefresh();
		} else {
			MQTTConnect(address, username, password);
		}
				
	} else if (flag == false) {
		flag = true;

		//On se déconnecte du serveur
		console.log("Client is disconnected.");
		client.disconnect();
	}		
}

function MQTTConnect(host, user, passwd) {
	//On réinitialise le button et redémarre la connexion
	buttonConnectRefresh();
	buttonConnectStyle("Connexion...", "#FFA500")

	console.log("connecting to " + host + " :9001");
	client = new Paho.MQTT.Client(host, 9001, "01");
	var options = {
		//useSSL: true,
		userName: user,
		password: passwd,
		onSuccess: onConnect,
		onFailure: onFailure //Si il y a échec de connexion
	}

	client.onConnectionLost = onConnectionLost; //Si on perd la connexion
	client.onMessageArrived = onMessageArrived; //Appelle la fonction associée à la réception d'un message

	client.connect(options);
}

function onConnect() {
	//Modification du style du bouton
	buttonConnectStyle("Connecté","#00FFFF"); //Fonction de mise en page

	//Fonction de connexion
	console.log("Connected");
	var message = new Paho.MQTT.Message("New Test 2");
	message.destinationName = "test";
	client.subscribe("#");
	client.send(message);
	flag = false;
}

function onFailure(message) {
	//Modification du style du bouton
  	buttonConnectStyle("Échec de connexion","#cc0000"); //Fonction de mise en page

	//Gestion de l'échec de connexion
	console.log("Connection failed: " + message.errorMessage + ".");
	//setTimeout(MQTTConnect, reconnectTimeOut);
}

function onConnectionLost(message) {
  	//setTimeout(MQTTconnect, reconnectTimeout);
  	console.log("connection lost: " + message.errorMessage + ".");
  	buttonConnectRefresh();  	
}

function onMessageArrived(message) {
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

function sendMessage(message, topic) {
	var mes = new Paho.MQTT.Message(message);
  	mes.destinationName = topic;
  	client.send(mes);
}


