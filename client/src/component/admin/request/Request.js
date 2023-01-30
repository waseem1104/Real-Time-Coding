import {Fragment, useState, useEffect, useCallback} from "react";
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuAdmin from '../Menu';
import Form from 'react-bootstrap/Form';
import {useSocket} from '../../../context/SocketContext';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import PrivateChat from '../request/PrivateChat';

export default function Request() {

    const [available, setAvailable] = useState(true)
    const [requests, setRequests] = useState([]);
    const [checkRequest, setCheckRequest] = useState([]);
    const socket = useSocket();
    const cookies = new Cookies();

    useEffect(() => {

        socket.emit("get available");

        socket.on('get available', (available) => {
            setAvailable(available);
        });


    }, [])

    useEffect(() => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                setCheckRequest(JSON.parse(request.responseText));

            }
        }
        request.open("GET", 'http://localhost:5000/admin/checkRequest', false);
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    }, [])


    const handleChange = useCallback((e) => {

        if (e.target.value == "true") {
            setAvailable(true);
            socket.emit("update available", true);
        } else {
            setAvailable(false);
            socket.emit("update available", false);
        }

    }, [available])


    useEffect(() => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                setRequests(JSON.parse(request.response));
            }
        }
        request.open("GET", 'http://localhost:5000/admin/request', false);
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

    }, [])


    useEffect(() => {

        socket.on('new request', (req) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setRequests(JSON.parse(request.response));
                }
            }
            request.open("GET", 'http://localhost:5000/admin/request', false);
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        })

    }, [])


    const handleRefuse = useCallback((id) => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {

                let getRequests = requests.slice();
                let found = getRequests.findIndex((element) => element.id = JSON.parse(request.responseText).id)
                getRequests.splice(found, 1);
                setRequests(getRequests);

                socket.emit("refuse request", JSON.parse(request.responseText));
            }
        }
        request.open("PATCH", `http://localhost:5000/admin/request/refuse/${id}`, false);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    });


    const handleAccept = useCallback((id, requestId) => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {

                let getRequests = requests.slice();
                let found = getRequests.findIndex((element) => element.id = JSON.parse(request.responseText).id)
                getRequests.splice(found, 1);
                setRequests(getRequests);
                setCheckRequest([JSON.parse(request.responseText)])

                socket.emit('accept request:user', JSON.parse(request.responseText));
            }
        }
        request.open("PATCH", `http://localhost:5000/admin/request/accept/${id}`, false);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();


        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {

                socket.emit('accept request', JSON.parse(request.responseText));
            }
        }
        request.open("PATCH", `http://localhost:5000/admin/request/refuse/all/${requestId}`, false);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();


    });

    const handleClose = useCallback((id) => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
                setCheckRequest([]);
                socket.emit('close request', JSON.parse(request.responseText));
            }
        }
        request.open("PATCH", `http://localhost:5000/admin/request/close/${id}`, false);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    })


    useEffect(() => {
        socket.on("accept request", (req) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setRequests(JSON.parse(request.response));
                }
            }
            request.open("GET", 'http://localhost:5000/admin/request', false);
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        })
    }, []);

    return (
        <Fragment>
            <MenuAdmin/>
            <Container>
                <Row className="mt-2">
                    <Form.Select value={available} onChange={handleChange}>
                        <option value="true">Disponible</option>
                        <option value="false">Indisponible</option>
                    </Form.Select>
                </Row>

                <Row className="mt-5">
                    <Col md="3">
                        <div>
                            <h2 className="fs-5 mb-3">Demandes</h2>

                            {checkRequest.length == 0 && available ?

                                <ListGroup>

                                    {
                                        requests.map((request, index) => {
                                            return (
                                                <ListGroup.Item className="user" key={index}>
                                                    <h6>Demande #{request.request_id}</h6>
                                                    <p>{request.email}</p>
                                                    <div className="d-flex">
                                                        <Button size="sm" variant="dark" className="me-2"
                                                                onClick={() => handleAccept(request.id, request.request_id)}>Accepter</Button>
                                                        <Button size="sm" variant="dark"
                                                                onClick={() => handleRefuse(request.id)}>Refuser</Button>
                                                    </div>
                                                </ListGroup.Item>
                                            );
                                        })
                                    }

                                </ListGroup>
                                : ""}
                        </div>
                    </Col>

                    {checkRequest.length > 0 ?
                        <Col md="9">
                            <Button size="sm" variant="danger" onClick={() => handleClose(checkRequest[0].id)}>Fermer la
                                demande</Button>
                            <PrivateChat requestUser={checkRequest}/>
                        </Col>
                        : ""}
                </Row>
            </Container>
        </Fragment>
    );
}