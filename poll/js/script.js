/* global monogatari */

// Define the messages used in the game.
monogatari.action ('message').messages ({
	'Help': {
		title: 'Help',
		subtitle: 'Some useful Links',
		body: `
			<p><a href='https://developers.monogatari.io/documentation/'>Documentation</a> - Everything you need to know.</p>
			<p><a href='https://monogatari.io/demo/'>Demo</a> - A simple Demo.</p>
		`
	}
});

// Define the notifications used in the game
monogatari.action ('notification').notifications ({
	'Welcome': {
		title: 'Welcome',
		body: 'This is the Monogatari VN Engine',
		icon: ''
	}
});

// Define the Particles JS Configurations used in the game
monogatari.action ('particles').particles ({

});

// Define the canvas objects used in the game
monogatari.action ('canvas').objects ({

});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration ('credits', {

});


// Define the images that will be available on your game's image gallery
monogatari.assets ('gallery', {

});

// Define the music used in the game.
monogatari.assets ('music', {

});

// Define the voice files used in the game.
monogatari.assets ('voices', {

});

// Define the sounds used in the game.
monogatari.assets ('sounds', {

});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {

});


// Define the Characters
monogatari.characters ({
	'y': {
		name: 'Yui',
		color: '#5bcaff'
	}
});

