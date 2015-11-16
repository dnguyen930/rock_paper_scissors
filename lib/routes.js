Router.route('/', {
    template: 'home'
});

// Set the player number into the session so that I can reuse the template
Router.route('/player1', {
    template: 'game',
    onBeforeAction: function () {
        Session.set('player_number', 1);
    }

});
Router.route('/player2', {
    template: 'game',
    onBeforeAction: function () {
        Session.set('player_number', 2);
    }
});