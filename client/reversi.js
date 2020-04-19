/******************************************************************************
Author:  Jesse Shewfelt
Updated: 28/03/2020
******************************************************************************/
"use strict";

$(document).ready(function(){
    console.log("Script loaded");
    let socket = io();
    let id;

    let board;
    let my_color;

    // let board = new Array(2);
    /*
    space is:
    open black white
    invalid valid-black valid-white both
    */


    //Build board grid
    for(let i = 1; i <= 8; i++){
        for(let j = 1; j <= 8; j++){
            let space = $(`<div id="s${i-1}${j-1}" class="space grid-item"></div>`);
            space.css({'grid-column': i, 'grid-row':j});
            $("#board").append(space);
        }
    }


    //Menu buttons
    $(".menu-click").click(function(e){
        e.stopPropagation();
        let type = this.classList[2];
        let position = (this.offsetTop + this.offsetHeight/2) / this.parentElement.offsetHeight * 100;

        document.documentElement.style.setProperty("--fade-in", "0s");
        if($(".visible").length === 0){
            document.documentElement.style.setProperty("--fade-in", "0.15s");
        }

        let popouts = $(".popout");
        for(let p of popouts){
            if(p.classList.contains(type))
                p.classList.replace("hidden", "visible");
            else
                p.classList.replace("visible", "hidden");

            p.style.clipPath = `polygon(7.4% 0, 100% 0, 100% 100%, 7.40% 100%, 7.4% ${position-3}%, 0 ${position}%, 7.4% ${position+3}%)`;
        }
    });

    //Connect to game buttons
    $(".play-click").click(function(){
        if(this.id.includes("host"))
            socket.emit('host', {id: id, name:$("#name input").val()});
        else if(this.id.includes("join"))
            socket.emit('join', {id: $("#join-id").val(), name: $("#name input").val()});
        else if(this.id.includes("match"))
            socket.emit('match', {id: id, name: $("#name input").val()});
    });

    //Toggle color themes
    $(".toggle input").click(function(){
        if(this.id === "light-dark"){
            if($(this).siblings("label").text() === "Light")
                set_theme("dark", "");    
            else
                set_theme("light", "");    
        }

        else if(this.id === "basic-chromatic"){
            if($(this).siblings("label").text() === "Basic")
                set_theme("", "chromatic");    
            else
                set_theme("", "basic");    
        }
    });

    //In game sidebar navigation
    $(".nav-btn").click(function(){
        if($(this).text() === "Exit"){
            $("#game").toggleClass("hidden");
            $("#game").toggleClass("visible"); 
            //reset game state         
        }
    });


    //Save username
    $("#name input").on('input', function(){
       set_name($("#name input").val().toString());
    });

    $("#name input").blur(function(){
        if(!$("#name input").val())
            socket.emit('name');
    });
    socket.on('name', function(name){
        set_name(name);
    });









    //Socket stuff
    socket.on('init', function(data){
        console.log(`Welcome: ${data.name} ${data.theme} ${data.id}`);
        let theme = data.theme.split("-");
        set_theme(theme[0], theme[1]);
        set_name(data.name);
        set_id(data.id);
    });


    socket.on('enter', function(color){
        //hacky fade in fix
        document.documentElement.style.setProperty("--fade-in", "0.15s");
        $("#game").toggleClass("hidden");
        $("#game").toggleClass("visible");
        my_color = color;
        if(my_color === 'b'){
            $("#score-me").css("background-color","var(--darkgray6)");
            $("#score-me").css("color","var(--gray1)");
            $("#score-them").css("background-color","var(--gray1)");
            $("#score-them").css("color","var(--darkgray6)");
        }
        else{
            $("#score-them").css("background-color","var(--darkgray6)");
            $("#score-them").css("color","var(--gray1)");
            $("#score-me").css("background-color","var(--gray1)");
            $("#score-me").css("color","var(--darkgray6)");
        }
        $("#help").innerHTML = "Waiting for opponent";
    });


    socket.on('started', function(data){
        console.log(`Game between ${data.b} and ${data.w} started`)
        board = data.board;
        let them = 'b';
        if(my_color === 'b')
            them = 'w'

        console.log(data[them]);
        $("#player-them h1").html(data[them]);
        update(data.game);
        //call update function with board data to start game
        //set scores
        //game actually begins
        //set tokens and stuff
        //
    });
    

    socket.on('update', function(data){
        //udpate game state
        //update help text
    });


    //given a game state updates the local game state
    function update(game){
        /*
        if game over update help and disable turns

        for each space
        if the matching space in the game has a token
        add a token class to that element
        if its valid for my color add a valid class
        */

        let spaces = $(".space");
        for(let space of spaces){
            set_space(space, game.board)
        }
    };

    function set_space(space, board){
        let x = space.id[1];
        let y = space.id[2];
        let state = board[x][y];

        $(space).removeClass("valid");
        $(space).empty();

        if(state[my_color])
            $(space).addClass("valid");
        if(state.token){
            let token = $(`<div class="token token${state.token}"></div>`);
            $(space).append(token);
        }
    };

    function set_theme(brightness, color){
        if(brightness){
            console.log(`Setting brightness to: ${brightness}`);
            $("body").removeClass(["light", "dark"]);
            $("body").addClass(brightness);
            $("#brightness").children("label").text(brightness[0].toUpperCase() + brightness.slice(1));
        }

        if(color){
            console.log(`Setting color to: ${color}`);
            $("body").removeClass("chromatic");
            if(color === "chromatic")
                $("body").addClass("chromatic");
            $("#color").children("label").text(color[0].toUpperCase() + color.slice(1));            
        }

        let cookie =  ($("#brightness").children("label").text() + "-" + $("#color").children("label").text()).toLowerCase();
        // document.cookie = 'theme=' + cookie + '; max-age=' + 60*60*24 + ';';
    };

    function set_name(name){
        name = name.replace(/ /g, "-");
        let objects = $(".username");
        for(let o of objects){
            if(o.nodeName === "H1")
                o.innerHTML = name;
            else if(o.nodeName === "INPUT")
                $(o).val(name);
        }
        // document.cookie = 'username=' + name + '; max-age=' + 60*60*24 + ';';
    };

    function set_id(newid){
        id = newid;
        $("#host-id").val(id);
        // document.cookie = 'id=' + newid + '; max-age=' + 60*60*24 + ';';
    };
});