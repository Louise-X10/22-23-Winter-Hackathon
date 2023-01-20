# 22-23 Winter Hackathon

- `bouncing-balls`: Bouncing balls web simulation with self-implemented physics
- `compound-interest`: Compount Interest Calculator
- `poker`: Texas hold'em poker game (currently need to manually start code on remote server to play game)

## Bouncing balls
25 balls of random size, color, velocity are created. Use `AWSD` to move the Evilball (transparent with white border) and eat the other balls. A total ball count is kept on the upper right corner of the page. 

P.S. When two balls collide, they bounce off each other and both change to another random color. 

## Compound interest calculator
Calculator with 4 input fields: primary amount, interest rate, time cycle, final amount. Given any 3 of the 4 fields, the calculator can compute the remaining field. More detailed instructions are given on the webpage. 

## Online two-player Poker (Playable)
A playable version of the poker game is accessible at `http://hackathon.gloopen.com:3000/`

A non-playable view of the poker game webpage is accessible at `https://louise-x10.github.io/22-23-Winter-Hackathon/poker/`

### Todo list
- Woking on
  - Highlight current player in message area
  - Display winner's hand?
- Additional features:
  - Change page colors: lighter green background?
  - All players loop on same bgm
  - Big bind, small bind
  - Once player has no tokens, lose game. 
  - BUG: Break ties with more than 2 players (alert if so)
  - BUG: reveal last card before alert message for other players (check if resolved)
- What happens if player disconnects
  - Notify players to reset if total logged players and total sockets don't match up (done) (not a problem in remote server)
  - During game, player that disconnects and reconnects with same name should be able to rejoin game with same socket?
  - Pause game if someone disconnects, save game session info, reload game once reconnect
  - New player not allowed to join midgame?
- To be completed
  - Refine multiple token movement (animate different target positions), adjust delay (not essential)
  - Reorganize token after collection (not essential)
  
### Completed
  - Multiplayer and multirounds: 
    - Initialize new game and rotate player order
    - Decide which cards to flip on client side
    - Bet: subtract player.money after bet, reset player.betvalue after new round
    - Fold: fixed loop issue by setting one-time listener on server side, but still not sure why client keeps firing fold event
    - Next game: reset round, client click collect / clear token button then click ready for next game, add player money after collect tokens
    - Message: display result (congrats winner and say if winning due to folds), remind players to start new game, record current round number, record highest bet value per round
    - Username: displayed at top of page
    - Log users: display all players currently still in game on page
    - Start game: game starts once any player presses start
    - Reset game: game restarts once any player presses restart, alert users about reset
- Online multi-user version with Socket.io
  - Client's ability:
    - Flip own cards and select own tokens whenever they want
    - Make bet and animate token movement to common table
    - Collect tokens and animate token movement to player table (not done)
    - Store card objects: suit, number (e.g. 11, 12), value (e.g. jack, queen)
    - Has player as a global variable
  - Server's ability:
    - Deal cards to all players and common table
    - Decide whose turn to play (i.e. next button)
    - Update common table status to all players
    - Store game player cards as object {suit, number}
    - Save list of loggedplayers, list of sockets
- Two-player:
  - Take turns acting in one round
  - Setup server
  - Compare evaluations and declare winner
  - Move tokens to winner
  - Fold mechanism
  - End game early whenever all other players folded
  - Automatic flip cards back after player action (make bet or fold)
  - Match mechanism (simplified rules)
  - Initiate new game after game ends
  - Split tokens evenly for ties
- Single-player:
  - Card flips
  - Table Setup
  - Token Movement
  - Evaluate poker hand ranking
  - Animate Token Movement
