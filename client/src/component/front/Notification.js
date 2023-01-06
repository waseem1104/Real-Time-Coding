import React, { useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Notification() {

    const [position, setPosition] = useState('top-start');
    const [show, setShow] = useState(false);

    const [notifications, setNotifications] = useState("");
    const evtSource = new EventSource('http://localhost:5000')

    useEffect( () => {
        evtSource.onmessage = (e) => {
            setNotifications(e.data);
        }
    }, []);

    if (notifications !== "")
    return (
        <ToastContainer containerPosition={'absolute'} position={"top-end"}>
            <Toast onClose={()=>{setNotifications("")}} bg={"primary"} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>{notifications}</Toast.Body>
            </Toast>

        </ToastContainer>
    );
    else return( <></>)
}

export default Notification;