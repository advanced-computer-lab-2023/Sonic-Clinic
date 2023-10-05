import React from 'react'
import AdminViewTable from '../../components/Admin/AdminViewTable';
import AdminSearchBar from '../../components/Admin/AdminSearchBar';
import AppNavbar from '../../components/AppNavigation/AppNavbar'
import { Container} from "react-bootstrap";

export default function AdminPatientsPage() {
  return (
    <>
    <AppNavbar/>
    <div style={{
              marginTop:'50px',
              color: "#05AFB9",
              textAlign: "center",
              fontFamily: "Vibur",
              fontSize: "60px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}>Registered Patients</div>
    <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
           style={{margin: '20px', display:'flex', flexDirection:'column', marginLeft:'100px'}}>
      <AdminSearchBar/>
      <AdminViewTable/>
    </Container>
    </>
  )
}
