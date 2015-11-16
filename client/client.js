// Subscribe to 'games' collection on startup.
Games = new Meteor.Collection('games');
Meteor.subscribe('games', function(){
});

Template.game.helpers({
  // Helper function to get the player number that is passed in the route
  player_number :function() {
    return Session.get('player_number');
  },

  // Gets the game status from the collection
  game_status : function() {
    // Find the only game in the collection
    var game = Games.findOne();

    // Find the player number
    var player = Session.get('player_number');

    // Display the correct text for each player
    if(player == 1){
      return game['p1_text'];
    }
    else {
      return game['p2_text'];
    }
  },

  // Checks if the game is done
  game_done : function() {
    var game = Games.findOne();
    return game['game_done'];
  }
});

// Template for the rock button
Template.rock.events = {
  'click': function(){
    console.log('rock');
    Meteor.call('play_move', Session.get('player_number'), ROCK);
  }
};

// Template for the paper button
Template.paper.events = {
  'click': function(){
    console.log('paper');
    Meteor.call('play_move', Session.get('player_number'), PAPER);

  }
};

// Template for the scissors button
Template.scissors.events = {
  'click': function(){
    console.log('scissors');
    Meteor.call('play_move', Session.get('player_number'), SCISSORS);
  }
};

// Template for the new game button
Template.new_game.events = {
  'click': function(){
    console.log('New Game');
    Meteor.call('new_game');
  }
};


