import React from "react";
import {Fragment, useState, useEffect, useCallback, useMemo} from "react";
import Menu from '../Menu';
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {useSocket} from '../../../context/SocketContext';
import Cookies from 'universal-cookie';
import PrivateChat from "./PrivateChat";

export default function Request() {

    const cookies = new Cookies();
    const socket = useSocket();
    const [conseillers, setConseillers] = useState([]);
    const [requests, setRequests] = useState([])
    const [checkRequest, setCheckRequest] = useState([])
    const request = new XMLHttpRequest();


    useEffect(() => {

        socket.emit('get conseillers');
        socket.on('get conseillers', (users) => {
            setConseillers(users.filter((x, i) => x.admin && x.available));
        })
    }, []);


    useEffect(() => {
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                setRequests(JSON.parse(request.responseText))

                for (let i = 0; i < JSON.parse(request.responseText).length; i++) {
                    if (JSON.parse(request.responseText)[i].status == 1) {
                        setCheckRequest(JSON.parse(request.responseText));
                    }
                }
            }
        }
        request.open("GET", 'http://localhost:5000/request/', false);
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    }, [])

    useEffect(() => {
        socket.on('update conseillers', (conseillers) => {
            setConseillers(conseillers.filter((x, i) => x.admin && x.available));
        })
    }, []);

    useEffect(() => {
        socket.on('new conseiller', (conseillers) => {
            setConseillers(conseillers.filter((x, i) => x.admin && x.available));
        })
    }, []);

    useEffect(() => {
        socket.on('conseiller disconnected', (conseillers) => {
            setConseillers(conseillers.filter((x, i) => x.admin && x.available));
        })
    }, []);


    const renderButton = useCallback(() => {
        if (conseillers.length > 0 && requests.length == 0) {
            return (
                <Button size="sm" variant="dark" onClick={handleRequest}> Faire une demande</Button>
            );
        }
    }, [conseillers, requests]);


    const handleRequest = useCallback(() => {

        let users = [];

        const request_id = Date.now();

        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                users = JSON.parse(request.responseText);
            }
        }
        request.open("GET", 'http://localhost:5000/user/all', false);
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        for (let i = 0; i < users.length; i++) {

            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setRequests(JSON.parse(request.responseText))
                }
            }
            request.open("POST", 'http://localhost:5000/request/new', false);
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send(JSON.stringify({
                "advisor": users[i].id,
                "request_id": request_id
            }));

        }
        socket.emit("new request", request_id);

    }, [])


    useEffect(() => {
        socket.on("refuse request", (req) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setRequests(JSON.parse(request.responseText))
                }
            }
            request.open("GET", 'http://localhost:5000/request/', false);
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        })
    }, []);


    useEffect(() => {
        socket.on("accept request", (req) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setRequests(JSON.parse(request.responseText))
                }
            }
            request.open("GET", 'http://localhost:5000/request/', false);
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        })
    }, []);


    useEffect(() => {
        socket.on("accept request:user", ({req}) => {
            setCheckRequest([req])
        })
    }, []);


    useEffect(() => {
        socket.on("close request", (req) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setRequests(JSON.parse(request.responseText))
                    setCheckRequest([]);
                }
            }
            request.open("GET", 'http://localhost:5000/request/', false);
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        })
    }, []);


    return (
        <Fragment>
            <Menu/>
            <Container>
                <Row className="mt-5">
                    <Col md="3">
                        <div>
                            <p className="fs-5 mb-3">Conseillers en ligne : {conseillers.length}</p>
                            <ListGroup className="mb-3">

                            </ListGroup>
                            {renderButton()}
                        </div>
                    </Col>


                    {checkRequest.length > 0 ?
                        <Col md="9">
                            <PrivateChat requestUser={checkRequest}/>
                        </Col>
                        : ""}
                </Row>
            </Container>
        </Fragment>
    );
}