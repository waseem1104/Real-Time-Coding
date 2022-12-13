import React from "react";
import { Fragment, useState, useEffect,useCallback,useMemo } from "react";
import Menu from '../Menu';
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSocket } from '../../../context/SocketContext';

export default function Chatbot(){
    return(
        <Fragment>
            <Menu/>
            <Container>
                <Row className="mt-5">
                    <Col>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

}