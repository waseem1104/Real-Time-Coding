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
import Form from 'react-bootstrap/Form';

export default function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSave, setAlertSave] = useState(false);
    const [isAdmin, setIsAdmin] = useState(0);

    const request = new XMLHttpRequest();

    const save = useCallback(
        () => {
            let admin = false
            if(isAdmin == 1){
                admin = true
            }
            if (password === confirmPassword) {
                request.open("POST", 'http://localhost:5000/register', false);
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader("Content-type", "application/json");
                request.send(JSON.stringify({
                    email: email,
                    password: password,
                    isAdmin: admin,
                   
                }));

                if (JSON.parse(request.response).id) {
                    setAlertSave(true);
                    setAlert(false);
                    setAlertShow(false);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                   
                }else if (JSON.parse(request.response).email) {
                    setAlert(false);
                    setAlertSave(false);
                    setAlertMessage('Email déjà utilisé');
                    setAlertShow(true);
                } else if (JSON.parse(request.response).password) {
                    setAlert(false);
                    setAlertSave(false);
                    setAlertMessage('Le mot de passe doit contenir au moins 6 caractères');
                    setAlertShow(true);
                }
            
            }else {
                setAlert(true);
            }
        },
        [email, password, confirmPassword,alert, isAdmin]
    );

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        {alert ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Les mots de passe ne correspondent pas
                            </Alert> : ''
                        }
                        {alertShow ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                {alertMessage}
                            </Alert> : ''
                        }
                        {alertSave ?
                            <Alert key="success" variant="success" className="mt-3">
                                Votre compte a été créé avec succès.
                            </Alert> : ''
                        }
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{width: '25rem'}}>
                                <Card.Body>
                                    <Card.Title>Inscrivez-vous</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                            }}
                                            className="form-control"
                                            placeholder="Entrez votre email"
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
                                            placeholder="Entrez votre mot de passe"
                                            aria-label="Password"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value)
                                            }}
                                            className="form-control"
                                            placeholder="Confirmez votre mot de passe"
                                            aria-label="Password"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>
                                    <Form.Select value={isAdmin} onChange={(e) => setIsAdmin(e.target.value)}>
                                        <option value="0">Utilisateur</option>
                                        <option value="1">Conseiller</option>
                                    </Form.Select>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button variant="primary" onClick={save}>S'inscrire</Button>
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