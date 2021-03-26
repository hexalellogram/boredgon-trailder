/* global monogatari */

// Persistent Storage Variable
monogatari.storage ({
	player: {
		username: '',
		name: '',
		pass: '',
		discord: '',
		bio: '',
		new: true
	},
	userCreationResponseStatus: 0,
	loginResponseStatus: 0,
	questionToResumeAt: 'jump q1'
});