import React, {useState} from 'react'
import AdminViewTable from '../../components/Admin/AdminViewTable';
import AdminSearchBar from '../../components/Admin/AdminSearchBar';
import AppNavbar from '../../components/AppNavigation/AppNavbar'
import { Container} from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AdminDocReqs from '../../components/Admin/AdminDocReqs';
import AdminDocReqDetails from '../../components/Admin/AdminDocReqDetails';

export default function AdminDoctorsPage() {
    const [tab, setTab] = useState('registered');

  return (
    <>
    <AppNavbar/>
    <style>
        {`
          /* Custom CSS for inactive tabs */
          .nav-link {
            color: #099BA0  ; /* Set the color for inactive tabs */
          }
        `}
      </style>
    <Tabs
      id="controlled-tab-example"
      activeKey={tab}
      onSelect={(k) => setTab(k)}
      className="mb-3 d-flex align-items-center justify-content-center"
      style={{marginTop:'100px'}}
      
    >
      <Tab eventKey="registered" title="Registered">
          <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
             style={{margin: '20px', display:'flex', flexDirection:'column', marginLeft:'100px'}}>
             <AdminSearchBar/>
             <AdminViewTable/>
          </Container>
      </Tab>
      <Tab eventKey="requests" title="Requests">
        <AdminDocReqs/>
      </Tab>
    </Tabs>
    </>
  )
}
