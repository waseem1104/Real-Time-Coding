import {Fragment, useState, useEffect, useCallback} from "react";
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {useSocket} from '../../../context/SocketContext';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import Notification from "../Notification";
import React from "@types/react";

export default function PrivateChat({requestUser}) {
    const socket = useSocket();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const cookies = new Cookies();

    useEffect(() => {

        if (requestUser) {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setMessages(JSON.parse(request.responseText));
                }
            }
            request.open("GET", `http://localhost:5000/message/privateMessages/${requestUser[0].advisor}`, false);
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        }

    }, [])


    useEffect(() => {
        socket.on('private message', ({content, createdAt}) => {
            let new_messages = messages.slice();
            new_messages.push({content, createdAt});
            setMessages(new_messages);
        })
    }, [socket, messages])


    const handleSubmit = useCallback(() => {

        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {

                let new_messages = messages.slice();
                new_messages.push({
                    content: JSON.parse(request.responseText).content,
                    createdAt: JSON.parse(request.responseText).createdAt
                });
                setMessages(new_messages);


                socket.emit('private message', {
                    content: JSON.parse(request.responseText).content,
                    dateCreated: JSON.parse(request.responseText).createdAt,
                    to: JSON.parse(request.responseText).advisor
                });

                setMessage('');
            }
        }
        request.open("POST", `http://localhost:5000/message/privateMessages/new`, false);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send(JSON.stringify({
            "content": message,
            "advisor": requestUser[0].advisor
        }));

    }, [message, messages]);

    return (
        <Fragment>
            <h2 className="fs-5 mb-3"></h2>

            <Card id="chat" style={{height: '30rem'}}>
                <Card.Body id="chat-body">
                    {
                        messages.map((message, i) => {
                            return (
                                <div className="message mb-2" key={i}>

                                    <div className="content-chat px-2">
                                        {message.content}
                                        <p className="m-0">{message.createdAt}</p>
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
                            onChange={(e) => setMessage(e.target.value)}

                        />
                        <Button variant="dark" onClick={handleSubmit}>Envoyer</Button>
                    </InputGroup>
                </Card.Footer>
            </Card>
            <Notification/>
        </Fragment>
    );
}