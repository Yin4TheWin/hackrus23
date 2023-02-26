import '../styles/profile.css';
import { Auth, signOut, User } from "firebase/auth"
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useState } from 'react';

interface ProfileProps{
    user: User | null
    auth: Auth
}

export default function TeacherView({auth, user}:ProfileProps) {
  const [radioValue, setRadioValue] = useState('1');
  return (
    <div className="background-image">
        <div className="profile-header">
            <h1>Welcome back, {user?.displayName?.substring(0,user?.displayName?.lastIndexOf(" "))} 🍎</h1>
            <div>

            </div>
            <ButtonGroup>
                <ToggleButton
                key={1}
                id={`radio-1`}
                type="radio"
                variant="secondary"
                name="radio"
                value={'1'}
                checked={radioValue === '1'}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                My Classes
              </ToggleButton>
              <ToggleButton
              key={2}
              id={`radio-2`}
              type="radio"
              variant="secondary"
              name="radio"
              value={'2'}
              checked={radioValue === '2'}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              My Quizzes
            </ToggleButton>
          </ButtonGroup>
            
            <Button onClick={()=>{
                signOut(auth).then(()=>{
                    window.location.reload()})
            }}>Sign Out</Button>
        </div>
    </div>
  );
}