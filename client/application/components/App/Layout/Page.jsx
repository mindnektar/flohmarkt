import React from 'react';
import { Switch, Route } from 'react-router-dom';
import useAuth, { AUTH_TYPE_ADMIN, AUTH_TYPE_VENDOR } from 'hooks/useAuth';
import PrivateRoute from 'PrivateRoute';
import Home from './Page/Home';
import Markets from './Page/Markets';
import Admins from './Page/Admins';

const Page = () => {
    const { authType } = useAuth();

    return (
        <div className="page">
            <Switch>
                <PrivateRoute
                    allowAccess={() => authType === AUTH_TYPE_VENDOR || authType === AUTH_TYPE_ADMIN}
                    fallback="/"
                    path="/vendor"
                >
                    <div />
                </PrivateRoute>

                <PrivateRoute
                    allowAccess={() => authType === AUTH_TYPE_ADMIN}
                    fallback="/"
                    path="/admin"
                >
                    <Switch>
                        <Route
                            component={Markets}
                            path="/admin/markets"
                        />

                        <Route
                            component={Admins}
                            path="/admin/admins"
                        />
                    </Switch>
                </PrivateRoute>

                <Route
                    component={Home}
                    path="/"
                />
            </Switch>
        </div>
    );
};

export default Page;
