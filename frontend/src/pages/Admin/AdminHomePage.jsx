import React from 'react'
import AdminHomeCard from '../../components/Admin/AdminHomeCard'
import AppNavbar from '../../components/AppNavigation/AppNavbar'
import { Container, Row } from "react-bootstrap";
import AdminImg from "../../components/Admin/AdminImg";

export default function AdminHomePage() {
  return (
    <>
    <AppNavbar/>

    <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
           style={{margin: '20px', display:'flex', flexDirection:'column', marginLeft:'100px'}}>
          <Row className="row-sub-container">
            <AdminImg />
          </Row>
          <div style={{
        display: 'flex',
        flexDirection: 'row', 
        alignItems: 'center', 
        margin: '20px',
        }}>
       <AdminHomeCard cardText="Patients"/>
       <AdminHomeCard cardText="Doctors"/>
       <AdminHomeCard cardText="Admins"/>
       <AdminHomeCard cardText="Health Packages"/>
    </div>
    </Container>
    </>
    
  )
}
