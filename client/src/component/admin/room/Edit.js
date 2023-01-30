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
import Alert from 'react-bootstrap/Alert';
export default function Edit(){

    const [name, setName] = useState('');
    const [size,setSize] = useState(1);
    // const [count,setCount] = useState(0);



    const [alertSize,setAlertSize] = useState(false);

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
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    }, []);

    const handleSubmit = useCallback( () => {
        let count = 0;
        const request = new XMLHttpRequest();


        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                count = JSON.parse(request.responseText)[0].user_nb
            }
        }
        request.open( "GET", `http://localhost:5000/admin/room/${params.id}/count`, false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        if (size >= count){
            setAlertSize(false);
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE) {
                    socket.emit('room updated',{id:JSON.parse(request.responseText).id,name:JSON.parse(request.responseText).name,size:JSON.parse(request.responseText).size,createdAt:JSON.parse(request.responseText).createdAt})
                }
            }
            request.open( "PUT", `http://localhost:5000/admin/room/edit/${params.id}`, false );
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send(JSON.stringify({
                "name": name,
                "size": size
            }));
        }else{
            setAlertSize(true);
        }


    },[name,size])


    return(
        <Fragment>
            <MenuAdmin/>

            <Container>
                <Row>
                    <Col>

                        {alertSize ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Erreur au niveau de la taille du salon {name}. Des utilisateurs sont présents dans ce salon.
                            </Alert> : ''
                        }
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