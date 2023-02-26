import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import './App.css';

const Roll = require('react-reveal/Roll');
const LightSpeed = require('react-reveal/LightSpeed');

function App() {
  const [userType, setUserType] = useState("")
  return (
    <div className="App">
      <div className='App-header'>
        <Roll>
            <h1>Project Name</h1>
          </Roll>
          <LightSpeed>
          <p>
            Gamify homework or in-class assignments and encourage students to learn in a competitve but friendly environment.
          </p>
          </LightSpeed>
          <p>I am a...</p>
          <Form onSubmit={(e)=>{
            e.preventDefault()
            window.location.href="/"+userType
          }}>
          <div className="radio-form">
            <Form.Check 
              type='radio'
              id='teacher'
              name="group1"
              label='Teacher'
              onChange={()=>{
                setUserType('teacher')
              }}
              checked={userType==='teacher'}
              style={{marginRight:'2%'}}
            />
            <Form.Check 
              type='radio'
              id='student'
              name="group1"
              label='Student'
              onChange={()=>{
                setUserType('student')
              }}
              checked={userType==='student'}
              style={{marginLeft:'2%'}}
            />
          </div>
          <Button type="submit" style={{marginTop: '2%'}} size='lg'>Continue</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
