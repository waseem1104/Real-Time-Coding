import React from "react";
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Menu from '../Menu';
import Container from "react-bootstrap/Container";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSocket } from '../../../context/SocketContext';

export default function Chatbot(){

    const socket = useSocket();

    const [messages,setMessages] = useState([]);

    useEffect( () => {

        socket.emit('starting chatbot',({client: 1}));

        socket.on('starting chatbot',({content}) => {
            console.log(content);
        })

    },[])
    return(
        <Fragment>
            <Menu/>
            
            <Container>

                <Row className="mt-5">
                <h2 className="fs-5 mb-3">Chatbot</h2>
                    <Col>
                    <Card style={{height: '30rem'}}>
                            <Card.Body>
                            </Card.Body>
                            <Card.Footer>
                            <InputGroup>
                                <Form.Control
                                placeholder="Message..."
                                />
                                <Button variant="dark">Envoyer</Button>
                            </InputGroup>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

}