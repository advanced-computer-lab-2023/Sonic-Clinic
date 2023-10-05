import React from 'react'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function AdminViewTable() {
    //3ayzeen n-pass el users dol ka props
    const users = [
        { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
        { id: 2, firstName: 'John', lastName: 'Doe', username: '@johndoe' },
      ];

  return (
    <Table striped bordered hover variant="light" style={{width:'1000px'}}>
      <thead>
        <tr>
          <th style={{color:'#099BA0'}}>First Name</th>
          <th style={{color:'#099BA0'}}>Last Name</th>
          <th style={{color:'#099BA0'}}>Username</th>
          <th style={{color:'#099BA0'}}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.username}</td>
            <td><FontAwesomeIcon
              icon={faTrashCan}
              style={{
                opacity: 1,
                color: '#ff6b35',
                fontSize: '20px',
                cursor: 'pointer',
               
              }}
            /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
