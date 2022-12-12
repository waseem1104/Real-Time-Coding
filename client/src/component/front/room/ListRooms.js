import { Fragment,useState, useEffect, useMemo} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Menu from "../Menu";
import { useSocket } from '../../../context/SocketContext';

export default function ListRooms(){

    const [rooms,setRooms] = useState([]);
    const socket = useSocket();
    useEffect( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setRooms(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", 'http://localhost:5000/room/', false );
        // request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    },[]);

    useEffect( () => {

        if (rooms.length > 0){
            socket.on("get room updated", (room) =>{

                let getRooms = rooms.slice();
                let found = getRooms.findIndex( element => element.id == room.id);
                getRooms[found].name = room.name;
                setRooms(getRooms);
            })
        }
    },[rooms,socket])

    useEffect( () => {
        socket.on("get room", (room) =>{
            let new_room = rooms.slice();
            new_room.unshift(room);
            setRooms(new_room);
        })
    },[rooms,socket])

    return (
        <Fragment>
            <Menu/>
            <Container>
                <h1 className={"mt-5 fs-2"}>Les salons</h1>
                <Row>
                    { 
                        rooms.map((room,index) => {
                            return (
                                <Col md="3" key={room.id} id={room.id}>
                                <div className={"mt-5"}>
                                    <Card style={{width: '15rem'}}>
                                        <Card.Img variant="top" src="https://picsum.photos/500" />
                                        <Card.Body>
                                            <Card.Title>{room.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">0 / {room.size} utilisateurs</Card.Subtitle>
                                            <Button size="sm" variant="outline-dark">
                                                Rejoindre
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                                </Col>
                            );
                        })
                    }
                </Row>
            </Container>
        </Fragment>
    )
}