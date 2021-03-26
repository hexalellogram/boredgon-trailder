// used in post requests
const baseURL = 'https://api-dot-la-hacks-gamers.wl.r.appspot.com';
// used if the user already exists
let jumpTo = 'q1';

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
	// 'Welcome': {
	// 	title: 'Welcome',
	// 	body: 'This is the Monogatari VN Engine',
	// 	icon: ''
	// }
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
		name: 'Question',
		color: '#5bcaff'
	}
});

monogatari.script ({
	// The game starts here.
	'Start': [
		'show scene #f7f6f6 with fadeIn',
		'show notification Welcome',
		{ 'Input': {
			'Text': 'Are you a new or returning user?',
			'Type': 'radio',
			'Options': [
				{
					label: 'New User',
					value: 'new'
				},
				{
					label: 'Returning User',
					value: 'returning'
				}
			],
			'Save': (input) => {
				if (input == 'new') {
					monogatari.storage ({
						player: {
							new: true
						}
					});
					// console.log('new player');
				}
				else {
					monogatari.storage ({
						player: {
							new: false
						}
					});
					// console.log('returning player');
				}
			},
		}},
		'jump NewUserCheck'
	],

	'NewUserCheck': [
		{'Conditional': {
			'Condition': function() {
				return monogatari.storage('player').new;
			},
			'True': 'jump RealName',
			'False': 'jump Username'
		}}
	],

	'RealName': [
		{
			'Input': {
				'Text': 'What is your real name?',
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
				'Warning': 'You must enter a real name!'
			}
		},
		'jump Discord'
	],

	'Discord': [
		{
			'Input': {
				'Text': 'Please enter a Discord username in the format user#1234.',
				'Validation': function (input) {
					return input.trim ().length > 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							discord: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							discord: ''
						}
					});
				},
				'Warning': 'You must enter a Discord username!'
			}
		},
		'jump Bio'
	],

	'Bio': [
		{
			'Input': {
				'Text': 'Please enter a short bio that describes you.',
				'Validation': function (input) {
					return input.trim ().length > 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							bio: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							bio: ''
						}
					});
				},
				'Warning': 'You must enter a bio!'
			}
		},
		'jump Username'
	],

	'Username': [
		{
			'Input': {
				'Text': 'Please enter a username!',
				'Validation': function (input) {
					return input.trim ().length > 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							username: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							username: ''
						}
					});
				},
				'Warning': 'You must enter a username!'
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
		{'Conditional': {
			'Condition': function() {
				return monogatari.storage('player').new;
			},
			'True': 'jump UserCreation',
			'False': 'jump Login'
		}}
	],

	'UserCreation': [
		'y We\'re creating your profile now, please hold tight!',
		{'Function':{
            'Apply': async function () {
				let resp = await registerUser(monogatari.storage().player.name, 
					monogatari.storage().player.username, 
					monogatari.storage().player.pass, 
					monogatari.storage().player.discord, 
					monogatari.storage().player.bio, 0); // 0 is for profile picture choices, not implemented yet
				// console.log('Response in UserCreation');
				// let awaitedResp = await resp.json();
				// console.log(awaitedResp);
				monogatari.storage().userCreationResponseStatus = resp.status;
            },
            'Reverse': function () {
				// empty reverse function, creating a user account cannot be undone
			}   
        }},
		{'Conditional': {
			'Condition': function() { // check if the response was successful
				return monogatari.storage('userCreationResponseStatus') == 200;
			},
			'True': 'jump Question1', // success, start on the questions
			'False': 'jump UserCreationFailed'
		}}
	],

	'UserCreationFailed': [
		'y Sorry, the username you chose was taken. Please choose another username and reenter your password!',
		{'Function': {
			'Apply': function () {
				monogatari.storage('player').username = '';
				monogatari.storage('player').pass = '';
			},
			'Reverse': function() {
				// empty reverse function because this is just to wipe the username and password
			}
		}},
		'jump Username'
	],

	// TODO add login functionality here
	'Login': [
		'y Welcome back! Click to log in now.',
		{'Function':{
            'Apply': async function () {
				let resp = await loginUser(monogatari.storage().player.username, 
					monogatari.storage().player.pass);
				// console.log('Response in UserCreation');
				// let awaitedResp = await resp.json();
				// console.log(awaitedResp);
				// console.log('Status: ' + resp.status);
				monogatari.storage().loginResponseStatus = resp.status;
            },
            'Reverse': function () {
				// empty reverse function, logging in cannot be undone
			}   
        }},
		{'Conditional': {
			'Condition': function() { // check if the response was successful
				return monogatari.storage('loginResponseStatus') == 200;
			},
			'True': 'jump DetermineQuestion', // success, start on the questions
			'False': 'jump LoginFailed'
		}}
	],

	// I'm sorry this conditional is so bad
	'DetermineQuestion': [
		{'Conditional': {
			'Condition': function() {
				return jumpTo;
			},
			'q1': 'jump Question1',
			'q2': 'jump Question2',
			'q3': 'jump Question3',
			'q4': 'jump Question1',
			'q5': 'jump Question5',
			'q6': 'jump Question6',
			'q7': 'jump Question7',
			'q8': 'jump Question8',
			'q9': 'jump Question9',
			'q10': 'jump Question10',
			'Ending': 'jump LoginEnding'
		}},
		'jump Question1' // escape hatch for the first question
	],

	'LoginFailed': [
		'y Sorry, you entered an incorrect username and/or password. Please try again!',
		{'Function': {
			'Apply': function () {
				monogatari.storage('player').username = '';
				monogatari.storage('player').pass = '';
			},
			'Reverse': function() {
				// empty reverse function because this is just to wipe the username and password
			}
		}},
		'jump Username'
	],

	'LoginEnding': [
		'y We noticed you already completed Boredgon Trailder. Would you like to play again or view your matches?',
		{'Choice': {
			'Play': {
				'Text': 'Play Again',
				'Do': 'jump Question1'
			},
			'View': {
				'Text': 'View Matches',
				'Do': 'jump Ending'
			}
		}},
		'jump Ending' // escape hatch to jump to ending (shouldn't get here but regardless)
	],
	
	// all questions are now contained in questions.js
});

async function uploadAnswer(username, pass, question, answer) {
	// console.log("Upload function called with the following params: " + username + ", "+ pass + ", " + question + ", " + answer);
	let questionStr = 'q' + question;
	let url = baseURL + '/trail';
	let data = {
		'username': username,
		'password': pass
	}
	data[questionStr] = answer;
	const response = await fetch(url, {
		method: 'POST',
		// mode: 'no-cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	// console.log(await response.json());
	return response;
}

async function registerUser(name, username, pass, discord, bio, pfp) {
	// console.log("Attempting to register user with the following params: "  + name + ", " + username + ", "+ pass + ", " + discord + ", " + bio + ", " + pfp);
	let url = baseURL + '/user';
	const response = await fetch(url, {
		method: 'POST',
		// mode: 'no-cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'name': name,
			'username': username,
			'password': pass,
			'discord': discord,
			'bio': bio,
			'pfp': pfp
		})
	});
	// console.log(await response.json());
	return response;
}

async function loginUser(username, pass) {
	// console.log("Attempting to login user with the following params: " + username + ", "+ pass);
	let url = baseURL + '/user';
	const response = await fetch(url, {
		method: 'POST',
		// mode: 'no-cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'username': username,
			'password': pass
		})
	});

	let awaitedResponse = await response.json();
	// console.log(awaitedResponse);
	jumpTo = awaitedResponse.question;
	// console.log("Command to be issued: " + jumpTo);
	return response;
}