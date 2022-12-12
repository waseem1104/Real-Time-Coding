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
import { useSocket } from '../../../context/SocketContext';

export default function ChatRoom(){

    const socket = useSocket();
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState('');

    useEffect( () => {
        socket.on('message room',({client,content}) => {

            let new_messages = messages.slice();
            new_messages.push({content})
            setMessages(new_messages);
            
        })
    },[socket,messages])

    useEffect( () => {
        socket.emit("join","esgi");
    },[])


    const handleSubmit = useCallback( () =>{

        socket.emit('message room', {
            message: message,
            room : "esgi"
        })

    },[message]);


    return (
        <Fragment>
            <Menu/>

            <Container>
                <Row>
                    <Col>
                    <Card style={{height: '30rem'}}>
                            <Card.Body>
                            {
                                messages.map( (message,i) =>{
                                    return(
                                        <div className="message mb-2" key={i}>
                                            {/* <p className="m-0">{message.email}</p> */}
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
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

}