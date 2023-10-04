import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import LocalStorageContext from 'contexts/localStorage';
import useStateWithRef from 'hooks/useStateWithRef';

const LocalStorageProvider = (props) => {
    const currentStorage = JSON.parse(window.localStorage.getItem('storage') || '{}');
    const [storage, setStorage, storageRef] = useStateWithRef({
        toastie: {},
        serverErrorType: null,
        ...currentStorage,
    });

    const contextValue = useMemo(() => ({
        read: (key, fromState = false) => (
            fromState ? storage[key] : storageRef.current[key]
        ),
        write: (key, value) => {
            const nextState = { ...storageRef.current, [key]: value };

            window.localStorage.setItem('storage', JSON.stringify(nextState));

            setStorage(nextState);
        },
    }), [storage]);

    return (
        <LocalStorageContext.Provider value={contextValue}>
            {props.children(contextValue)}
        </LocalStorageContext.Provider>
    );
};

LocalStorageProvider.propTypes = {
    children: PropTypes.func.isRequired,
};

export default LocalStorageProvider;
