import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, useHistory } from 'react-router-dom';

const PrivateRoute = (props) => {
    const history = useHistory();

    useEffect(() => {
        if (!props.allowAccess()) {
            history.push(props.fallback);

            if (props.withReload) {
                window.location.reload();
            }
        }
    });

    if (!props.allowAccess()) {
        return null;
    }

    return (
        <Route {...props} />
    );
};

PrivateRoute.defaultProps = {
    withReload: false,
};

PrivateRoute.propTypes = {
    allowAccess: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    fallback: PropTypes.string.isRequired,
    withReload: PropTypes.bool,
};

export default PrivateRoute;
