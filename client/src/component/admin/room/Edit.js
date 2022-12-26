import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import MenuAdmin from "../Menu";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSocket } from '../../../context/SocketContext';
import { Link, useParams } from "react-router-dom";
import Cookies from 'universal-cookie';
export default function Edit(){

    const [name, setName] = useState('');
    const [size,setSize] = useState(1);

    const params = useParams();
    const cookies = new Cookies();
    const socket = useSocket();


    useEffect(() => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {

                setName(JSON.parse(request.responseText).name);
                setSize(JSON.parse(request.responseText).size);
            }
        }
        request.open( "GET", `http://localhost:5000/admin/room/${params.id}`, false );
        // request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    }, []);


    const handleSubmit = useCallback( () => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                socket.emit('room updated',{id:JSON.parse(request.responseText).id,name:JSON.parse(request.responseText).name,size:JSON.parse(request.responseText).size,createdAt:JSON.parse(request.responseText).createdAt})
            }
        }
        request.open( "PUT", `http://localhost:5000/admin/room/edit/${params.id}`, false );
        request.setRequestHeader("Content-type", "application/json");
        // request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send(JSON.stringify({
            "name": name,
            "size": size
        }));

    },[name,size])


    return(
        <Fragment>
            <MenuAdmin/>

            <Container>
                <Row>
                    <Col>
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{width: '25rem'}}>
                                <Card.Body>
                                    <Card.Title>Modifier un salon</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value)
                                            }}
                                            className="form-control"
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
                                            aria-label="name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button variant="dark" onClick={handleSubmit}>Modifier</Button>
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