import { useContext } from 'react';
import AuthContext from 'contexts/auth';

export default () => {
    const authType = useContext(AuthContext);

    return { authType };
};
