import React from 'react';
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Menu from "../Menu";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Cookies from 'universal-cookie';

export default function ChatRoom({socket,roomSelected}){

    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState('');
    const cookies = new Cookies();

    useEffect( () => {
        socket.on('message room',({client,email,content}) => {

            let new_messages = messages.slice();
            new_messages.push({email,content})
            setMessages(new_messages);
            
        })
    },[socket,messages])
    

    useEffect( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setMessages(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", `http://localhost:5000/room/${roomSelected.id}/messages`, false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
            }
        }
        request.open( "POST", `http://localhost:5000/room/join`, false );
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send(JSON.stringify({
            "roomid" : roomSelected.id
        }));

        socket.emit("join",roomSelected.id);  

        return () => {

            request.open( "DELETE", `http://localhost:5000/room/leave/${roomSelected.id}`, false ); 
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
            socket.emit('quit',roomSelected.id);
        }
    },[roomSelected])


    const handleSubmit = useCallback( () =>{

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {

                socket.emit('message room', {
                    message: message,
                    room : roomSelected.id
                })
            }
        }
        request.open( "POST", `http://localhost:5000/room/message/new`, false );
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send(JSON.stringify({
            "roomid": roomSelected.id,
            "content": message
        }));


    },[message]);


    return (
        <Fragment>
                    <h2 className="fs-5 mb-3">{roomSelected.name}</h2>
                    <hr/>
                    <Card style={{height: '30rem'}}>
                            <Card.Body>
                            {
                                messages.map( (message,i) =>{
                                    return(
                                        <div className="message mb-2" key={i}>
                                            <p className="m-0">{message.email}</p>
                                            <div className="content px-2">
                                                {message.content}
                                                {/* <p className="m-0">{message.createdAt}</p> */}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            </Card.Body>
                            <Card.Footer>
                            <InputGroup>
                                <Form.Control
                                placeholder="Message..."
                                value={message}
                                onChange={ (e) => setMessage(e.target.value)}
                                />
                                <Button onClick={handleSubmit} variant="dark">Envoyer</Button>
                            </InputGroup>
                            </Card.Footer>
                        </Card>
        
        </Fragment>
    );

}