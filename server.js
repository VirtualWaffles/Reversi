/******************************************************************************
Author:  Jesse Shewfelt
Updated: 28/03/2020


******************************************************************************/
"use strict";

//hosted on this port number
const PORT = 7253;

//dimensions of game board
const XDIM = 8;
const YDIM = 8;




let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

//start server
http.listen(PORT, function(){
    console.log("Server started on port " + PORT);
});

//serve client files
app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/reversi.html');
  });


/*
each room known by id has
open bool
pb id
pw id
game which has
  board
  scores
  turn
  winner
*/
//collection of lobbies with up to two players playing a game
let rooms = {};
let public_room;

//https://socket.io/docs/emit-cheatsheet/
io.on('connection', function(socket){
    
    welcome();

    //USER SETTING FUNCTIONS
    function welcome(){
        let cookies = socket.handshake.headers['cookie'];
        let theme = get_theme(cookies);
        let name = get_username(cookies);
        let id = get_id(cookies);
        console.log(`User joined: ${name} ${theme} ${id}`);
        let data = {
            name: name,
            theme: theme,
            id: id
        };

        io.to(socket.id).emit('init', data);
    };

    function get_cookie(cookie, cookies){
        let result;
        if(cookies){
            let i = cookies.search(cookie+"=");
            if(i >= 0){
                result = cookies.slice(i + cookie.length + 1);
                i = result.search(';');
                if(i >= 0)
                    result = result.substring(0, i);
            }
        }
        return result;
    };

    function get_theme(cookies){
        let theme = get_cookie("theme", cookies);
        if(!theme || !is_valid_theme(theme))
          theme = 'light-basic';
        return theme;
    };

    function is_valid_theme(theme){
        return ["light-basic", "dark-basic", "light-chromatic", "dark-chromatic"].includes(theme);
    };

    function get_username(cookies){
        let name = get_cookie("username", cookies);
        if(!name) 
            name = generate_name();
        return name;
    };

    function generate_name(){
        //https://jsfiddle.net/ygo5a48r/
        //names from https://pastebin.com/raw/hRJi2umk
        let name_components = [];
        name_components.push(["Airborne-", "Alive-", "Amber-", "Armor-", "Armored-", "Arsenal-", "Ashen-", "Assassin-", "Assault-", "Bastard-", "Battle-", "Big-", "Biting-", "Bitter-", "Black-", "Black-Arts-", "Blazing-", "Bloody-", "Blue-", "Bolt-", "Brass-", "Bronze-", "Brown-", "Brutal-", "Bullet-", "Cannibal-", "Charging-", "Code-", "Cold-", "Command-", "Copper-", "Coward-", "Crawling-", "Creeping-", "Crimson-", "Crying-", "Crystal-", "Cunning-", "Cyborg-", "Dark-", "Dead-", "Death-", "Decoy-", "Devil-", "Diamond-", "Dire-", "Dirty-", "Dizzy-", "Doom-", "Eastern-", "Emergency-", "Engineer-", "Espionage-", "Evasion-", "Fat-", "Fire-", "Flaming-", "Flying-", "Frantic-", "Frigid-", "Garnet-", "Ghost-", "Glacier-", "Goblin-", "Gold-", "Golden-", "Gray-", "Greedy-", "Green-", "Grizzly-", "Growling-", "Hissing-", "Hot-", "Howling-", "Hulking-", "Hungry-", "Hunting-", "Infinity-", "Intelligence-", "Iron-", "Jungle-", "Killer-", "King-", "Laughing-", "Liquid-", "Little-", "Lonely-", "Lost-", "Love-", "Machinegun-", "Mad-", "Marionette-", "Master-", "Medical-", "Metal-", "Midnight-", "Military-", "Naked-", "New-", "Night-", "Northern-", "Nuclear-", "Ochre-", "Old-", "Otaku-", "Panzer-", "Peace-", "Phantom-", "Pink-", "Pirate-", "Platinum-", "Poison-", "Police-", "Pouncing-", "Praying-", "Predator-", "Prowling-", "Psycho-", "Punching-", "Punished-", "Purple-", "Pyro-", "Queen-", "Rabid-", "Radio-", "Raging-", "Rampant-", "Rancid-", "Ranger-", "Raving-", "Razor-", "Recon-", "Red-", "Rescue-", "Resistance-", "Revolver-", "Riot-", "Roaring-", "Rogue-", "Rose-", "Rumble-", "Running-", "Sadistic-", "Scout-", "Scowling-", "Screaming-", "Security-", "Seething-", "Sentinel-", "Service-", "Shadow-", "Shining-", "Shoot-", "Sight-", "Signal-", "Silent-", "Silver-", "Sinister-", "Skull-", "Slasher-", "Sly-", "Small-", "Smoking-", "Snatcher-", "Sniper-", "Solid-", "Solidus-", "Southern-", "Special-", "Spitting-", "Spunky-", "Spying-", "Stalking-", "Steel-", "Stone-", "Strange-", "Striker-", "Stubborn-", "Sunny-", "Survival-", "Sword-", "Tactical-", "Technical-", "The-", "Thunder-", "Ultra-", "Vampire-", "Vengeful-", "Venom-", "Vic-", "Vile-", "Virtual-", "Vulcan-", "Warfare-", "Western-", "White-", "Wild-", "Yellow-", "Zero-"]);
        name_components.push(["Agama", "Alligator", "Anaconda", "Ant", "Ape", "Armadillo", "Baboon", "Badger", "Barracuda", "Basilisk", "Bat", "Bear", "Beast", "Beauty", "Bee", "Beetle", "Bison", "Bluebird", "Boa", "Boss", "Buffalo", "Bull", "Butterfly", "Buzzard", "Camel", "Canine", "Capybara", "Cat", "Centipede", "Chameleon", "Chick", "Chicken", "Cobra", "Cow", "Coyote", "Crab", "Crocodile", "Crow", "Deer", "Dingo", "Doberman", "Dolphin", "Dragon", "Duck", "Eagle", "Eel", "Elephant", "Falcon", "Firefly", "Flying-Fox", "Flying-Squirrel", "Fox", "Frill-Shark", "Frog", "Gator", "Gazelle", "Gecko", "Giant-Panda", "Gibbon", "Goat", "Gorilla", "Gull", "Gunner", "Harrier", "Hawk", "Hedgehog", "Heron", "Hippo", "Hippopotamus", "Hog", "Hornet", "Horse", "Hound", "Husky", "Hyena", "Iguana", "Inchworm", "Jackal", "Jaguar", "Jaws", "Kangaroo", "Kerotan", "Kid", "Koala", "Komodo-Dragon", "Leech", "Leopard", "Lion", "Little-Gray", "Lobster", "Mammoth", "Mantis", "Markhor", "Marlin", "Mastiff", "Mastodon", "Mongoose", "Moose", "Mosquito", "Moth", "Mouse", "Mustang", "Night-Owl", "Ninja", "Ocelot", "Octopus", "Ogre", "Orca", "Osprey", "Ostrich", "Ox", "Panther", "Parrot", "Peccay", "Pig", "Pigeon", "Piranha", "Platypus", "Puma", "Python", "Rabbit", "Ram", "Raptor", "Rat", "Raven", "Ray", "Rhino", "Roach", "Rooster", "Salamander", "Scorpion", "Sea-Louce", "Serpent", "Shark", "Sloth", "Slug", "Snake", "Spider", "Squirrel", "Stallion", "Sturgeon", "Swallow", "Tarantula", "Tasmanian-Devil", "Tengu", "Tiger", "Tortoise", "Tree-Frog", "Tsuchinoko", "Skipjack-Tuna", "Swan", "Turtle", "Viper", "Vulture", "Waffle", "Wallaby", "Wasp", "Werewolf", "Whale", "Wolf", "Worm", "Yoshi", "Zebra"]);
        
        let username = "";
        for(let c of name_components)
            username += c[Math.floor(Math.random() * c.length)];
        return username;
    };

    function get_id(cookies){
        let id = get_cookie("id", cookies)
        if(!id)
            id = generate_id(10);
        return id;
    };

    function generate_id(length){
        //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < length; i++){
            result += characters.charAt(Math.floor(Math.random() *  characters.length));
        }
        return result;
    };
    

    socket.on('name', function(){
        socket.emit('name', generate_name());
    });


    //GAMEPLAY FUNCTIONS
    socket.on('host', function(data){
        //TODO handle matching id's
        host_game(socket, data);
    });

    socket.on('join', function(data){
        if(!rooms[data.id] || !rooms[data.id].open)
            socket.emit('none-found');
        else
            join_game(socket, data);
    });

    socket.on('match', function(data){
        if(public_room){
            data.id = public_room;
            public_room = null;
            join_game(socket, data);
        }
        else{
            public_room = data.id;
            host_game(socket, data);
        }
    });

    socket.on('quit', function(data){
        //TODO handle host leaving
        socket.leave(data.id);
    });


    //handle a single turn of a game
    socket.on('play', function(data){
        /*
            check move is valid
                if not respond error
            update game board
            check scores
            swap turn
            emit new state

            a move consists of color and pair
            board is 2d array
            each position tracks
                token: black white none
                valid for black
                valid for white

            board = [[{token:none, b:false, w:false},{},{}] ]
        */
        let game = rooms[data.id].game;
        //not your turn
        if(!game.turn[data.color])
            socket.emit('invalid');
        
        //invalid move
        if(!place(data.color, data.space, game.board))
            socket.emit('invalid');
        
        //all good, update turn and share new game state
        else{
            game.turn.b = !game.turn.b;
            game.turn.w = !game.turn.w;
            io.in(data.id).emit('update', game);
        }
    });

    function host_game(socket, data){
        console.log(`Player ${data.name} hosted game ${data.id}`);
        socket.join(data.id);
        rooms[data.id] = {
            open: true,
            b: data.name,
        }        
        socket.emit('enter', 'b');
    };

    function join_game(socket, data){
        console.log(`Player ${data.name} joined game ${data.id}`);
        socket.join(data.id);
        rooms[data.id].open = false;
        rooms[data.id].w = data.name;
        rooms[data.id].game = new_game();
        socket.emit('enter', 'w');
        
        console.log(`Game between ${rooms[data.id].b} and ${rooms[data.id].w} started in lobby ${data.id}`)
        io.in(data.id).emit('started', rooms[data.id]);
    };


    function new_game(){
        /*
        GAME STRUCTURE
        games consists of:
        whos turn
        scores
            black
            white
        board which is 2d array of:
            token at this space
            is this space valid for black
            is this space valid for white
        */
        let board = new Array(XDIM);
        for(let i = 0; i < XDIM; i++){
            board[i] = new Array(YDIM);
            for(let j = 0; j < YDIM; j++){
                board[i][j] = {token: false, b:false, w:false};
            }
        }
        //init center spaces
        let midx = Math.floor(board.length / 2);
        let midy = Math.floor(board[0].length / 2);
        board[midx-1][midy-1].token = 'w';
        board[midx  ][midy-1].token = 'b';
        board[midx-1][midy].token = 'b';
        board[midx  ][midy].token = 'w';

        draw(board);
        validate_all(board);
        console.log("board validated");
        return {turn:1, score:{b:2, w:2}, board:board};
    }


    //GAME LOGIC
    //place a token in the given space and flip all required tokens
    function place(color, space, board){
        //if spot invalid for this color
        if(!board[place.x][place.y][color])
            return false;
        
        board[place.x][place.y][token] = color;
        flip_all(color, space, board);
        validate_all(board);
        return true;
    };
    
    //for each of eight direction flip all required tokens
    function flip_all(color, space, board){
        let ymod, xmod;
        for(let i = 0; i < 3; i++){
            xmod = (i % 3) - 1; //[-1, 0, 1]
            for(let j = 0; j < 3; j++){
                ymod = (j % 3) - 1; //[-1, 0, 1]
                if(ymod === 0 && xmod === 0)
                    continue;
                flip(color, space, board, xmod, ymod);
            }
        }
    };

    //flip all required tokens in the direction determined by xmod & ymod
    function flip(color, space, board, xmod, ymod){
        let x = space.x + xmod;
        let y = space.y + ymod;
        let do_flip = false;

        while(bounded()){
            if(do_flip)
                board[x][y].token = color;
            //upon finding a token of your color go back the other way flipping tokens
            else if(board[x][y].token === color){
                do_flip = true;
                xmod *= -1;
                ymod *= -1;
            }
            x += xmod;
            y += ymod;
        }

        function bounded(){
            return (x < board.length &&
                    x >= 0 &&
                    y < board[0].length &&
                    y >= 0 &&
                    (x != space.x || y != space.y)
                    )
        };
    }

    //for each space on the board set whether it is a valid space for both colors
    function validate_all(board){
        for(let i = 0; i < board.length; i++)
            for(let j = 0; j < board[0].length; j++)
                validate({x:i, y:j}, board);
    }

    //check whether this space is a valid move for both colors
    function validate(space, board){
        //assume not valid
        board[space.x][space.y].b = false;
        board[space.x][space.y].w = false;
        
        //if a tokens already there its not valid
        if(board[space.x][space.y].token)
            return;

        //look in each direction for lines of one color ending in the other
        let ymod, xmod;
        for(let i = 0; i < 3; i++){
            xmod = (i % 3) - 1; //[-1, 0, 1]
            for(let j = 0; j < 3; j++){
                ymod = (j % 3) - 1; //[-1, 0, 1]
                if(ymod === 0 && xmod === 0)
                    continue;
                is_valid(space, board, xmod, ymod);
                if(board[space.x][space.y].b === true && board[space.x][space.y].w === true)
                    return;
            }
        }        

    };

    //look in a specific direction to check if there is a valid move for both colors
    function is_valid(space, board, xmod, ymod){
        let x = space.x + xmod;
        let y = space.y + ymod;
        if(!bounded())
            return;
        //only validity of non-neighbor color can be determined
        //if none space is empty or oob so skip
        if(!board[x][y].token)
            return;
        let color = board[x][y].token;


        //if the neighbor token is black were looking white cap and vice versa
        if(color === 'b')
            color = 'w';
        else
            color = 'b';
            
        x += xmod;
        y += ymod;
        while(bounded()){
            //no token of this color in the line
            if(!board[x][y].token)
                return;

            //a line of opposite color exists capped by this color so this is a valid space for this color
            if(board[x][y].token === color){
                board[space.x][space.y][color] = true;
                return;
            }

            //token here is line color so keep looking for cap
            x += xmod;
            y += ymod;
        }

        function bounded(){
            return (x < board.length &&
                    x >= 0 &&
                    y < board[0].length &&
                    y >= 0)
        }
    };


    function draw(board){
        let token;
        for(let i = 0; i < XDIM; i++){
            process.stdout.write("\n| ");               
            for(let j = 0; j < YDIM; j++){
                token = '.'
                if(board[i][j].token)
                    token = board[i][j].token;
                process.stdout.write(`${token} | `);
            }
        }
        process.stdout.write("\n\n");   
    };
});

