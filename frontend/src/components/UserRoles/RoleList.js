import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../../services/api.js';
import '../../design/roles.css';

const RoleList = ({ onEdit }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/roles/');
                setRoles(response.data);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleDelete = async (roleId) => {
        try {
            await axios.delete(`/roles/${roleId}/`);
            setRoles(roles.filter((role) => role.role_id !== roleId));
        } catch (error) {
            console.error('Failed to delete role:', error);
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.role_id}>
                            <td>{role.name}</td>
                            <td>
                                <span onClick={() => onEdit(role)} style={{ cursor: 'pointer', marginRight: '10px' }}>
                                    <EditIcon />
                                </span>
                                <span onClick={() => handleDelete(role.role_id)} style={{ cursor: 'pointer' }}>
                                    <DeleteIcon />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoleList;
