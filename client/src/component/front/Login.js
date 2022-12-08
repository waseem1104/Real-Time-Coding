import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link, useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';
import { useSocket } from '../../context/SocketContext';
export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    // const socket = useSocket();
    // useEffect( () => {
    //     socket.on('users', (users) =>{
    //         console.log(users)
    //     })
    // },[socket])

    const login = useCallback(
        () => {
            const data = {email: email, password: password};

            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    const cookies = new Cookies();
                    cookies.set('token', data.token, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                    });

                    navigate("/rooms", { replace: false });

                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
        [email, password]
    );


    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{width: '25rem'}}>
                                <Card.Body>
                                    <Card.Title>Connectez-vous</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                            className="form-control"
                                            placeholder="email@mail.com"
                                            aria-label="Email"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }}
                                            className="form-control"
                                            placeholder="Mot de passe"
                                            aria-label="Password"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button variant="primary" onClick={login}>Se connecter</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}