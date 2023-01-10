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
    const [message,setMessage] = useState("");
    const [step,setStep] = useState(0);


    useEffect( () => {
        socket.emit('chatbot',({client: 1, step: 0, message : null}));
    },[])
    
    const handleSubmit = useCallback( () => {

        let sliceMessages = messages.slice();
        sliceMessages.push({content:message,is:"client"})
        setMessages(sliceMessages);

        if (step == 1){
            socket.emit('chatbot',({client: 1, step: 1, message : message}));
        }

        if (step == 2){
            socket.emit('chatbot',({client: 1, step: 2, message : message}));
        }

        if (step == 3){
            socket.emit('chatbot',({client: 1, step: 3, message : message}));
        }

        if (step == 4){
            socket.emit('chatbot',({client: 1, step: 4, message : message}));
        }

        if (step == 41){
            socket.emit('chatbot',({client: 1, step: 41, message : message}));
        }


        if (step == 42){
            socket.emit('chatbot',({client: 1, step: 42, message : message}));
        }

        if (step == 43){
            socket.emit('chatbot',({client: 1, step: 43, message : message}));
        }

        if (step == 44){
            socket.emit('chatbot',({client: 1, step: 44, message : message}));
        }

        if (step == -1){
            socket.emit('chatbot',({client: 1, step: 0, message : null}));
        }

        setMessage("");

    },[step,message,messages])

    useEffect( () => {

        socket.on('chatbot',({content,is,step}) => {
            let sliceMessages = messages.slice();
            sliceMessages.push({content,is})
            setMessages(sliceMessages)
            setStep(step)
        })
    },[messages])

    return(
        <Fragment>
            <Menu/>
            
            <Container>

                <Row className="mt-5">
                <h2 className="fs-5 mb-3">Chatbot</h2>
                    <Col>
                    <Card id="chatbot" style={{height: '30rem'}}>
                            <Card.Body id="chatbot-body">
                            {
                                messages.map( (message,i) =>{
                                    return(
                                        <div className="message mb-2" key={i}>
                                        { message.is == "chatbot" ? 
                                            <div className="content-chatbot px-2 d-flex justify-content-start">
                                                <span>{message.content}</span>
                                            </div>
                                            : 
                                            <div className="content-client px-2 d-flex justify-content-end">
                                                <span>{message.content}</span>
                                            </div>
                                        }
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
                                <Button variant="dark" onClick={ handleSubmit }>Envoyer</Button>
                            </InputGroup>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

}