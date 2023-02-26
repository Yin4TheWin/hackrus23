//@ts-nocheck
import { get, ref, getDatabase } from "firebase/database";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { firebase } from "../firebase";

import "./stylesSoccer.css";
export default function SuperSoccer() {
  const db = getDatabase(firebase);
  const location = useLocation().pathname.split("/");
  const uid = location[3];
  const className = decodeURI(location[4]);
  const quizName = decodeURI(location[5]);

  useEffect(() => {
    get(ref(db, "users/" + uid + "/classes/" + className)).then(
      (teacherUID) => {
        get(
          ref(
            db,
            "users/" + teacherUID.val() + "/quiz/" + quizName + "/questions"
          )
        ).then((questionRef) => {
          let question = {};
          if (questionRef.exists()) {
            question = questionRef.val();
          }
          const q1 = {
            answer: false,
            response: "",
            x: 0,
            y: 0,
          };

          const q2 = {
            answer: false,
            response: "",
            x: 0,
            y: 0,
          };

          const q3 = {
            answer: false,
            response: "",
            x: 0,
            y: 0,
          };

          const q4 = {
            answer: false,
            response: "",
            x: 0,
            y: 0,
          };

          const ball = {
            x: 0,
            y: 0,
          };
          const canvas = document.getElementById("QTE");
          const context = canvas.getContext("2d");
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          let ballImg = new Image();
          ballImg.src = require("./ball.png");
          let ballY = canvas.height / 2; // Initial y position
          ballImg.onload = function () {
            context.drawImage(ballImg, ballX, ballY, 100, 100);
          };
          function moveBall(event) {
            animateBall();
          }
          function animateBall() {
            requestAnimationFrame(function () {
              ballY -= 1; // Move up by 10 pixels
              goalAnimate();
              if (ballY > 300) {
                animateBall();
              }
              // context.clearRect(0, 0, canvas.width, canvas.height);
            });
          }
          function goalAnimate() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(ballImg, canvas.width / 2 - 50, ballY, 100, 100);
          }

          let ballX = canvas.width / 2 - 50; // Initial x-coordinate of the ball

          function moveBallX(event) {
            animateBallX();
          }

          function animateBallX() {
            requestAnimationFrame(function () {
              ballX += 10; // move right by 10 pixels
              goalAnimateX();
              if (ballX < canvas.width - 150) {
                animateBallX();
              }
            });
          }

          function goalAnimateX() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(ballImg, ballX, ballY, 100, 100);
          }

          function moveBallXLeft(event) {
            animateBallXLeft();
          }

          function animateBallXLeft() {
            requestAnimationFrame(function () {
              ballX -= 10; //  move right by 10 pixels
              goalAnimateXLeft();
              if (ballX > 0) {
                // stop animation at certain X position
                animateBallXLeft();
              }
            });
          }

          function goalAnimateXLeft() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(ballImg, ballX, ballY, 100, 100);
          }

          let lineAngle = Math.PI / 2;
          let lineDirection = 1;
          let lineRadius = 267;
          let endX = 0;
          let endY = 0;
          let qOneY = 0;
          let qThreeY = 0;
          let stopLine = false;

          const questionList = shuffleArrary(Object.keys(question));
          populateObj(q1, q2, q3, q4);
          function populateObj(q1, q2, q3, q4) {
            if (questionList[0]) {
              let answerList = shuffleArrary(
                Object.keys(question[questionList[0]])
              );
              q1.answer = question[questionList[0]][answerList[0]];
              q1.response = answerList[0];

              q2.answer = question[questionList[0]][answerList[1]];
              q2.response = answerList[1];

              q3.answer = question[questionList[0]][answerList[2]];
              q3.response = answerList[2];

              q4.answer = question[questionList[0]][answerList[3]];
              q4.response = answerList[3];
              stopLine = false;
              ballY = canvas.height / 2;
              ballX = canvas.width / 2 - 50;
            } else {
              context.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
          animate();
          function shuffleArrary(arr) {
            return arr.sort((a, b) => 0.5 - Math.random());
          }
          function movingLines() {
            let semicircleRadius = 267;
            let semicircleCenterX = canvas.width / 2;
            let semicircleCenterY = (canvas.height * 6) / 7;

            if (!stopLine) {
              // calculate the end point of the line
              let lineX = semicircleCenterX + lineRadius * Math.cos(lineAngle);
              let lineY = semicircleCenterY - lineRadius * Math.sin(lineAngle);
              endX = lineX;
              endY = lineY;

              // ensure that the end point of the line is within the red semicircle
              let dx = lineX - semicircleCenterX;
              let dy = lineY - semicircleCenterY;
              let distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > semicircleRadius) {
                let angle = Math.atan2(dy, dx);
                lineX = semicircleCenterX + semicircleRadius * Math.cos(angle);
                lineY = semicircleCenterY + semicircleRadius * Math.sin(angle);
              }

              // draw the line
              context.beginPath();
              context.moveTo(semicircleCenterX, semicircleCenterY);
              context.lineTo(lineX, lineY);
              context.stroke();

              // update the line angle and direction
              lineAngle += (lineDirection * Math.PI) / 180;
              if (lineAngle >= Math.PI || lineAngle <= 0) {
                lineDirection *= -1;
              }
            } else {
              // calculate the end point of the paused line
              let pausedLineX =
                semicircleCenterX + pausedRadius * Math.cos(lineAngle);
              let pausedLineY =
                semicircleCenterY - pausedRadius * Math.sin(lineAngle);

              // ensure that the end point of the paused line is within the red semicircle
              let dx = pausedLineX - semicircleCenterX;
              let dy = pausedLineY - semicircleCenterY;
              let distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > semicircleRadius) {
                let angle = Math.atan2(dy, dx);
                pausedLineX =
                  semicircleCenterX + semicircleRadius * Math.cos(angle);
                pausedLineY =
                  semicircleCenterY + semicircleRadius * Math.sin(angle);
              }

              // draw the paused line
              context.beginPath();
              context.moveTo(semicircleCenterX, semicircleCenterY);
              context.lineTo(pausedLineX, pausedLineY);
              context.stroke();
            }
          }

          function drawLayout() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(
              canvas.width / 2,
              (canvas.height * 6) / 7,
              267,
              Math.PI,
              2 * Math.PI
            );
            context.closePath();
            context.lineWidth = 9;
            context.fillStyle = "red";
            context.fill();

            context.beginPath(); //first check point
            context.moveTo(canvas.width / 2, (canvas.height * 6) / 7);
            context.lineTo(
              canvas.width / 2 - 267 * Math.cos(Math.PI / 4),
              (canvas.height * 6) / 7 - 267 * Math.sin(Math.PI / 4)
            );

            context.stroke();
            // qOneX = canvas.width / 2 - 267 * Math.cos(Math.PI / 4);
            qOneY = (canvas.height * 6) / 7 - 267 * Math.sin(Math.PI / 4);
            context.beginPath(); //second check point
            context.moveTo(canvas.width / 2, (canvas.height * 6) / 7);
            context.lineTo(canvas.width / 2, (canvas.height * 6) / 7 - 267);
            context.stroke();
            //qTwoX = canvas.width / 2;
            context.beginPath(); //third check point
            context.moveTo(canvas.width / 2, (canvas.height * 6) / 7);
            context.lineTo(
              canvas.width / 2 + 267 * Math.cos(Math.PI / 4),
              (canvas.height * 6) / 7 - 267 * Math.sin(Math.PI / 4)
            );
            context.stroke();
            qThreeY = (canvas.height * 6) / 7 - (267 * Math.sqrt(2)) / 2;
            context.stroke();
            context.beginPath();
            context.arc(
              canvas.width / 2,
              (canvas.height * 6) / 7,
              133.5,
              Math.PI,
              2 * Math.PI
            );
            context.closePath();
            context.lineWidth = 5;
            context.fillStyle = "white";
            context.fill();

            context.drawImage(
              ballImg,
              canvas.width / 2 - 50,
              canvas.height / 2,
              100,
              100
            );

            context.fillStyle = "white";
            context.font = "bold 30px Arial";
            context.fillText(q1.response, canvas.width / 2 - 200, 650);
            context.fillText(q2.response, canvas.width / 2 - 100, 600);
            context.fillText(q3.response, canvas.width / 2 + 70, 590);
            context.fillText(q4.response, canvas.width / 2 + 150, 670);
          }
          function animate() {
            drawLayout();
            movingLines();
            requestAnimationFrame(animate);

            context.fillStyle = "red";
            context.font = "bold 50px Arial";
            context.fillText(
              questionList[0],
              canvas.width / 2 - 170,
              canvas.height / 5 - 50
            );
          }

          document.addEventListener("keyup", (event) => {
            if (event.key == "ArrowUp") {
              console.log(endY + " " + qOneY);
              if (endX < canvas.width / 2 && endY > qOneY) {
                if (q1.answer == true) {
                  moveBall();
                  alert("You got it!");
                  questionList.shift();
                  populateObj(q1, q2, q3, q4);
                  context.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                  moveBallXLeft();
                  alert("Wrong!");
                  populateObj(q1, q2, q3, q4);
                }
                populateObj(q1, q2, q3, q4);
              } else if (endX < canvas.width / 2 && endY < qOneY) {
                if (q2.answer == true) {
                  moveBall();
                  alert("You got it!");

                  questionList.shift();
                  populateObj(q1, q2, q3, q4);
                  context.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                  moveBallXLeft();
                  alert("Wrong!");
                  populateObj(q1, q2, q3, q4);
                }
              } else if (endX > canvas.width / 2 && endY > qThreeY) {
                if (q4.answer == true) {
                  moveBall();
                  alert("You got it!");
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  questionList.shift();
                  populateObj(q1, q2, q3, q4);
                } else {
                  moveBallX();
                  alert("Wrong!");
                  populateObj(q1, q2, q3, q4);
                }
              } else {
                if (q3.answer == true) {
                  moveBall();

                  alert("You got it!");
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  questionList.shift();
                  populateObj(q1, q2, q3, q4);
                } else {
                  moveBallX();
                  alert("Wrong!");
                  populateObj(q1, q2, q3, q4);
                }
              }
            }
          });
        });
      }
    );
  }, []);
  return (
    <div className="soccer-bg">
      <h1 className="soccer-text">Welcome to SUPER SOCCER!</h1>
      <h2 className="soccer-text">
        hit the "up-key" when the arrow land on the right answer
      </h2>
      <canvas id="QTE"></canvas>
    </div>
  );
}
