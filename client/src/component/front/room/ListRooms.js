import { Fragment,useState, useEffect, useMemo, useCallback} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Menu from "../Menu";
import ChatRoom from "./ChatRoom";
import { useSocket } from '../../../context/SocketContext';

export default function ListRooms(){

    const [rooms,setRooms] = useState([]);
    const [roomSelected, setRoomSelected] = useState([]);
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


    const handleSelected = useCallback( (room) =>{
        setRoomSelected(room)
    });

    return (
        <Fragment>
            <Menu/>
            <Container>
                <h1 className={"mt-5 fs-2"}>Les salons</h1>
                <Row className={"mt-5"}>
                    <Col md="3">
                        <ListGroup>

                            { 
                                rooms.map((room,index) => {
                                    return (
                                        <ListGroup.Item className="room d-flex" key={room.id} id={room.id} onClick={ () => handleSelected(room)}>
                                            <img src={`https://picsum.photos/50`} className="rounded mx-2"></img>
                                            <div>
                                                <div>{ room.name }</div>
                                                <p className="m-0">0 / {room.size} utilisateurs</p>
                                            </div>
                                        
                                        </ListGroup.Item>
                                    );
                                })
                            }
                        </ListGroup>
                    </Col>
                    <Col md="7">
                        { roomSelected.name  && 
                            <ChatRoom socket={socket} roomSelected={roomSelected}  />
                        }
                    </Col>
                    <Col md="2">
                        <ListGroup>

                            { 
                                rooms.map((room,index) => {
                                    return (
                                        <ListGroup.Item className="room" key={room.id} id={room.id} onClick={ () => handleSelected(room)}> 
                                            { room.name }
                                        </ListGroup.Item>
                                    );
                                })
                            }
                        </ListGroup>
                    </Col>
                </Row>
                
            </Container>
        </Fragment>
    )
}