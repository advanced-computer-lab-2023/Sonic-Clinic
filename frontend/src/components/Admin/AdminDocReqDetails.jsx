import React from 'react'
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';


export default function AdminDocReqDetails({ props }) {
  return (
    <Card style={{ width: '400px'}}>
      <Card.Body>
        <div className='d-flex justify-content-between'>
        <div>
        <Card.Title>Doc Name</Card.Title>
        <Card.Subtitle className="mb-2" style={{color:'#099BA0'}}>Specialty</Card.Subtitle>
        </div>
        <div>
        <Button
    style={{
      backgroundColor: '#f0f0f0',
      marginLeft: '20px',
      borderColor: '#f0f0f0',
      width: '40px',
      height:'40px'
    }}
    >
    <FontAwesomeIcon icon={faCheck} style={{color:'green', fontWeight:'bold', fontSize:'20px'}} />
    </Button>
    <Button
    style={{
      backgroundColor: '#f0f0f0',
      marginLeft: '20px',
      borderColor: '#f0f0f0',
      width: '40px',
      height:'40px'
    }}
    >
    <FontAwesomeIcon icon={faX} style={{color:'#ff6b35', fontWeight:'bold', fontSize:'20px'}} />
    </Button>
        </div>
        </div>
        
        <Card.Text>
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', fontSize:'15px'}}>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Full Name:</span>
    Hi
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Email:</span>
    Hi
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Email:</span>
    Hi
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Date of Birth:</span>
    Hi
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Hourly Rate:</span>
    Hi
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Affiliation:</span>
    Hi
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px' }}>
    <span style={{ color:'#212529', marginRight: '5px' }}>Educational Background:</span>
    Hi
  </div>
</div>

    </Card.Text>
    
      </Card.Body>
    </Card>
  );
  
}
