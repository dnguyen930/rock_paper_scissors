Games = new Mongo.Collection("games");

// Publish the game to all clients
Meteor.publish('games', function(){
	return Games.find();
});

// Create the game document if starting for the first time
var my_game = Games.find();
if(my_game.count() == 0){
	Games.insert(initial_item);
}
else{
	console.log("NOT EMPTY!");
}

// Server methods that we expose to the clients
Meteor.methods({

	// Restarts the game
	new_game: function (){
		var game = Games.findOne();

		Games.update({
			_id: game._id
		}, {
			$set: initial_item
		});
	},

	// Play the hand from the given player
	play_move : function (player_number, move) {
		// Get our game from the collection
		var game = Games.findOne();

		// Update our game according to which player
		if (player_number == 1) {
			// save current move for player1
			Games.update({
				_id: game._id
			}, {
				$set: {
					p1_hand: move,
					p1_text: "Threw " + rps[move] + ", waiting for the other player"
				}
			});
		}
		else {
			// save current move for player2
			Games.update({
				_id: game._id
			}, {
				$set: {
					p2_hand: move,
					p2_text: "Threw " + rps[move] + ", waiting for the other player"
				}
			});
		}

		// Check if both players have made a move
		check_if_both_played();
	}
});

// Function to check if both players have played
var check_if_both_played = function () {

	// Grab our game
	game = Games.findOne();

	// Check the hands played
	var p1_hand = game['p1_hand'];
	var p2_hand = game['p2_hand'];

	// Check to see if both hand has been set
	if (p1_hand != null && p2_hand != null) {
		// See who the winner is depending on the hands
		var winner = winner_valuator(p1_hand, p2_hand);

		// Player hands
		var p1_new_text = "Player 1: " + rps[p1_hand] + " Player 2: " + rps[p2_hand];
		var p2_new_text = p1_new_text;

		// Update the text with the result
		if (winner == 0) {
			p1_new_text = "Draw...  " + p1_new_text;
			p2_new_text = p1_new_text;
		}
		else if (winner == 1) {
			p1_new_text = "Winner!! " + p1_new_text;
			p2_new_text = "You lost... " + p2_new_text;
		}
		else {
			p1_new_text = "You lost... " + p1_new_text;
			p2_new_text = "Winner!! " + p2_new_text;
		}

		// Save the new text to the collection
		Games.update({
			_id: game._id
		}, {
			$set: {

				p1_text: p1_new_text,
				p2_text: p2_new_text,
				game_done: true
			}
		});
	}
};

// Determine who the winner is
var winner_valuator = function(move1, move2){
	// Draw : winner = 0
	// Otherwise winner is the player who won
	var winner;

	// Check for a draw
	if(move1 == move2) {
		winner = 0;
	}
	else if (move1 == ROCK){
		if (move2 == SCISSORS) {
			winner = 1;
		}
		else {
			winner = 2;
		}
	}
	else if (move1 == PAPER) {
		if(move2 == ROCK){
			winner = 1;
		}
		else {
			winner = 2;
		}

	}
	else if (move1 == SCISSORS) {
		if(move2 == PAPER) {
			winner = 1;
		}
		else{
			winner = 2;
		}
	}
	return winner
};

