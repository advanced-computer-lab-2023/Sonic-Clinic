import React, {useState}from 'react'
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import AdminDocReqDetails from './AdminDocReqDetails';

export default function AdminDocReqCard(props) {

  return (
    <div>
     <Card style={{width:'1000px', height:'75px', borderRadius:'2px', marginBottom:'5px', boxShadow: '2px 0px 2px 0px #adb5bd',}}>
     <Card.Body className="d-flex align-items-center">
  <div>
    <Card.Title style={{ fontSize: '17px' }}>{props.docName}</Card.Title>
    <Card.Text style={{ fontSize: '14px' }}>
      Specialty is {props.docSpecialty}
    </Card.Text>
  </div>
  <div className="d-flex flex-grow-1"></div>
  <div className="ms-auto">
    <FontAwesomeIcon
      icon={faAnglesRight}
      style={{
        opacity: 1,
        color: '#05afb9',
        fontSize: '20px',
        cursor: 'pointer',
        marginRight:'30px',
        animation: 'arrowAnimation2 1s infinite alternate ease-in-out',
      }}
    />
  </div>
</Card.Body>

    </Card>
    <AdminDocReqDetails/>
    </div>
    
  )
}
