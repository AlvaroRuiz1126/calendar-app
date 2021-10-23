import Swal from "sweetalert2";
import { fetchWhithoutToken, fetchWhithToken } from "../helpers/fetch";
import { types } from "../types/types";

export const startLogin = (email, password) => {
    return async(dispatch) => {
        //console.log(email, password);
        const resp = await fetchWhithoutToken('auth', {email, password}, 'POST');
        const body = await resp.json();
        //console.log(body);

        if(body.ok){
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(login({
                uid: body.uid,
                name: body.name
            }));
        }else{
            Swal.fire('Error', body.msg, 'error');
        }
    };
};

export const startRegister = (email, password, name) => {
    return async(dispatch) => {
        const resp = await fetchWhithoutToken('auth/new', {email, password, name}, 'POST');
        const body = await resp.json();
        //console.log(body);

        if(body.ok){
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(login({
                uid: body.uid,
                name: body.name
            }));
        }else{
            Swal.fire('Error', body.msg, 'error');
        }
    };
};

export const startChecking = () => {
    return async(dispatch) => {
        const resp = await fetchWhithToken('auth/renew');
        const body = await resp.json();
        //console.log(body);

        if(body.ok){
            localStorage.setItem('token', body.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(login({
                uid: body.uid,
                name: body.name
            }));
        }else{
            //Swal.fire('Error', body.msg, 'error');
            dispatch(checkCheckingFinish());
        }

    };
};

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch(logout());
    };
}

const login = (user) => ({
    type: types.authLogin,
    payload: user
});

const checkCheckingFinish = () => ({
    type: types.authChekingFinish
});

const logout = () => ({type: types.authLogout});