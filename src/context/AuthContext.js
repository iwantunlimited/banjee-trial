import React from 'react';

const AuthContext = React.createContext({
    data : {},
    setData : () => {}
});

export default AuthContext;