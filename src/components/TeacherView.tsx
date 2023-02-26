import '../styles/profile.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import ModalPopup from "./Modal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' 

import { Auth, signOut, User } from "firebase/auth"
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { SetStateAction, useEffect, useState } from 'react';
import {firebase} from '../firebase'

import { ref, onValue, update, get, Database, getDatabase } from "firebase/database";
import { Link } from 'react-router-dom';

interface ProfileProps{
    user: User | null
    auth: Auth
}

interface DatabaseUpdates{
  [index: string]: any
}

export default function TeacherView({auth, user}:ProfileProps) {
  const db=getDatabase(firebase)
  const myName=user?.displayName?.substring(0,user?.displayName?.lastIndexOf(" "))

  const [newData, setNewData] = useState("")

  const [radioValue, setRadioValue] = useState('class');
  const [userData, setUserData] = useState(null)
  const [selectedListItem, setSelectedListItem] = useState({state: "", val: ""})

  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState("")
  const [modalHeader, setModalHeader] = useState("")

  const [userRef]= useState(ref(db, 'users/'+user?.uid))
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const getPlural=(name: String)=>{
    if(name.toLowerCase()==='quiz')
      return name+'zes'
    return name+'es'
  }

  useEffect(()=>{
    onValue(userRef, (snapshot)=>{
        if(snapshot.exists()){
            setUserData(snapshot.val())
         } else{
            setUserData(null)
         }
    })
}, [userRef])

useEffect(()=>{
  if(selectedListItem.state==="delete"){
      setShowDeleteModal(true)
  }
}, [selectedListItem])

function generateModal(header: SetStateAction<string>, body: SetStateAction<string>){
  setModalHeader(header)
  setModalText(body)
  setShowModal(true)
}
  return (
    <div className="background-image">
        <div className="profile-header">
          <ModalPopup showModal={showModal} 
          toggleModal={()=>{setShowModal(!showModal)}}
          header={modalHeader}
          body={modalText}
          footer={
              <Button variant="primary" onClick={()=>{setShowModal(!showModal)}}>OK</Button>
          }
          />
          <ModalPopup showModal={showDeleteModal} 
            toggleModal={()=>{setShowDeleteModal(!showDeleteModal)}}
            header={"Confirm Deletion"}
            body={"Are you sure you want to delete \""+selectedListItem.val+"\"? This action cannot be undone!"}
            footer={
                <>
                    <Button onClick={()=>{
                        const updates: DatabaseUpdates={}
                        updates['users/'+user?.uid+'/'+radioValue+'/'+selectedListItem.val]={}
                        update(ref(db), updates).then(()=>{
                            setShowDeleteModal(!showDeleteModal)
                        })
                    }}>YES I AM SURE</Button>
                    <Button variant="danger" onClick={()=>{setShowDeleteModal(!showDeleteModal)}}>NO</Button>
                </>
            }
            />
            <h1>Welcome back, {myName} 🍎</h1>
            <div className='menu-buttons'>
            <ButtonGroup>
                <ToggleButton
                key={1}
                id={`radio-1`}
                type="radio"
                variant="secondary"
                name="radio"
                value={'class'}
                checked={radioValue === 'class'}
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
              value={'quiz'}
              checked={radioValue === 'quiz'}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              My Quizzes
            </ToggleButton>
          </ButtonGroup>
            
            <Button variant='danger' onClick={()=>{
                signOut(auth).then(()=>{
                    window.location.reload()})
            }}>Sign Out</Button>
            </div>
            <div>
              <Form onSubmit={(e)=>{
                e.preventDefault()
                if(newData.length>0){
                  if(userData==null || userData[radioValue]==null || !(newData in userData[radioValue])){
                      const updates: DatabaseUpdates={}
                      updates['users/'+user?.uid+'/'+radioValue+'/'+newData]={created: Date.now()}
                      update(ref(db), updates).then(()=>{
                          setNewData("")
                          generateModal(radioValue.charAt(0).toUpperCase() + radioValue.slice(1)+" Was Created", newData+" was successfully created!")
                      }).catch(err=>{
                          generateModal("Something Went Wrong", err.message)
                      })
                  } else{
                      generateModal(radioValue.charAt(0).toUpperCase() + radioValue.slice(1)+" Already Exists", "You already made a "+radioValue+" with that name!")
                  }
                } else
                  generateModal("No "+radioValue.charAt(0).toUpperCase() + radioValue.slice(1)+" Name","Please enter a new "+radioValue+" name to create it!")
              }}>
                <Row>
                    <Col xs={8} md={10}>
                        <Form.Control type="text" placeholder={"New "+radioValue+" name"} size='lg' value={newData} onChange={(e)=>{
                            setNewData(e.target.value)
                        }}/>
                    </Col>
                    <Col xs={4} md={2}>
                        <Button type='submit' size='lg' style={{width: '100%'}}>Create</Button>
                    </Col>
                  </Row>
              </Form>
            </div>
            <Table style={{marginTop: '1%'}} striped hover responsive="sm" size="sm">
              <thead>
                <tr>
                  <th style={{width: '95%'}}>My {getPlural(radioValue.charAt(0).toUpperCase() + radioValue.slice(1))}</th>
                  <th/>
                </tr>
              </thead>
              <tbody>
                {
                    !(userData==null||userData[radioValue]==null)?Object.entries(userData?userData[radioValue]:{}).map(list=>{
                        let key=list[0]
                        return (<tr>
                            <td>
                                <Link to={"/"+user?.uid+"/"+radioValue+"/"+key}>{key}</Link>
                            </td>
                            <td>
                                <Button variant='secondary' className='edit' onClick={()=>{
                                    setSelectedListItem({state: "delete", val: key})
                                }}>
                                <FontAwesomeIcon icon={solid('trash')} />
                                </Button>
                            </td>
                            </tr>)
                    }):
                    <tr>
                        <td>None yet!</td>
                    </tr>
                }
              </tbody>
            </Table>
        </div>
    </div>
  );
}