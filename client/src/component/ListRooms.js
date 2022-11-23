import { Fragment,useState, useEffect, useMemo} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Menu from "./Menu";
import io from 'socket.io-client';


export default function ListRooms(){

    const [rooms,setRooms] = useState();

    const socket = useMemo(
        () => io("ws://localhost:5000")
        , []);
    
        useEffect( () => {
            socket.on("getRooms", (name) =>{
                
            })
        },[socket])
    return (
        <Fragment>
            <Menu/>
            
            <Container>
                <Row>
                    <Col>
                        <div className={"mt-5"}>
                            <Card style={{width: '20rem'}}>
                                <Card.Body>
                                    <Card.Title>Créer un salon</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}