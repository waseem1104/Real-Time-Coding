import React,{ Fragment } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, useNavigate} from "react-router-dom";
export default function Menu(){
    return(
        <Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to={'/admin/room'} className={"nav-link"}>Salons</Link>
                            <Link to={'/admin/room'} className={"nav-link"}>Messages</Link>
                        </Nav>

                        <Nav className="">
                            <Link to={'/admin/room'} className={"nav-link"}>Profile</Link>
                        </Nav>

                

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    )
}