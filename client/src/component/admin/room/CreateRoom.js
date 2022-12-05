import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import MenuAdmin from "../Menu";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSocket } from '../../../context/SocketContext';
export default function CreateRoom(){


    const [name, setName] = useState('');
    const [size,setSize] = useState(1);

    const socket = useSocket();

    const handleSubmit = useCallback(
        () => {
            const data = {name: name, size:size};

            fetch('http://localhost:5000/admin/room/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    socket.emit('room created',{name:name,size:size})
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
        [name,size]
    );

    return (
        <Fragment>
            <MenuAdmin/>
            <Container>
                <Row>
                    <Col>
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{width: '25rem'}}>
                                <Card.Body>
                                    <Card.Title>Créer un salon</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value)
                                            }}
                                            className="form-control"
                                            placeholder="ESGI"
                                            aria-label="name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            value={size}
                                            onChange={(e) => {
                                                setSize(e.target.value);
                                            }}
                                            className="form-control"
                                            placeholder=""
                                            aria-label="name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button variant="primary" onClick={handleSubmit}>Créer</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}