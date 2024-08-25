import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import '../../design/roles.css'; // 

const RoleForm = ({ open, onClose, role }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (role) {
            setName(role.name);
        } else {
            setName('');
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (role) {
                await axios.put(`/roles/${role.role_id}/`, { name });
            } else {
                await axios.post('/roles/', { name });
            }
            onClose(); // Close the form after saving
        } catch (error) {
            console.error('Failed to save role:', error);
        }
    };

    if (!open) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{role ? 'Edit Role' : 'Add Role'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Role Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength="20"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel">
                            Cancel
                        </button>
                        <button type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleForm;
