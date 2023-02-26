import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import Root from './App'
import Login from './routes/Login'
import FishingGame from './routes/FishingGame';
import reportWebVitals from './reportWebVitals';
import QuizView from './routes/QuizView';
import ClassView from './routes/ClassView';
import BallsGame from './routes/BallsGame';
import {firebase} from './firebase'
import { getDatabase, ref, get } from "firebase/database";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  }, {
    path: "/teacher",
    element: <Login/>,
    loader: async () => {
      return "Teacher";
    },
  }, {
    path: "/student",
    element: <Login/>,
    loader: async () => {
      return "Student";
    },
  }, {
    path: ":username/quiz/:quizId",
    element: <QuizView/>,
    loader: async ({params})=>{
      const db = getDatabase(firebase);
      const username=params.username?params.username.toLowerCase():"null"
      const quizId=params.quizId?params.quizId.toLowerCase():"null"
      const snapshot = await get(ref(db, 'users/'+username+'/quiz/'+quizId+'/questions')).then(s=>{
        return s.exists()?s.val():null
      }).catch(()=>{return null})
      return snapshot
    }
  }, {
    path: ":username/class/:classId",
    element: <ClassView/>,
    loader: async ({params})=>{
      const db = getDatabase(firebase);
      const username=params.username?params.username.toLowerCase():"null"
      const quizId=params.quizId?params.quizId.toLowerCase():"null"
      const snapshot = await get(ref(db, 'users/'+username+'/quiz/'+quizId+'/questions')).then(s=>{
        return s.exists()?s.val():null
      }).catch(()=>{return null})
      return snapshot
    }
  }, {
    path: "play/fishing/:username/:class/:quizId",
    element: <FishingGame/>
  }, {
    path: "play/broccoli/:username/:class/:quizId",
    element: <BallsGame/>
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();