/******************************************************************************
Author:  Jesse Shewfelt
Updated: 28/03/2020
******************************************************************************/
"use strict";

$(document).ready(function(){
    console.log("Script loaded");

    // let board = new Array(2);
    /*
    space is:
    open black white
    invalid valid-black valid-white both
    */

    $("#host-id").val("Test");

    let socket = io();

    //Build board grid
    for(let i = 1; i <= 8; i++){
        for(let j = 1; j <= 8; j++){
            let space = $(`<div id="s${i}${j}" class="space grid-item"></div>`);
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
        //load game state
        //hacky fix
        document.documentElement.style.setProperty("--fade-in", "0.15s");
        $("#game").toggleClass("hidden");
        $("#game").toggleClass("visible");
    });


    //Toggle color themes
    $(".toggle input").click(function(){
        if(this.id === "light-dark"){
            $('body').toggleClass("light");
            $('body').toggleClass("dark");

            if($(this).siblings("label").text() === "Light")
            $(this).siblings("label").text("Dark");
            else
            $(this).siblings("label").text("Light");
        }

        else if(this.id === "basic-chromatic"){
            $('body').toggleClass("chromatic");

            if($(this).siblings("label").text() === "Basic")
            $(this).siblings("label").text("Chromatic");
            else
            $(this).siblings("label").text("Basic");
        }
    });


    $(".nav-btn").click(function(){
        if($(this).text() === "Exit"){
            $("#game").toggleClass("hidden");
            $("#game").toggleClass("visible"); 
            //reset game state         
        }
    });

});