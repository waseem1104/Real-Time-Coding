import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Link, useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
export default function Login() {

    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);
    

    const request = new XMLHttpRequest();

    const login = useCallback(
        () => {

            request.open("POST", 'http://localhost:5000/login', false);
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify({
                "email": email,
                "password": password,
            }));

            if (request.response !== 'OK') {
                if (JSON.parse(request.response).success === false) {
                    setAlert(true);
                    return;
                }
            }

            const cookies = new Cookies();
            cookies.set('token', JSON.parse(request.response).token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            auth.login(JSON.parse(request.response));
            navigate("/rooms", { replace: false });
        },
        [email, password]
    );


    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>

                        {alert ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Mauvais email ou mot de passe
                            </Alert> : ''
                        }
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