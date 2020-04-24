const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');
const token = '974090840:AAGnN10UmljHZodMlAJnYj09OwkDreTatnY';
const bot = new TelegramBot(token, {polling: true});
const app = firebase.initializeApp({
 	apiKey: "AIzaSyC0Gb7PEi5ZDu3IG-rViivisjyQidDCC9A",
 	authDomain: "slintbot.firebaseapp.com",
 	databaseURL: "https://slintbot.firebaseio.com",
 	projectId: "slintbot",
 	storageBucket: "slintbot.appspot.com",
 	messagingSenderId: "1079009264892",
    appId: "1:1079009264892:web:fdbba1c7546411653a8379"
 });
const db = firebase.database();
const ref = db.ref();
const itemsRef = ref.child("shoppinglist");
const slintstuganID = -230465094;

function addItem(item) {
	itemsRef.child(item).set({
		name: item
	});
}

function printList(id) {
	itemsRef.once("value", function(snapshot) {
		var keyboard = [];
		snapshot.forEach(function(child) {
			keyboard.push([{'text': child.val().name, 'callback_data': child.key}]);
		});
		bot.sendMessage(id, 'Here is the shitty shit list:', {
			reply_markup: {
				inline_keyboard: keyboard
			}
		});
	});
}

bot.onText(/\/shitlist (.+)/, (msg, item) => {
	var list = item[1].replace(/\s+/g, '');
	var itemsArr = list.split(',');
	itemsArr.forEach(addItem);
});

bot.onText(/\/shitlist$/, (msg) => {
	printList(msg.chat.id);
});

bot.on("callback_query", (callbackQuery) => {
	itemsRef.child(callbackQuery.data).remove();
	printList(slintstuganID);
});

itemsRef.on("child_removed", function(snapshot) {
	var deletedItem = snapshot.val().name;
	bot.sendMessage(slintstuganID, "Removed: " + deletedItem);
});

itemsRef.on("child_added", function(snapshot) {
	var addedItem = snapshot.val().name;
	bot.sendMessage(slintstuganID, "Added: " + addedItem);
});



