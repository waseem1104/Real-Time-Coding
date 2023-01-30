import React, {Fragment} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";

const request = new XMLHttpRequest();

export default function Login() {

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        <div className={"d-flex justify-content-center mt-5"}>
                            <div>
                                <h2>Cette page n'existe pas</h2>

                                <div className={"d-flex justify-content-center mt-5"}>
                                    <Link to={'/rooms'}><Button variant="primary">Retour sur le site</Button></Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}