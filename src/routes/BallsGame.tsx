//@ts-nocheck
import { useEffect } from 'react';
import '../style.css';

export default function FishingGame(){
    useEffect(() => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;

    let background = new Image();
    background.src = require("./upload/background1.png");

    function scaleToFill(img){
        // get the scale
        let scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        let x = (canvas.width / 2) - (img.width / 2) * scale;
        let y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        ctx.font = "40px Verdana";
        ctx.fillText("Use your left and right arrows to catch the correct answer!", 136, 70);
        ctx.textAlign = "start";
        ctx.font = "40px Verdana";
        ctx.fillText(questionList[0], 136, 140);
        ctx.textAlign = "start";

    }
    //Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function(){
        scaleToFill(this);
    }
    //Objects of food 
    let one = new Image();
    one.src = require("./upload/i1.png");
    
    let onePos = {
        x: Math.floor(Math.random() * Math.floor(canvas.width/100))*100,
        y: 0,
        width: 125,
        height: 125,
        correctAns: false,
        resp: "hello"
    }

    let two = new Image();
    two.src = require("./upload/i2.png");
    
    let numTwo = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
    while(numTwo == onePos.x){
        numTwo = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
    }

    let twoPos = {
        x: numTwo,
        y: 0,
        width: 125,
        height:125,
        correctAns: false,
        resp: ""
    }

    let numThree = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
    while(numThree == onePos.x || numThree == twoPos.x){
        numThree = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
    }

    let three = new Image();
    three.src = require("./upload/i3.png");

    let threePos = {
        x: numThree,
        y: 0,
        width: 125,
        height:125,
        correctAns: false,
        resp: ""
    }

    let four = new Image();
    four.src = require("./upload/i4.png");

    let numFour = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
    while(numFour == onePos.x || numFour == twoPos.x || numFour == threePos.x){
        numFour = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
    }
    let fourPos = {
        x: numFour,
        y: 0,
        width: 125,
        height:125,
        correctAns: false,
        resp: ""
    }


    //Questions
    const questions = 
    {
        "what is 5 + 3?":
        {
            "10" : true,
            "5" : false,
            "11" : false,
            "7" : false
        },

        "what is 3-2?" :
        {
            "10" : false,
            "1" : true,
            "3" : false,
            "2" : false
        }
    }

    const questionList = shuffleArray(Object.keys(questions));
    //Populate list 
    function populateObjects(){
        if(questionList[0]){
           
            onePos.x = Math.floor(Math.random() * Math.floor(canvas.width/100))*100;
            onePos.y = 0;
            
            let numTwo = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
            while(numTwo == onePos.x){
                numTwo = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
            }
            twoPos.x = numTwo;
            twoPos.y = 0;
        
            let numThree = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
            while(numThree == onePos.x || numThree == twoPos.x){
                numThree = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
            }
            threePos.x = numThree;
            threePos.y = 0;
    
        
            let numFour = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
            while(numFour == onePos.x || numFour == twoPos.x || numFour == threePos.x){
                numFour = Math.floor(Math.random() * Math.floor(canvas.width/100))*100; 
            }
            fourPos.x = numFour;
            fourPos.y = 0; 

            let answerList = (Object.keys(questions[questionList[0]]));
            onePos.correctAns = questions[questionList[0]][answerList[0]];
            onePos.resp = answerList[0];
            twoPos.correctAns = questions[questionList[0]][answerList[1]];
            twoPos.resp = answerList[1];
            threePos.correctAns = questions[questionList[0]][answerList[2]];
            threePos.resp = answerList[2];
            fourPos.correctAns = questions[questionList[0]][answerList[3]];
            fourPos.resp = answerList[3];

        }
        else{
            console.log("game over");
            ctx.clearRect(0,0,canvas.width,canvas.height);
            clearInterval(timer);
        }
    }
    populateObjects();

    //Brocolli man 
    let player = new Image();
    player.src = require("./upload/af00.png");
    
    let myImgPos = {
        x: 0,
        y: 600,
        width: 200,
        height:200

    }

    player.onload = function(){
        ctx.drawImage(player,myImgPos.x,myImgPos.y,myImgPos.width, myImgPos.height);
    }
    

    function moveMyImgLeft() {
        myImgPos.x -= 20;

    }

    function moveMyImgRight() {
        myImgPos.x += 20;

    }

    document.addEventListener('keydown', function(e) {
        switch (e.key){
            case 'ArrowLeft' :
                if(myImgPos.x - 20 < 0) break;
                moveMyImgLeft();
                break;
            case 'ArrowRight' :
                if(myImgPos.x + 20 > 1285) break;
                moveMyImgRight();
                break;
        }
    }, false);

    //4 Image options STARTS HERE _________________________________


    // four.onload = function(){
    //     ctx.drawImage(four,fourPos.x,fourPos.y,fourPos.width, fourPos.height); 
    // }

    //ENDS HERE__________________________________________________

    function fallItem() {
        onePos.y += 3;
        twoPos.y += 3;
        threePos.y += 3;
        fourPos.y += 3;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        scaleToFill(background);
        ctx.drawImage(one,onePos.x,onePos.y,onePos.width,onePos.height);
        ctx.fillText(onePos.resp,onePos.x+50,onePos.y+75);

        ctx.drawImage(two,twoPos.x,twoPos.y,twoPos.width,twoPos.height);
        ctx.fillText(twoPos.resp,twoPos.x+50,twoPos.y+75);

        ctx.drawImage(three,threePos.x,threePos.y,threePos.width,threePos.height);
        ctx.fillText(threePos.resp,threePos.x+50,threePos.y+75);

        ctx.drawImage(four,fourPos.x,fourPos.y,fourPos.width,fourPos.height);
        ctx.fillText(fourPos.resp,fourPos.x+50,fourPos.y+75);

        ctx.drawImage(player,myImgPos.x,myImgPos.y,myImgPos.width, myImgPos.height);

        //Detect collision 
        if(Math.abs(myImgPos.y - onePos.y) < 100 && Math.abs(myImgPos.x - onePos.x) < 100){
            if(onePos.correctAns){
                questionList.shift();

                alert("Correct!");
                populateObjects();
            }
            else{
                alert("Wrong: try again"); 
                populateObjects();
            }
        }
        if(Math.abs(myImgPos.y - twoPos.y) < 100 && Math.abs(myImgPos.x - twoPos.x) < 100){
            if(twoPos.correctAns){
                alert("Correct!");
                questionList.shift();
                populateObjects();
            }
            else{
                alert("Wrong: try again"); 
                populateObjects();
            }
        }
        if(Math.abs(myImgPos.y - threePos.y) < 100 && Math.abs(myImgPos.x - threePos.x) < 100){

            if(threePos.correctAns){
                alert("Correct!");
                questionList.shift();

                populateObjects();
            }
            else{
                alert("Wrong: try again"); 
                populateObjects();
            }
        }
        if(Math.abs(myImgPos.y - fourPos.y) < 100 && Math.abs(myImgPos.x - fourPos.x) < 100){
            if(fourPos.correctAns){
                alert("Correct!");
                questionList.shift();

                populateObjects();
            }
            else{
                alert("Wrong: try again"); 
                populateObjects();
            }   
        }

        if(onePos.y == 780){
            alert("You SUCK U MISSED");
            populateObjects();
        }

    }

    const timer = setInterval(fallItem,20);


        
    function shuffleArray(arr){
        return arr.sort((a,b)=> 0.5 - Math.random());
    }
},[]);


    return(<canvas id = "canvas"></canvas>)
}
