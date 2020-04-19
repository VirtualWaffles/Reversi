# Reversi
[Project spec](https://sites.google.com/site/2020wseng513/assignments-1/milestone-4---individual-project-option)

[Github repo](https://github.com/VirtualWaffles/Reversi)

[Reversi wiki](https://en.wikipedia.org/wiki/Reversi)

[Name generation](http://jsfiddle.net/ygo5a48r)

[MGS names](http://orteil.dashnet.org/randomgen/?gen=hRJi2umk)

# Run
1. Install Node.js and NPM
2. `$npm install express socket.io`
3. Launch the server with `$node ./server.js`
4. Launch clients by navigating to `<host ip>:<server port>` from a web browser

# TODO
reenable cookies

Converge buttons in css
icons for sidebar in game menu
get name from server on delete
fix color of theme toggle buttons

fix clip paths on menu???

handle score tracking
connect server logic to client

disable join button when no id
buttons provide feedback while loading into games
  text
  disabled
  cancel

track winner
  winner if no valid moves for either
  highest score wins


- [ ] instructions.txt

- [ ] UI
  - [~] main menu
  - [~] game board
  - [x] color themes
    - [x] Light
    - [x] Dark
    - [x] Other

- [x] username
  - [x] random name from words
  - [x] change do alphanumeric

- [x] store cookies
  - [x] store username
  - [x] store code
  - [x] store color theme

- [~] matchmaking
  - [x] random player code
  - [x] join via code
  - [x] random game

- [ ] gameplay
  - [~] display board
  - [ ] restrict until your turn
  - [~] show valid moves
  - [ ] confirm moves w/ server
  - [ ] udpate board every turn
  - [ ] detect game end (no valid moves)
  - [ ] check winner
  - [ ] end game / restart