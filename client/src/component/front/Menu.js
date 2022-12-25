import React,{Fragment} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link, useNavigate} from "react-router-dom";

export default function Menu(){
    return(
        <Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to={'/login'} className={"nav-link"}>Connexion</Link>
                            <Link to={'/login'} className={"nav-link"}>Inscription</Link>
                            <Link to={'/chat'} className={"nav-link"}>Chat</Link>
                            <Link to={'/rooms'} className={"nav-link"}>Salons</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    </Fragment>
    )
}