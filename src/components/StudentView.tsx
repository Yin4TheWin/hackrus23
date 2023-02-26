import '../styles/profile.css';
import { Auth, signOut, User } from "firebase/auth"
import { Button } from 'react-bootstrap';

interface ProfileProps{
    user: User | null
    auth: Auth
}

export default function StudentView({auth, user}:ProfileProps) {
  return (
    <div className="background-image">
        <div className="profile-header">
            <h1>Welcome back, {user?.displayName?.substring(0,user?.displayName?.lastIndexOf(" "))} 🧑‍🎓</h1>
            <Button onClick={()=>{
                signOut(auth).then(()=>{
                    window.location.reload()})
            }}>Sign Out</Button>
        </div>
    </div>
  );
}