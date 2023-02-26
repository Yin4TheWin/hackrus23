import '../styles/profile.css';
import { Auth, signOut, User } from "firebase/auth"
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { get, getDatabase, onValue, ref } from 'firebase/database';

import {firebase} from '../firebase'
import ModalPopup from './Modal';

interface ProfileProps{
    user: User | null
    auth: Auth
}

interface AssignmentProps{
  assignmentName: String
  className: String
}

export default function StudentView({auth, user}:ProfileProps) {
  const db=getDatabase(firebase)
  const [userRef]= useState(ref(db, 'users/'+user?.uid+'/classes'))

  const [myClasses, setMyClasses] = useState(null as {}|null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedListItem, setSelectedListItem] = useState(null as AssignmentProps|null)
  const [gameMode, setGameMode] = useState("")

  const [myAssignments, setMyAssignments] = useState(null as {}|null)

  useEffect(()=>{
    onValue(userRef, async(classInfo)=>{
      const objs={}
      const promises=[]
        if(classInfo.exists()){
            setMyClasses(classInfo.val())
            for (const [className, professor] of Object.entries(classInfo.val())) {
              promises.push(get(ref(db, 'users/'+professor+'/class/'+className+'/assignments')).then(snapshot=>{
                if(snapshot.exists()){
                  Object.keys(snapshot.val()).forEach(assignment=>{
                    //@ts-ignore
                    objs[className]=objs[className]?[...objs[className], assignment]:[assignment]
                  })
                }
              }))
            }
            await Promise.all(promises)
            setMyAssignments(objs)
         } else{
            setMyClasses(null)
         }
    })
  }, [userRef])


  return (
    <div className="background-image">
        <div className="profile-header">
        <ModalPopup showModal={showCreateModal}
        toggleModal={() => { setShowCreateModal(!showCreateModal); } }
        header={<h2>Game Selection Screen</h2>}
        body={<>
            <p>Please choose a game to play and learn with!</p>
            <Form onSubmit={(e) => {
                e.preventDefault();
                if(gameMode!=="")
                  window.location.href="/play/"+gameMode+"/"+user?.uid+"/"+selectedListItem?.className+"/"+selectedListItem?.assignmentName
             }}>
              <Form.Check 
              type='radio'
              id='fish'
              name="group1"
              label='Epic Fishing'
              onChange={()=>{
                setGameMode('fishing')
              }}
            />
            <Form.Check 
              type='radio'
              id='catch'
              name="group1"
              label='Brocolli Quest'
              onChange={()=>{
                setGameMode('broccoli')
              }}
            />
            <Form.Check 
              type='radio'
              id='ball'
              name="group1"
              label='Super Soccer'
              onChange={()=>{
                setGameMode('soccer')
              }}
            />
               <Button style={{marginTop: '2%'}} variant="primary" type="submit">OK</Button>
            </Form>
        </>}/>
            <h1>Welcome back, {user?.displayName?.substring(0,user?.displayName?.lastIndexOf(" "))} 🧑‍🎓</h1>
            <Button onClick={()=>{
                signOut(auth).then(()=>{
                    window.location.reload()})
            }}>Sign Out</Button>
            <Table style={{marginTop: '1%'}} striped hover responsive="sm" size="sm">
              <thead>
                <tr>
                  <th style={{width: '100%'}}>My Assignments</th>
                  <th/>
                </tr>
              </thead>
              <tbody>
                {
                    myAssignments!==null?Object.entries(myAssignments).map(list=>{
                        let className=list[0]
                        let assignmentName=list[1] as String[]
                        return (assignmentName.map(assign=>{
                          return(<tr key={Math.random()*1000}>
                            <td>
                                <button className='link' onClick={()=>{
                                  setShowCreateModal(true)
                                  setSelectedListItem({className: className, assignmentName: assign})
                                }}>{assign}</button>
                            </td>
                            </tr>)
                        }))
                    }):
                    <tr>
                        <td>No assignments right now! :)</td>
                    </tr>
                }
              </tbody>
            </Table>
        </div>
    </div>
  );
}