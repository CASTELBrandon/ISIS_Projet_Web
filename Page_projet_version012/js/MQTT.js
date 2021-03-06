/*
	Bibliothèque de gestion de la communication MQTT
	avec le serveur. Il gère le système de connexion
	avec le broker MQTT.

	08-04-19
	CASTEL Brandon
*/

/******************************************
		Déclaration des variables
******************************************/
var	reconnectTimeOut = 2000,
	flag = true,
	address, username, password,
	flagInit = false;

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
	client.subscribe("#");
	sendMessage("C1.Syst.R:0","general");
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
		permission(false);//Si on perd la connexion on désactive l'accès aux fonctions
}

function onMessageArrived(message) {
	var mesReceiv = message.payloadString,
			value = mesReceiv.substr(10),
			id = mesReceiv.slice(0,9);

	switch (id) {
		case "C0.Init.P":
			nbProj=value;
			console.log("nbProj: "+nbProj);
			break;
		case "C0.Init.N":
			nameSlider.push(value);
			console.log("Nouveau slider: "+ nameSlider);
			break;
		case "C0.Init.C":
			channelSlider.push(value);
			console.log("Canaux des sliders: "+channelSlider);
			break;
		case "C0.Init.E":
			for(i=0; i < nbProj ; i++) {
				console.log("i:" + i);
				if (channelSlider[i] !== "0") {
					sliderArray[i] = newSlider(nameSlider[i], nameSlider[i]+".V", 0, parentFader, firstChild, true);
				} else {
					sliderArray[i] = newSlider(nameSlider[i], nameSlider[i]+".V", 0, parentFader, firstChild, false);
				}

				if (i > 7) {
					$("#"+sliderArray[i].nameSlider+"Zone").hide(1);
				}
			}

			console.log(nameSlider);

			var buttonArrowRight = document.createElement('button');
			buttonArrowRight.id = "buttonArrowRight";
			buttonArrowRight.innerHTML = ">";
			parentFader.insertBefore(buttonArrowRight, firstChild);


			var sliderMaster = newSlider("master", "Mast.V", 0, parentFader, firstChild, false);

			//>>Evènement des flèches de défilement des sliderSheet
			document.getElementById("buttonArrowRight").addEventListener("click", buttonArrowRightTrigger);
			document.getElementById("buttonArrowRight").addEventListener("touch", buttonArrowRightTrigger);

			//>>On affiche les fonctions si on est connecté
			permission(true);
			break;
	}
}

function sendMessage(message, topic) {
	var mes = new Paho.MQTT.Message(message);
  		mes.destinationName = topic;
  		client.send(mes);
}
