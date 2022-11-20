import React, {Fragment, useCallback, useMemo, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link, useNavigate} from "react-router-dom";
import io from 'socket.io-client';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {token} = sessionStorage;

    const socket = useMemo(
        () => io("ws://localhost:5000",
            {
                query: {token},
                auth: {
                    token: process.env.JWT_SECRET
                }
            }
        )
        , []);

    socket.on("connect", () => {
        console.log("Connected !")
    })

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