import React, {useState, useEffect} from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Notification() {

    const [facts, setFacts] = useState([]);
    const [listening, setListening] = useState(false);
    const [show, setShow] = useState(true);


    useEffect(() => {
        if (!listening) {
            const events = new EventSource('http://localhost:5000/events');

            events.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);

                setFacts((facts) => facts.concat(parsedData));
            };

            setListening(true);
        }


    }, [listening, facts]);

    return (
        <ToastContainer containerPosition={'absolute'} position={"top-end"}>
            {
                facts.map((fact, i) =>
                    <Toast key={i}
                           onClose={() => setFacts([])}
                           bg={"primary"}>
                        <Toast.Header>
                            <strong className="me-auto">Notification</strong>
                            <small>{fact.date}</small>
                        </Toast.Header>
                        <Toast.Body>{fact.info}</Toast.Body>
                    </Toast>
                )
            }
        </ToastContainer>
    );
}

export default Notification;