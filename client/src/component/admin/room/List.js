import React from 'react';
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
export default function List({socket}){

    const [rooms, setRooms] = useState([]);
    const cookies = new Cookies();

    useEffect ( () => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setRooms(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", 'http://localhost:5000/room/', false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
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

    useEffect( () => {
        socket.on("room deleted", (room) =>{
            let getRooms = rooms.slice();
            let found = getRooms.findIndex( element => element.id == room.id);
            getRooms.splice(found,1);
            setRooms(getRooms);
        })
    },[rooms])

    const handleDelete = useCallback( (id) => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE) {

                    let getRooms = rooms.slice();
                    let found = getRooms.findIndex( element => element.id == JSON.parse(request.responseText).id);
                    getRooms.splice(found,1);
                    setRooms(getRooms);
                    socket.emit('room deleted',JSON.parse(request.responseText))
                }
            }
            request.open("PATCH", `http://localhost:5000/admin/room/delete/${id}`, false );
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send({id:id});
            
        },[rooms])


    return(
        <Fragment>
            <div className={"mt-5"}>
                <h2 className="fs-5 mb-4">Liste des salons</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Taille</th>
                            <th>Date de création</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rooms.map( (room,i) =>{
                                return(
                                    <tr key={room.id} id={room.id}>
                                        <td>{room.name}</td>
                                        <td>0 / {room.size}</td>
                                        <td>{room.createdAt}</td>
                                        <td>
                                            <Button size="sm" variant="dark" className="me-2">Modifier</Button>
                                            <Button onClick={ () => handleDelete(room.id)} size="sm" variant="danger">Supprimer</Button>
                                        </td>
                                    </tr>

                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </Fragment>
    );
}