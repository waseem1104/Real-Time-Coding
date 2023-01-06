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
import Notification from "../Notification";

export default function ListRooms(){

    const [rooms,setRooms] = useState([]);
    const [countRooms,setCountRooms] = useState([]);
    const [roomSelected, setRoomSelected] = useState([]);
    const socket = useSocket();

    useEffect( () => {

        console.log('test');
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setRooms(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", 'http://localhost:5000/room/', false );
        // request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setCountRooms(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", 'http://localhost:5000/room/count', false );
        // request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();
    },[]);

    useEffect( () => {

        if (rooms.length > 0){
            socket.on("get room updated", (room) =>{

                let getRooms = rooms.slice();
                let found = getRooms.findIndex( element => element.id == room.id);
                getRooms[found].name = room.name;
                getRooms[found].size = room.size;
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

    useEffect ( () => {

            socket.on('update count user room join', (room) => {
                let users_room = document.querySelector(`#users_room${room}`);
                let count = parseInt(users_room.innerText) + 1;
                users_room.innerText = count;
            })

            return () => {
                socket.off("update count user room join");
            }

    },[])

    useEffect ( () => {

        socket.on('update count user room leave', (room) => {

            let users_room = document.querySelector(`#users_room${room}`);
            let count = parseInt(users_room.innerText) - 1;
            users_room.innerText = count;
        })

        return () => {
            socket.off("update count user room leave");
        }

    },[])


    const handleSelected = useCallback( (room) =>{

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                if (JSON.parse(request.responseText)[0].user_nb < room.size){
                    setRoomSelected(room)
                }
            }
        }
        request.open( "GET", `http://localhost:5000/room/${room.id}/count`, false );
        // request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

    });

    const countUser = useCallback ( (id) => {
        let found = countRooms.findIndex( element => element.roomid == id);
        if (found != -1){
            return countRooms[found].user_nb;
        }
        return 0;
    },[countRooms])

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
                                                <p className="m-0"><span id={`users_room${room.id}`}>{ countUser(room.id) } </span> / {room.size} utilisateurs</p>
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
                    {/* <Col md="2">
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
                    </Col> */}
                </Row>
                <Notification />
            </Container>
        </Fragment>
    )
}