import {Fragment, useCallback, useState} from "react";
import MenuAdmin from "../Menu";
import {Col, Container, Form, FormControl, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const CustomizeNotification = () => {
    const [value, setValue] = useState('');

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            fetch('http://localhost:5000/fact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({info : value})
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, [value]);

    return (
        <Fragment>
            <MenuAdmin/>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Control
                                as="textarea"
                                rows="5"
                                value={value}
                                placeholder="Notification à envoyer à tous les utilisateurs connectés"
                                onChange={(event) => setValue(event.target.value)}
                            />
                            <Button type="submit">Envoyer</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default CustomizeNotification;
