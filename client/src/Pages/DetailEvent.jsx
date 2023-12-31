import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Container, Row, Col, Card } from 'react-bootstrap';
import EventImage from '../Components/Image'
import EventInfo from '../Components/EventInfo'
import { Navigate, useParams } from "react-router-dom"
import { getToken, getUser } from '../Utils/Common'
import { useNavigate } from "react-router-dom";
import '../Styles/eventdetail.css'


function DetailEvent() {
    
    const { eventId } = useParams();
    const [Event, setEvent] = useState([]);
    const [usersJoined, setUsersJoined] = useState([]);
    let axiosConfig = {
        headers: {
            'x-auth-token': getToken(),
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(`/api/events/events_by_id?id=${eventId}&type=single`, axiosConfig)
        .then(response => {
            setEvent(response.data[0]);
            let axiosConfig2 = {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
                  'x-auth-token': getToken(),
                },
                params: {"userIds": response.data[0].usersJoined}
              };
            Axios.get('http://localhost:8000/api/users/getUsers', axiosConfig2).then(response => {
                console.log(response.data);
                setUsersJoined(response.data);
            });
        })
    }, []);

    const joinEvent = (eventId) => {
        const path = '/api/events/' + eventId;
        Axios.put(path, {}, axiosConfig).then(response => {
            const message = response.data.message;
            alert(message);
            console.log(message);
        }).catch((error) => {
            const errorMsg = error.response.data.message;
            alert(errorMsg);
            console.error(errorMsg);
        })
    }

    const deleteEvent = (eventId) => {
        const path = '/api/events/' + eventId;
        Axios.delete(path, axiosConfig).then(response => {
            const message = response.data.message
            console.log(message);
            navigate("/events");
        }).catch((error) => {
            const errorMsg = error.response.data.message;
            alert(errorMsg);
            console.error(errorMsg);
            console.log(error);
        })
    }

    const followUser = (eventId) => {
        if(getUser() == Event.writer){
            alert("This event is created by you.")
        }
        else {
            const path = '/api/events/follow/' + eventId;
            Axios.put(path, {}, axiosConfig).then(response => {
                const message = response.data.message;
                alert(message);
                console.log(message);
            }).catch((error) => {
                const errorMsg = error.response.data.message;
                alert(errorMsg);
                console.error(errorMsg);
                console.log(error);
            })
        }
    }
      
    return (
        <div className="postEvent" style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Event.title}</h1>
            </div>

            <br />
            <Container>
                <Row >
                    <Col>
                        <EventImage detail={Event}/>
                    </Col>
                    <Col >
                        <EventInfo detail={Event} joinEvent = {joinEvent} deleteEvent = {deleteEvent} followUser = {followUser}/>
                    </Col>
                </Row>
                <h2 >See who has joined this event.</h2>
                <Row>
                    {
                        usersJoined.length === 0 ?
                        <h2> No users yet...</h2>
                        :
                        usersJoined.map((user, index) => {
                            return (
                                <Col md xs lg={{ span: 3 }}>
                                    <Card>
                                        <Card.Title>
                                            {user.name}
                                        </Card.Title>
                                        <img className="userPic"
                                            src={`http://localhost:8000/${user.profilePictureURL}`} alt="userImage" />
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Container>
            </div>
    )
}

export default DetailEvent
