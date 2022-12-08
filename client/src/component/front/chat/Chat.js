import React from "react";
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Menu from '../Menu';
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSocket } from '../../../context/SocketContext';
export default function Chat(){

    const socket = useSocket();
    const [users,setUsers] = useState([]);
    const [userSelected,setUserSelected] = useState([]);

    const handleSelected = useCallback( (user) =>{
        setUserSelected(user)
    });
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
                                        <ListGroup.Item key={index} onClick={ () => handleSelected(user)}> 
                                            { user.email }
                                            <p className="m-0"> { user.connected ? "En ligne" : "Hors ligne" }</p>
                                        </ListGroup.Item>
                                    );
                                })
                            }
                            </ListGroup>
                        </div>
                    </Col>
                    <Col md="9">
                        <h2 className="fs-5 mb-3">{userSelected.email}</h2>
                        <hr/>
                    </Col>
                </Row>
            </Container>
            
        </Fragment>
    );

}