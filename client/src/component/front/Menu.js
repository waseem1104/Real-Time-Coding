import React,{Fragment, useCallback} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
export default function Menu(){


    const auth = useAuth();
    const navigate = useNavigate();

    const logout = useCallback(
        () => {
            auth.logout();
            navigate("/login", { replace: false });
        },
        []
    );
    return(
        <Fragment>
            { auth.user && auth.user.success !== false ?
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to={'/chat'} className={"nav-link"}>Chat</Link>
                            <Link to={'/rooms'} className={"nav-link"}>Salons</Link>
                            <Link to={'/request'} className={"nav-link"}>Demande</Link>
                            { auth.user.isAdmin ?
                                <Link to={'/admin/room/new'} className={"nav-link"}>Administration</Link>
                                : ""}
                        </Nav>

                        <Nav className="">
                            <Link to={'/chatbot'} className={"nav-link"}>
                                Chatbot
                            </Link>
                            <Button variant="danger" onClick={logout}>Déconnexion</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar> :

            <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to={'/login'} className={"nav-link"}>Connexion</Link>
                        <Link to={'/register'} className={"nav-link"}>Inscription</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar> }


    </Fragment>
    )
}