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
        socket.on('message room',({client,message}) => {
            console.log(message);
        })
    },[socket])

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