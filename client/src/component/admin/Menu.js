import React, {Fragment, useCallback} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from '../../context/AuthContext';
import Button from 'react-bootstrap/Button';

export default function Menu() {
    const auth = useAuth();
    const navigate = useNavigate();
    const logout = useCallback(
        () => {
            auth.logout();
            navigate("/login", {replace: false});
        },
        []
    );

    return (
        <Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to={'/admin/room/new'} className={"nav-link"}>Salons</Link>
                            <Link to={'/admin/request'} className={"nav-link"}>Demandes</Link>
                            <Link to={'/admin/send-notification'} className={"nav-link"}>Notification</Link>
                        </Nav>
                        <Nav className="">
                            <Button variant="danger" onClick={logout}>Déconnexion</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    )
}