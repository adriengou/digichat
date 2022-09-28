//Element DOM du bouton d'envoi de message
const sendButton = document.querySelector("#send_button");

//Element DOM de l'input pour le message
const messageInput = document.querySelector("#message_input");

//Element DOM de la liste des messages
const messagesContainer = document.querySelector("#messages");

//Element DOM de l'input pour le pseudo
const usernameInput = document.querySelector("#username");

//Se connecter au websocket de notre serveur
let socket = io();

//id of self
let clientId = "";

//Evenement qui se déclenche au clic du bouton "Envoyer"
sendButton.addEventListener("click", function () {
  //Si l'input du message n'est pas vide
  if (messageInput.value) {
    //On envoie le contenue de l'input au serveur
    socket.emit("message", messageInput.value);
  }
});

//On éxecute la fonction quand on reçois un message
socket.on("message", function (message) {
  let li = document.createElement("li");
  li.textContent = message;
  messagesContainer.appendChild(li);
});

socket.on("client id", function (id) {
  console.log(id);
  clientId = id;
});

socket.on("user joined", function (id) {
  if (id !== clientId) {
    let li = document.createElement("li");
    li.textContent = `${id} joined the chat`;
    messagesContainer.appendChild(li);
  }
});
