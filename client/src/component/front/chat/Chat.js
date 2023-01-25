import React from "react";
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Menu from '../Menu';
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import { useSocket } from '../../../context/SocketContext';

export default function Chat(){

    const socket = useSocket();
    const [users,setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const cookies = new Cookies();

    useEffect ( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setMessages(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", 'http://localhost:5000/chat/', false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
        
    },[])

    useEffect( () => {
        socket.on('user disconnected',({userId, email, connected}) => {
            const getUser = users.findIndex( (element) => element.userId == userId )
            const newUsers = users.slice();
            newUsers.splice(getUser,1);
            setUsers([...newUsers,{userId, email, connected}]);
        })
    },[socket])

    useEffect( () => {
        socket.on('users',(usersConnected) => {
            setUsers(usersConnected);
        })
    },[socket])

    useEffect( () => {

        socket.on('new user',({userId, email, connected}) => {
            
            const checkUser = users.findIndex( (element) => element.userId == userId);
            if (checkUser < 0){
                setUsers([...users, {userId,email,connected}])
            }
            
        })
    },[socket])


    return (
        <Fragment>
            <Menu/>
            <Container>
                <Row className="mt-5">
                    <Col md="3">
                        <div>
                            <h2 className="fs-5 mb-3">Utilisateurs</h2>
                            <ListGroup>

                            { 
                                users.map((user,index) => {
                                    return (
                                        <ListGroup.Item className="user" key={index}> 
                                            { user.email }
                                            { user.connected ? 
                                                <div className="d-flex">
                                                    <p className="m-0"> En ligne</p>
                                                    <span className="online mx-1"></span>
                                                </div> 
                                            : 
                                                <div className="d-flex">
                                                    <p className="m-0"> Hors ligne</p>
                                                    <span className="offline mx-1"></span>
                                                </div> 
                                            }
                                        </ListGroup.Item>
                                    );
                                })
                            }
                            </ListGroup>
                        </div>
                    </Col>
                    <Col md="9">
                        <h2 className="fs-5 mb-3">#Général</h2>
                        <hr/>

                        <Card style={{height: '30rem'}}>
                            <Card.Body>
                            {
                                messages.map( (message,i) =>{
                                    return(
                                        <div className="message mb-2" key={i}>
                                            <div className="content px-2">
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