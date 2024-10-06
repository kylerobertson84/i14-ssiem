// mockApi.js

export const mockApi = {
    // Simulate the fetch roles API (previously added)
    fetchRoles: () => {
        return Promise.resolve([
            { role_id: 1, name: 'Admin' },
            { role_id: 2, name: 'Analyst' },
        ]);
    },

    // Simulate the user creation API (previously added)
    createUser: (userData) => {
        if (userData.email === 'fail@example.com') {
            return Promise.reject(new Error('Failed to create user'));
        }
        return Promise.resolve({ user_id: 1 });
    },

    fetchUsers: jest.fn(() => {
        return Promise.resolve([
            { id: 1, email: 'user1@example.com' },
            { id: 2, email: 'user2@example.com' },
        ]); // Simulating a successful user fetch
    }),

    assignAlert: jest.fn(() => {
        return Promise.resolve({ success: true }); // Simulating successful alert assignment
    }),
};
