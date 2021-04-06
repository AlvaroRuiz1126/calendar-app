import React, { useEffect } from 'react';
import { LoginScreen } from '../auth/LoginScreen';
import { CalendarScreen } from '../calendar/CalendarScreen';
import { useDispatch, useSelector } from 'react-redux';
import { startChecking } from '../../actions/auth';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { PublicRouter } from './PublicRouter';
import { PrivateRouter } from './PrivateRouter';

export const AppRouter = () => {
    //aca nos aseguramos si el token sigue siendo valida para ver si el usuario esta autenticado o no
    const dispatch = useDispatch();
    const {checking, uid} = useSelector(state => state.auth);
    //console.log(checking);

    useEffect(() => {
        dispatch(startChecking());
    }, [dispatch]);

    if(checking){
        return (<h5>Espere...</h5>);
    }

    return (
        <Router>
            <div>
                <Switch>
                    <PublicRouter
                        exact
                        path="/login"
                        component={LoginScreen}
                        isAuthenticated={!!uid}
                    />
                    <PrivateRouter
                        exact
                        path="/"
                        component={CalendarScreen}
                        isAuthenticated={!!uid}
                    />
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    );
};
