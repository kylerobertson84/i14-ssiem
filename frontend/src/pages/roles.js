import React, { useState } from 'react';
import RoleList from '../components/UserRoles/RoleList.js';
import RoleForm from '../components/UserRoles/RoleForm.js';
import '../design/roles.css';

const RolesPage = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);

    const handleAddRole = () => {
        setSelectedRole(null);
        setIsRoleFormOpen(true);
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setIsRoleFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsRoleFormOpen(false);
    };

    return (
        <div className="roles-page">
            <h1>Manage Roles</h1>
            <button onClick={handleAddRole} className="add-role-button">Add Role</button>
            <RoleList onEdit={handleEditRole} />
            <RoleForm open={isRoleFormOpen} onClose={handleCloseForm} role={selectedRole} />
        </div>
    );
};

export default RolesPage;