monogatari.script ({
	// The game starts here.
	'Start': [
		'show scene #f7f6f6 with fadeIn',
		'show notification Welcome',
		{
			'Input': {
				'Text': 'What is your name?',
				'Validation': function (input) {
					return input.trim ().length > 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							name: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							name: ''
						}
					});
				},
				'Warning': 'You must enter a name!'
			}
		},
		'jump PassEntry'
	],

	'PassEntry': [ 
		{
			'Input': {
				'Text': 'Enter a password for security.',
				'Type': 'password',
				'Validation': function (input) {
					return input.trim ().length >= 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							pass: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							pass: ''
						}
					});
				},
				'Warning': 'You must enter a password!'
			}
		},
		'jump UserCreation'
	],

	'UserCreation': [
		'y We\'re creating your profile now, please hold tight!',
		'jump Question1'
	],

	'Question1': [
		'y Choose your starting character based on you!',
		{ 'Choice': {
			'Farmer': {
				'Text': 'Farmer (Hardworking, loves the outdoors)',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 1, 1);
				},
				'Do': 'jump Question2'
			},
			'Banker': {
				'Text': 'Banker (Analytical, loves the city life)',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 1, 2);
				},
				'Do': 'jump Question2'
			},
			'Carpenter': {
				'Text': 'Carpenter (Good at problem-solving, loves hands-on work)',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 1, 3);
				},
				'Do': 'jump Question2'
			},
			'Teacher': {
				'Text': 'Teacher (Smart, excellent people skills)',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 1, 4);
				},
				'Do': 'jump Question2'
			}
		}}		
	],

	'Question2': [
		'y Do you want to travel to the Frontier alone or in a group?',
		{ 'Choice': {
			'Alone': {
				'Text': 'Alone (You only need to provide for yourself, and you can do whatever you want! But if you get into trouble, there\'s no one to help.)',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 2, 1);
				},
				'Do': 'jump Question3'
			},
			'InAGroup': {
				'Text': 'In a group (You can rely on the rest of your group for help, but more party members means more mouths to feed and protect.)',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 2, 2);
				},
				'Do': 'jump Question3'
			}
		}}		
	],

	'Question3': [
		'y You start your journey to the Frontier. What do you buy at the first trading post?',
		{ 'Choice': {
			'Bullets': {
				'Text': 'Bullets for your rifle. You never know who or what you\'ll encounter in the wilderness.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 3, 1);
				},
				'Do': 'jump Question4'
			},
			'Bread': {
				'Text': 'Twenty-six loaves of bread. Bread is great. Enough said.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 3, 2);
				},
				'Do': 'jump Question4'
			},
			'Souvenirs': {
				'Text': 'Some souvenirs of the nearest landmark. Gotta remember where you\'ve been, right?',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 3, 3);
				},
				'Do': 'jump Question4'
			},
			'Dog': {
				'Text': 'A dog, because animal friends are always fun.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 3, 4);
				},
				'Do': 'jump Question4'
			},
			'Nothing': {
				'Text': 'Nothing, because it\'s better to save your money for later.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 3, 5);
				},
				'Do': 'jump Question4'
			}
		}}		
	],

	'Question4': [
		'y You encounter another group of travelers on the trail. They seem to be running low on supplies. What do you do?',
		{ 'Choice': {
			'Nothing': {
				'Text': 'Nothing. Everyone has to survive on their own out here.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 4, 1);
				},
				'Do': 'jump Question5'
			},
			'Share': {
				'Text': 'Share some of your food with them. Sharing is caring, right?',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 4, 2);
				},
				'Do': 'jump Question5'
			},
			'Invite': {
				'Text': 'Invite them to become part of your group. We\'re stronger together.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 4, 3);
				},
				'Do': 'jump Question5'
			}
		}}		
	],

	'Question5': [
		'y On your journey, you come across the Snake River. You have to cross it, somehow, but it seems a bit deep. What do you do?',
		{ 'Choice': {
			'Ford': {
				'Text': 'Attempt to ford the river here. Taking the direct route is the best way to get across without losing more time.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 5, 1);
				},
				'Do': 'jump Question6'
			},
			'Group': {
				'Text': 'Try to find another group with to cross together. Maybe you can help each other out.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 5, 2);
				},
				'Do': 'jump Question6'
			},
			'Bridge': {
				'Text': 'Build a bridge. A sturdy and stable bridge is the best way to get across.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 5, 3);
				},
				'Do': 'jump Question6'
			}
		}}		
	],

	'Question6': [
		'y You are running low on water supplies after one of the barrels cracked and spilled all the water. What do you do?',
		{ 'Choice': {
			'Hope': {
				'Text': 'Hope for rain. It\'ll rain soon. Right? Right?',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 6, 1);
				},
				'Do': 'jump Question7'
			},
			'Find': {
				'Text': 'Try to find a nearby lake or stream to gather water from. However, you haven\'t seen an other body of water in a few days so you don\'t know how far away it could be.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 6, 2);
				},
				'Do': 'jump Question7'
			},
			'Ration': {
				'Text': 'Ration your water even stricter. Only a few sips a day should be enough to get you to the nearest trading post. Hopefully.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 6, 3);
				},
				'Do': 'jump Question7'
			}
		}}		
	],

	'Question7': [
		'y While setting up camp today, you were bitten by a snake! What do you do?',
		{ 'Choice': {
			'KeepGoing': {
				'Text': 'Keep going. You\'re not sure you have enough food to stop and rest.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 7, 1);
				},
				'Do': 'jump Question8'
			},
			'Find': {
				'Text': 'Take a break and rest for a few days. If you keep going, you might not make it to the next trading post to get help.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 7, 2);
				},
				'Do': 'jump Question8'
			}
		}}		
	],

	'Question8': [
		'y You\'ve reached another trading post! What do you want to buy today?',
		{ 'Choice': {
			'Water': {
				'Text': 'Water for the rest of the journey. It\'s very important to stay hydrated.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 8, 1);
				},
				'Do': 'jump Question9'
			},
			'Ox': {
				'Text': 'A second ox to help pull your wagon. You can always use another ox to help out.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 8, 2);
				},
				'Do': 'jump Question9'
			},
			'Seeds': {
				'Text': 'Seeds for your farm out West. It\'s good to get ahead on those seeds.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 8, 3);
				},
				'Do': 'jump Question9'
			}
		}}		
	],

	'Question9': [
		'y One of your wagon wheels cracked in half and fell off the wagon. You can\'t move on without it, so what do you do?',
		{ 'Choice': {
			'Repair': {
				'Text': 'Try to repair the cracked wheel with some rope. You don\'t know how long this solution will last.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 9, 1);
				},
				'Do': 'jump Question10'
			},
			'NewWheel': {
				'Text': 'Fashion a new wheel out of nearby stiff branches. However, the rest of the ride will be bumpy.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 9, 2);
				},
				'Do': 'jump Question10'
			},
			'Abandon': {
				'Text': 'Dump most of your gear and place the remainder on the back of your ox, and abandon the wagon.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 9, 3);
				},
				'Do': 'jump Question10'
			}
		}}		
	],

	'Question10': [
		'y You are running low on food after wolves broke into your food supply. What do you do?',
		{ 'Choice': {
			'Deer': {
				'Text': 'Hunt some deer (gets you a lot of food).',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 10, 1);
				},
				'Do': 'jump Ending'
			},
			'Berries': {
				'Text': 'Scavenge for berries (gets you a little bit of food).',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 10, 2);
				},
				'Do': 'jump Ending'
			},
			'Tough': {
				'Text': 'Try to tough it out until the next trading post, where you could potentially buy food.',
				'onChosen': function() {
					uploadAnswer(monogatari.storage().player.name, monogatari.storage().player.pass, 10, 3);
				},
				'Do': 'jump Ending'
			}
		}}		
	],

	'Ending': [
		'y Congratulations on making it out West to the Frontier! You made it!',
		'y Here are some people who made similar choices to you while playing Boredgon Trailder!',
		'end'
	]
});

const baseURL = 'https://api-dot-la-hacks-gamers.wl.r.appspot.com';

async function uploadAnswer(username, pass, question, answer) {
	console.log("Upload function called with the following params: " + username + ", "+ pass + ", " + question + ", " + answer);
	let questionStr = 'q' + question;
	let url = baseURL + '/trail';
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		body: {
			'username': username,
			'password': pass,
			questionStr: answer
		}
	});
	return response.json();
}

async function registerUser(username, pass, discord, bio, pfp) {
	console.log("Attempting to register user with the following params: "  + username + ", "+ pass + ", " + discord + ", " + bio + ", " + pfp);
	let url = baseURL + '/user';
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		body: {
			'username': username,
			'password': pass,
			'discord': discord,
			'bio': bio,
			'pfp': pfp
		}
	});
}