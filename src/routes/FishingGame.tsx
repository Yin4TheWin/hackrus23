//@ts-nocheck
import { get, ref, getDatabase } from 'firebase/database';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {firebase} from '../firebase'
import '../style.css';

export default function FishingGame(){
    const db=getDatabase(firebase)
    const location=useLocation().pathname.split("/")
    const uid=location[3]
    const className=decodeURI(location[4])
    const quizName=decodeURI(location[5])
    useEffect(() => {
            get(ref(db, "users/"+uid+"/classes/"+className)).then(teacherUID=>{
                get(ref(db, "users/"+teacherUID.val()+"/quiz/"+quizName+"/questions")).then(questionRef=>{
                    let questions={}
                    if(questionRef.exists()){
                        questions=questionRef.val()
                    }
                    const canvas = document.querySelector("#canvas");
        
                    const ctx = canvas.getContext("2d");
                
                
                    canvas.height = window.innerHeight;
                
                    canvas.width = window.innerWidth
                
                    //Event listeners
                    let mouseClicked = false;
                    canvas.addEventListener('click', clickReporter, false);
                    function clickReporter(e){
                        if(mouseClicked == false)
                            mouseClicked = true;
                    }
                    //Loop
                    
                
                    //Background
                    let background = new Image();
                    background.onload = function(){
                        scaleToFill(this);
                    }
                    background.src = require("./oceanImage.png");
                
                    //fish objects
                    const fish1 = 
                    {
                        correctAnswer: false, 
                        x: 0, 
                        y: 0, 
                        response: ""
                    };
                
                    const fish2 = 
                    {
                        correctAnswer: false, 
                        x: 0, 
                        y: 0, 
                        response: ""
                    };
                
                    const fish3 = 
                    {
                        correctAnswer: false, 
                        x: 0, 
                        y: 0, 
                        response: ""
                    };
                
                    const fish4 = 
                    {
                        correctAnswer: false, 
                        x: 0, 
                        y: 0, 
                        response: ""
                    };        
                    const questionList = shuffleArray(Object.keys(questions));
                    //console.log(questions[questionList[0]][answerList[0]]);
                    populateObjects(fish1, fish2, fish3, fish4);
                    function populateObjects(fish1, fish2, fish3, fish4){
                        if(questionList[0]){
                            console.log("What's with the twitching?")
                            let answerList = shuffleArray(Object.keys(questions[questionList[0]]));
                            //console.log(answerList);
                            fish1.correctAnswer = questions[questionList[0]][answerList[0]];
                            fish1.response = answerList[0];
                            fish1.x = canvas.width/2;
                            fish1.y = canvas.height/2 + 200;
                            fish2.correctAnswer = questions[questionList[0]][answerList[1]];
                            fish2.response = answerList[1];
                            fish2.x = canvas.width/4;
                            fish2.y = canvas.width/4 + 100;
                            fish3.correctAnswer = questions[questionList[0]][answerList[2]];
                            fish3.response = answerList[2];
                            fish3.x = canvas.width/4.3;
                            fish3.y = canvas.height/2.5 + 100;
                            fish4.correctAnswer = questions[questionList[0]][answerList[3]];
                            fish4.response = answerList[3];
                            fish4.x = canvas.width/1.25;
                            fish4.y = canvas.height/1.5 + 150;
                        }
                    }
                
                    //dimensions
                    let width = 300;
                    let height = 50;
                    let height2 = 100;
                    //Rod location
                    let rodX = canvas.width/3;
                    let rodStartY = 0;
                    let rodEndY = 10;
                
                    //Images
                    let hook = new Image();
                    hook.onload = function(){
                        ctx.drawImage(hook, canvas.width/3 - 50, 10);
                    }
                    hook.src = require("./hookImage2.png");
                    let fish1Image = new Image();
                    fish1Image.onload = function(){
                        ctx.drawImage(fish1Image, fish1.x - 50, fish1.y- 40);
                        ctx.drawImage(fish1Image, fish2.x - 50, fish2.y- 40);
                    }
                    fish1Image.src = require("./fish1.png");
                    let fish2Image = new Image();
                    fish2Image.onload = function(){
                        ctx.drawImage(fish2Image, fish3.x, fish3.y);
                        ctx.drawImage(fish2Image, fish4.x, fish4.y);
                    }
                    fish2Image.src = require("./fish3.png");
                    //Velocity
                    const fishVelocity = 2;
                    let lineVelocity = 10;
                    const timer = setInterval(fishLoop, 20);
                    function fishLoop() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        scaleToFill(background);
                        ctx.font = "bolder 60px Arial";
                        ctx.fillStyle = "rgba(0, 0, 0, "+0.3+")"
                        ctx.fillText(questionList[0], canvas.width/3, canvas.height/5)
                        ctx.fillText("Click to Fish!!", canvas.width/3, canvas.height/3)
                        if(!mouseClicked) ctx.drawImage(hook, canvas.width/3 - 50, 10);
                
                        fish1.x = (fish1.x + fishVelocity > canvas.width)? 0 - width : fish1.x + fishVelocity;
                        fish2.x = (fish2.x + fishVelocity > canvas.width)? 0 - width : fish2.x + fishVelocity;
                        fish3.x = (fish3.x - fishVelocity < 0 - width)? canvas.width : fish3.x - fishVelocity;
                        fish4.x = (fish4.x - fishVelocity < 0 - width)? canvas.width : fish4.x - fishVelocity;  
                        //display fish1:
                        createRect(fish1.x, fish1.y, width, height);
                        ctx.drawImage(fish1Image, fish1.x - 50, fish1.y - 40);
                        ctx.fillStyle = "rgba(0, 0, 0, "+0.8+")"
                        ctx.fillText(fish1.response, fish1.x + 150, fish1.y + 50);
                
                        //display fish2:
                        createRect(fish2.x, fish2.y, width, height);
                        ctx.drawImage(fish1Image, fish2.x - 50, fish2.y - 40);
                        ctx.fillText(fish2.response, fish2.x + 150, fish2.y + 50);
                
                        //display fish3:
                        createRect(fish3.x , fish3.y, width, height2);
                        ctx.drawImage(fish2Image, fish3.x , fish3.y - 40);
                        ctx.fillStyle = "rgba(255, 255, 255, "+0.8+")"
                        ctx.fillText(fish3.response, fish3.x + 100, fish3.y + 70);
                
                        //display fish4:
                        createRect(fish4.x , fish4.y, width, height2);
                        ctx.drawImage(fish2Image, fish4.x, fish4.y - 40 );
                        ctx.fillText(fish4.response, fish4.x + 100, fish4.y + 70);
                
                        //Start fishing and check collision
                        if (mouseClicked)
                        {
                            if(rodEndY + lineVelocity < 0) {
                                mouseClicked = false; 
                                lineVelocity = -1*lineVelocity;
                            }
                            if(rodEndY + lineVelocity > canvas.height)
                            {
                                lineVelocity = -1*lineVelocity;
                            }
                            createLine(rodX, rodStartY, rodEndY += lineVelocity);
                            createRect(rodX - 25, rodEndY, 50, 50);
                
                            if(checkIntersect(rodX - 25, rodX + 25, rodEndY, rodEndY+50, fish1.x, fish1.x+width, fish1.y, fish1.y+height))
                            {
                                if(fish1.correctAnswer == true)
                                {
                                    questionList.shift();
                                    console.log(questionList);
                                }
                                rodEndY = 10;
                                mouseClicked = false;
                                populateObjects(fish1, fish2, fish3, fish4)
                            }
                            if(checkIntersect(rodX - 25, rodX + 25, rodEndY, rodEndY+50, fish2.x, fish2.x+width, fish2.y, fish2.y+height))
                            {
                                if(fish2.correctAnswer == true)
                                {
                                    questionList.shift();
                
                                }
                                rodEndY = 10;
                                mouseClicked = false;
                                populateObjects(fish1, fish2, fish3, fish4);
                            }
                            if(checkIntersect(rodX - 25, rodX + 25, rodEndY, rodEndY+50, fish3.x, fish3.x+width, fish3.y, fish3.y+height2))
                            {
                                if(fish3.correctAnswer == true)
                                {
                                    questionList.shift();
                
                                }
                                rodEndY = 10;
                                mouseClicked = false;
                                populateObjects(fish1, fish2, fish3, fish4);
                            }
                            if(checkIntersect(rodX - 25, rodX + 25, rodEndY, rodEndY+50, fish4.x, fish4.x+width, fish4.y, fish4.y+height2))
                            {
                                
                                if(fish4.correctAnswer == true)
                                {
                                    questionList.shift();
                
                                }
                                rodEndY = 10;
                                mouseClicked = false;
                                populateObjects(fish1, fish2, fish3, fish4);
                
                            }
                
                            ctx.drawImage(hook, rodX - 35, rodEndY);
                        }
                    }
                    function createLine(rodX, rodStartY, rodEndY)
                    {
                        ctx.beginPath();
                        ctx.moveTo(rodX, rodStartY);
                        ctx.lineTo(rodX, rodEndY);
                        ctx.lineWidth = 5;
                        ctx.stroke();
                        
                    }
                    function checkIntersect(r1x1 , r1x2, r1y1, r1y2, r2x1, r2x2, r2y1, r2y2)
                    {
                        //overlaps if the below statement is true;
                        return r1x1 < r2x2 && r1x2 > r2x1 && r1y1 < r2y2 && r1y2 > r2y1; 
                    }
                    function createRect(x, y, width, height)
                    {
                        ctx.beginPath();
                        ctx.rect(x, y, width, height);
                
                    }
                    function scaleToFill(img){
                        // get the scale
                        let scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                        // get the top left position of the image
                        let x = (canvas.width / 2) - (img.width / 2) * scale;
                        let y = (canvas.height / 2) - (img.height / 2) * scale;
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale + 100);
                    }
                    function shuffleArray(arr) {
                       return arr.sort((a, b) => 0.5 - Math.random());
                    }
                    function sleep(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }
         
                })
            }).catch()
    }, []);

    return(<canvas id = "canvas"></canvas>)
}