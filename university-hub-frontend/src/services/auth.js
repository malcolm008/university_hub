export const auth = {
    login: (email, password) => {
        if (email === 'admin@university.edu' && password === 'admin123') {
            return { role: 'admin', email };
        }
        throw new Error('Invalid credentials');
    },
    logout: () => {}
};