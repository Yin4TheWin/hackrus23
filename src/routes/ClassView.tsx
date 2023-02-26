import '../styles/profile.css'

import { onValue, ref, getDatabase, update, get } from "firebase/database"
import { SetStateAction, useEffect, useState } from "react"
import { Button, Col, Form, Row, Table } from "react-bootstrap"
import { Link, useLoaderData, useParams } from "react-router-dom"
import { firebase } from "../firebase"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' 
import ModalPopup from '../components/Modal'

interface DatabaseUpdates{
    [index: string]: any
}

export default function ClassView(){
    const {username, classId} = useParams()
    const classRef='users/'+username+'/class/'+classId
    const initialVal = useLoaderData()

    const [newStudent, setNewStudent] = useState("")
    const [assignments, setAssignments] = useState(null as {}|null)

    const [students, setStudents] = useState(initialVal as {}|null)
    const [canAccess, setCanAccess] = useState(false)
    const [selectedListItem, setSelectedListItem] = useState({state: "", val: ""})

    const [showModal, setShowModal] = useState(false)
    const [modalText, setModalText] = useState("")
    const [modalHeader, setModalHeader] = useState("")

    const [quizzes, setQuizzes] = useState(["Please select a quiz to assign"])
    const [selectedQuiz, setSelectedQuiz] = useState(null as String|null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [db] = useState(getDatabase(firebase))

    function generateModal(header: SetStateAction<string>, body: SetStateAction<string>){
        setModalHeader(header)
        setModalText(body)
        setShowModal(true)
    }

    useEffect(()=>{
        if(selectedListItem.state.includes("delete")){
            setShowDeleteModal(true)
        }
      }, [selectedListItem])

    useEffect(()=>{
        onValue(ref(db, classRef), (snapshot)=>{
            if(snapshot.exists()){
                setCanAccess(true)
                setStudents(snapshot.val().students)
                setAssignments(snapshot.val().assignments)
             } else{
                setStudents(null)
             }
        })
        get(ref(db, 'users/'+username+'/quiz')).then((snapshot)=>{
            if(snapshot.exists()){
                let quizArr=Object.keys(snapshot.val())
                setQuizzes(quizArr)
                setSelectedQuiz(quizArr[0])
            }
        })
    }, [db, classRef])
    
    return (
    <div className="background-image">
    {
        !canAccess?
        <div className="profile-header">
            <h1>Sorry 😢</h1>
            <p>Either the page you are looking for does not exist, or you are not allowed to view it.</p>
            <p className="mini">(If you believe this is a mistake, please ensure you are signed in to the right account, then come back to this page.)</p>
        </div>:
        <div className="profile-header">
        <ModalPopup showModal={showDeleteModal} 
        toggleModal={()=>{setShowDeleteModal(!showDeleteModal)}}
        header={"Confirm Deletion"}
        body={"Are you sure you want to delete \""+selectedListItem.val.replaceAll("%2E",".")+"\"? This action cannot be undone!"}
        footer={
            <>
                <Button onClick={()=>{
                    let path=""
                    if(selectedListItem.state.includes("Quiz"))
                        path='users/'+username+'/class/'+classId+'/assignments/'+selectedListItem.val
                    else
                        path='users/'+username+'/class/'+classId+'/students/'+selectedListItem.val
                    const updates: DatabaseUpdates={}
                    updates[path]={}
                    update(ref(db), updates).then(()=>{
                        setShowDeleteModal(!showDeleteModal)
                    })
                }}>YES I AM SURE</Button>
                <Button variant="danger" onClick={()=>{setShowDeleteModal(!showDeleteModal)}}>NO</Button>
            </>
        }
        />
        <ModalPopup showModal={showModal} 
        toggleModal={()=>{setShowModal(!showModal)}}
        header={modalHeader}
        body={modalText}
        footer={
            <Button variant="primary" onClick={()=>{setShowModal(!showModal)}}>OK</Button>
        }
        />
        <h1>
            {classId}
        </h1>
        <p className="mini">
            Now in Class Editing Mode (<Link to="/teacher" style={{ color: 'black'}} >Back to Dashboard</Link>)
        </p>
        <Form onSubmit={(e)=>{
        e.preventDefault()
        if(newStudent.length>0){
            if(students==null || !(newStudent in students)){
                get(ref(db, "uids/"+newStudent.replaceAll(".","%2E"))).then(snapshot=>{
                    if(snapshot.exists()){
                        console.log(snapshot.val())
                        const updates: DatabaseUpdates={}
                        updates['users/'+username+'/class/'+classId+'/students/'+newStudent.replaceAll(".","%2E")]=Date.now()
                        updates['users/'+snapshot.val()+'/classes/'+classId] = username
                        update(ref(db), updates).then(()=>{
                            setNewStudent("")
                            generateModal("Student was Added", newStudent+" was successfully added to your class!")
                        }).catch(err=>{
                            generateModal("Something Went Wrong", err.message)
                        })
                    } else{
                        generateModal("Student Doesn't Exist", "Please ensure you typed the right email and the student has an account!")
                    }
                }).catch(err=>{
                    alert(err.message)
                })
            } else{
                generateModal("Student Already Added", "You've already added that student to this !'")
            }
        } else
            generateModal("Invalid Form","Please enter a valid student email!")
    }}>
        <Row>
            <Col xs={8} md={10}>
                <Form.Control type="text" placeholder="New student email" size='lg' value={newStudent} onChange={(e)=>{
                    setNewStudent(e.target.value)
                }}/>
            </Col>
            <Col xs={4} md={2}>
                <Button variant='success' type='submit' size='lg' style={{width: '100%'}}>Create</Button>
            </Col>
        </Row>
    </Form>
    <Table style={{marginTop: '1%'}} striped hover responsive="sm" size="sm">
      <thead>
        <tr>
          <th style={{width: students==null?'100%':'95%'}}>My Students</th>
          <th/>
          <th/>
        </tr>
      </thead>
      <tbody>
        {
            students?Object.entries(students).map(list=>{
                let key=list[0]
                return (<tr key={Math.random()*1000}>
                    <td>
                        {key.replaceAll("%2E", ".")}
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
    <h3 style={{marginTop: '2%'}}>Assignments</h3>
    <Form onSubmit={(e)=>{
        e.preventDefault()
        if(selectedQuiz!=null){
            const updates: DatabaseUpdates={}
            updates['users/'+username+'/class/'+classId+'/assignments/'+selectedQuiz]=Date.now()
            update(ref(db), updates).then(()=>{
                generateModal("Assignment Created", selectedQuiz+" was successfully assigned to your class!")
            }).catch(err=>{
            generateModal("Something Went Wrong", err.message)
            })
        } else
            generateModal("No Quiz Selected","Please select a quiz first!")
    }}>
        <Row>
            <Col xs={8} md={10}>
            <Form.Select onChange={(e)=>{
                setSelectedQuiz(e.target.value)
            }} aria-label="Please choose a quiz">
                {
                    quizzes.map((el,index)=>{
                        return (<option value={el}>{el}</option>)
                    })
                }
            </Form.Select>
            </Col>
            <Col xs={4} md={2}>
                <Button variant='warning' type='submit' size='lg' style={{width: '100%'}}>Assign</Button>
            </Col>
        </Row>
    </Form>
    <Table style={{marginTop: '1%'}} striped hover responsive="sm" size="sm">
      <thead>
        <tr>
          <th style={{width: students==null?'100%':'95%'}}>My Assignments</th>
          <th/>
          <th/>
        </tr>
      </thead>
      <tbody>
        {
            assignments?Object.entries(assignments).map(list=>{
                let key=list[0]
                return (<tr key={Math.random()*1000}>
                    <td>
                        {key.replaceAll("%2E", ".")}
                    </td>
                    <td>
                        <Button variant='secondary' className='edit' onClick={()=>{
                            setSelectedListItem({state: "deleteQuiz", val: key})
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
    }
    </div>)
}