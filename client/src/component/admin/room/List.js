import React from 'react';
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
export default function List({socket}){

    const [rooms, setRooms] = useState([]);
    // const cookies = new Cookies();
    useEffect( () => {
        socket.on("get room", (room) =>{
            let new_room = rooms.slice();
            new_room.unshift(room);
            setRooms(new_room);
        })
    },[rooms,socket])

    useEffect ( () => {

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
                                    <tr key={i}>
                                        <td>{room.name}</td>
                                        <td>0 / {room.size}</td>
                                        <td>{room.createdAt}</td>
                                        <td>
                                            <Button size="sm" variant="dark" className="me-2">Modifier</Button>
                                            <Button size="sm" variant="danger"> Supprimer</Button>
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