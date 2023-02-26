import { onValue, ref, getDatabase, update, get } from "firebase/database"
import { SetStateAction, useEffect, useState } from "react"

import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap"
import { Link, useLoaderData, useParams } from "react-router-dom"
import { firebase } from "../firebase"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' 

import ModalPopup from "../components/Modal";

import '../styles/quizview.css'

interface DatabaseUpdates{
    [index: string]: any
}

export default function QuizView(){
    const {username, quizId} = useParams()

    const quizRef='users/'+username+'/quiz/'+quizId
    const initialVal = useLoaderData()

    const [quizQuestions, setQuizQuestions] = useState(initialVal as {}|null)
    const [canAccess, setCanAccess] = useState(false)
    const [db] = useState(getDatabase(firebase))

    const [selectedListItem, setSelectedListItem] = useState({state: "", val: ""})

    const [showModal, setShowModal] = useState(false);

    const [answer1, setAnswer1] = useState({val:true, name: ""})
    const [answer2, setAnswer2] = useState({val:false, name: ""})
    const [answer3, setAnswer3] = useState({val:false, name: ""})
    const [answer4, setAnswer4] = useState({val:false, name: ""})

    const [showEditModal, setShowEditModal] = useState(false)
    const [modalText, setModalText] = useState("")
    const [modalHeader, setModalHeader] = useState("")
    const [questionName, setQuestionName] = useState("")

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    function generateModal(header: SetStateAction<string>, body: SetStateAction<string>){
        setModalHeader(header)
        setModalText(body)
        setShowModal(true)
    }
    

    useEffect(()=>{
        onValue(ref(db, quizRef), (snapshot)=>{
            if(snapshot.exists()){
                setCanAccess(true)
                setQuizQuestions(snapshot.val().questions)
             } else{
                setQuizQuestions(null)
             }
        })
    }, [db, quizRef])

    useEffect(()=>{
        if(selectedListItem.state==="delete"){
            setShowDeleteModal(true)
        }
      }, [selectedListItem])
    
    return (
    <div className="background-image">
    {
        !canAccess?
        <div className="error-header">
            <h1>Sorry 😢</h1>
            <p>Either the page you are looking for does not exist, or you are not allowed to view it.</p>
            <p className="mini">(If you believe this is a mistake, please ensure you are signed in to the right account, then come back to this page.)</p>
        </div>:
        <div className="header">
            <ModalPopup showModal={showDeleteModal} 
            toggleModal={()=>{setShowDeleteModal(!showDeleteModal)}}
            header={"Confirm Deletion"}
            body={"Are you sure you want to delete \""+selectedListItem.val+"\"? This action cannot be undone!"}
            footer={
                <>
                    <Button onClick={()=>{
                        const updates: DatabaseUpdates={}
                        updates['users/'+username+'/quiz/'+quizId+'/questions/'+selectedListItem.val]={}
                        update(ref(db), updates).then(()=>{
                            setShowDeleteModal(!showDeleteModal)
                        })
                    }}>YES I AM SURE</Button>
                    <Button variant="danger" onClick={()=>{setShowDeleteModal(!showDeleteModal)}}>NO</Button>
                </>
            }
            />
            <ModalPopup showModal={showModal} toggleModal={()=>{setShowModal(!showModal)}}
             header={modalHeader} 
             body={<div>
                <p>{modalText}</p>
            </div>
            }
            footer={<div>
                <Button color="primary" onClick={()=>{setShowModal(!showModal)}}>OK</Button>
            </div>
            }/>
            <ModalPopup showModal={showEditModal}
        toggleModal={() => { setShowEditModal(!showEditModal); } }
        header={"Add New Quiz Question"}
        body={<>
            <p>Enter a question and four answer choices below, then select the correct answer:</p>
            <Form onSubmit={(e) => {
                e.preventDefault();
                if (questionName.length > 0 && answer1.name.length>0 && answer2.name.length>0 && answer3.name.length>0 && answer4.name.length>0) {
                    if (quizQuestions == null || !(questionName in quizQuestions)) {
                        const updates: DatabaseUpdates = {};
                        updates['users/' + username + '/quiz/' + quizId + '/questions/' + questionName + '/' + answer1.name] = answer1.val;
                        updates['users/' + username + '/quiz/' + quizId + '/questions/' + questionName + '/' + answer2.name] = answer2.val;
                        updates['users/' + username + '/quiz/' + quizId + '/questions/' + questionName + '/' + answer3.name] = answer3.val;
                        updates['users/' + username + '/quiz/' + quizId + '/questions/' + questionName + '/' + answer4.name] = answer4.val;

                        update(ref(db), updates).then(() => {
                            setShowEditModal(!showEditModal);
                        }).catch(err => {
                            console.log(err)
                           generateModal("Something Went Wrong", err.message);
                        });
                    } else {
                       generateModal("Question Already Exists", "A question like this already exists!");
                    }
                }
                else
                    generateModal("Question Not Found", "The question and answers cannot be blank!");
            } }>
                <Row>
                    <Col xs={10}>
                        <Form.Control type="text" placeholder="Enter question here" size='lg' value={questionName} onChange={(e) => {
                            setQuestionName(e.target.value);
                        } } />
                    </Col>
                    </Row>
                    <Row style={{marginTop: '2%'}}>
                    <Col xs={1}>
                        <Form.Check 
                        type='radio'
                        id='ans1'
                        name="group1"
                        onChange={(e)=>{
                            setAnswer1({val: true, name: answer1.name})
                            setAnswer2({val: false, name: answer2.name})
                            setAnswer3({val: false, name: answer3.name})
                            setAnswer4({val: false, name: answer4.name})
                        }}
                        defaultChecked
                        style={{marginRight:'2%'}}
                        />
                    </Col>
                    <Col xs={11}>
                    <Form.Control type="text" placeholder="Answer choice 1" size='sm' value={answer1.name} onChange={(e) => {
                            setAnswer1({name: e.target.value, val: answer1.val})
                        } } />
                    </Col>
                    </Row>
                    <Row style={{marginTop: '2%'}}>
                    <Col xs={1}>
                        <Form.Check 
                        type='radio'
                        id='ans2'
                        name="group1"
                        onChange={(e)=>{
                            setAnswer1({val: false, name: answer1.name})
                            setAnswer2({val: true, name: answer2.name})
                            setAnswer3({val: false, name: answer3.name})
                            setAnswer4({val: false, name: answer4.name})
                        }}
                        style={{marginRight:'2%'}}
                        />
                    </Col>
                    <Col xs={11}>
                    <Form.Control type="text" placeholder="Answer choice 2" size='sm' value={answer2.name} onChange={(e) => {
                            setAnswer2({name: e.target.value, val: answer2.val})
                        } } />
                    </Col>
                    </Row>
                    <Row style={{marginTop: '2%'}}>
                    <Col xs={1}>
                        <Form.Check 
                        type='radio'
                        id='ans3'
                        name="group1"
                        onChange={(e)=>{
                            setAnswer1({val: false, name: answer1.name})
                            setAnswer2({val: false, name: answer2.name})
                            setAnswer3({val: true, name: answer3.name})
                            setAnswer4({val: false, name: answer4.name})
                        }}
                        style={{marginRight:'2%'}}
                        />
                    </Col>
                    <Col xs={11}>
                    <Form.Control type="text" placeholder="Answer choice 3" size='sm' value={answer3.name} onChange={(e) => {
                            setAnswer3({name: e.target.value, val: answer3.val})
                        } } />
                    </Col>
                    </Row>
                    <Row style={{marginTop: '2%'}}>
                    <Col xs={1}>
                        <Form.Check 
                        type='radio'
                        id='ans4'
                        name="group1"
                        onChange={(e)=>{
                            setAnswer1({val: false, name: answer1.name})
                            setAnswer2({val: false, name: answer2.name})
                            setAnswer3({val: false, name: answer3.name})
                            setAnswer4({val: true, name: answer4.name})
                        }}
                        style={{marginRight:'2%'}}
                        />
                    </Col>
                    <Col xs={11}>
                    <Form.Control type="text" placeholder="Answer choice 4" size='sm' value={answer4.name} onChange={(e) => {
                            setAnswer4({name: e.target.value, val: answer4.val})
                        } } />
                    </Col>
                    </Row>
                    <Row style={{marginTop: '2%'}}>
                    <Col>
                        <Button variant="primary" type="submit">OK</Button>
                    </Col> 
                    </Row>
            </Form>
        </>}/>
        <h1>
            {quizId}
        </h1>
        <p className="mini">
            Now in Quiz Editing Mode
        </p>
        <div className="top-buttons">
            <Button variant="success" style={{marginRight: '10%'}} onClick={()=>{setShowEditModal(true)}}>Add a Question</Button>
            <Button variant="warning">
            <Link to="/teacher" style={{marginLeft: '10%'}} >Back to Dashboard</Link>
            </Button>
        </div>
        <Table style={{marginTop: '1%', width: '95vw'}} striped hover responsive="sm" size="sm">
              <thead>
                <tr>
                  <th style={{width: '95%'}}>Quiz Questions</th>
                  <th/>
                </tr>
              </thead>
              <tbody>
                {
                    quizQuestions!=null?Object.entries(quizQuestions).map(list=>{
                        let key=list[0]
                        return (<tr key={Math.random()*1000}>
                            <td>
                                {key}
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
    }
    </div>)
}