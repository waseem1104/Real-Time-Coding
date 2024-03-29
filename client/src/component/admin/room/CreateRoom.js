import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import MenuAdmin from "../Menu";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSocket } from '../../../context/SocketContext';
import List from "./List";
import Cookies from 'universal-cookie';
import Alert from 'react-bootstrap/Alert';
export default function CreateRoom(){

    const cookies = new Cookies();
    const [name, setName] = useState('');
    const [size,setSize] = useState(1);
    const [alert, setAlert] = useState(false);
    const socket = useSocket();


    const handleSubmit = useCallback(
        () => {
            const data = {name: name, size:size};

            if (name.trim().length > 2 && size >= 1){
                fetch('http://localhost:5000/admin/room/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("token")
                    },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setAlert(false);
                        setName('');
                        setSize(1);
                        socket.emit('room created',{id:data.id,name:name,size:size,createdAt:data.createdAt})
                        
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                });
            }else{
               setAlert(true);
            }



        },
        [name,size]
    );

    return (
        <Fragment>
            <MenuAdmin/>
            <Container>
                <Row>
                {alert ?
                    <Alert key="danger" variant="danger" className="mt-3">
                        La taille du salon doit être supérieur à 1 et la taille du nom doit être supérieur à 2 caractères !
                    </Alert> : ''
                }
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
                    <Col>
                        <List socket={socket}/>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}