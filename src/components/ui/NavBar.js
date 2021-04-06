import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';
import { clearEvents } from '../../actions/event';

export const NavBar = () => {
    const dispatch = useDispatch();
    const {name} = useSelector(state => state.auth);

    const handleLogout = () => {
        console.log('Salir');
        dispatch(startLogout());
        dispatch(clearEvents());
    };

    return (
        <div className="navbar navbar-dark bg-dark mb-5">
            <span className="navbar-brand">
                {name}
            </span>

            <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
            >
                <i className="fas fa-sign-out-alt"></i>
                <span> Salir</span>
            </button>
            
        </div>
    )
}
