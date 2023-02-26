import { onValue, ref, getDatabase } from "firebase/database"
import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import { useLoaderData, useParams } from "react-router-dom"
import { firebase } from "../firebase"

import '../styles/quizview.css'

export default function QuizView(){
    const {username, quizId} = useParams()
    const quizRef='users/'+username+'/quiz/'+quizId
    const initialVal = useLoaderData()
    const [listItems, setListItems] = useState(initialVal)
    const [db] = useState(getDatabase(firebase))

    useEffect(()=>{
        onValue(ref(db, quizRef), (snapshot)=>{
            if(snapshot.exists()){
                setListItems(snapshot.val())
             } else{
                setListItems(null)
             }
        })
    }, [db, quizRef])
    
    return (
    <div className="background-image">
    {
        listItems==null?
        <div className="error-header">
            <h1>Sorry 😢</h1>
            <p>Either the page you are looking for does not exist, or you are not allowed to view it.</p>
            <p className="mini">(If you believe this is a mistake, please ensure you are signed in to the right account, then come back to this page.)</p>
        </div>:
        <div className="header">
        <h1>
            {quizId}
        </h1>
        <p className="mini">
            Now in Quiz Editing Mode
        </p>
        <Table style={{marginTop: '1%'}} striped hover responsive="sm" size="sm">
            <th>

            </th>
        </Table>
    </div>
    }
    </div>)
}