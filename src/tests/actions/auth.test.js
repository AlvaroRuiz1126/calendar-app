import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import * as fethcModule from '../../helpers/fetch';
import { types } from '../../types/types';
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

describe('Pruebas en las acciones del auth', () => {
    beforeEach(() => {
        store = mockStore(initState);
        jest.clearAllMocks();
    });

    test('StartLogin correcto', async () => {
        await store.dispatch(startLogin('email@email.com', '123456'));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

        //para saber las veces que se ha llamado y con que argumentos se ha llamado
        //console.log(localStorage.setItem.mock.calls);
        //se puede extraer el token con el que es llamado
        //token = localStorage.setItem.mock.calls[0][1];
    });
    
    test('startLogin incorrecto', async () => {
        await store.dispatch(startLogin('email@email.com', '1234567'));
        let actions = store.getActions();
        expect(actions).toEqual([]);
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Contraseña Incorrecta', 'error');

        await store.dispatch(startLogin('email@emai1l.com', '1234567'));
        actions = store.getActions();
        expect(Swal.fire).toHaveBeenCalledWith('Error', 'Usuario no existente con el correo', 'error');
    });
    
    test('startRegister correct', async () => {
        fethcModule.fetchWhithoutToken = jest.fn(() => ({
            json(){
                return {
                    ok: true,
                    uid: '123',
                    name: 'Alvaro',
                    token: 'asdfg34353'
                };
            }
        }));
        await store.dispatch(startRegister('email2@email.com', '123456', 'Alvaro'));
        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Alvaro'
            }
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });

    test('StartChecking correcto', async () => {
        fethcModule.fetchWhithToken = jest.fn(() => ({
            json(){
                return {
                    ok: true,
                    uid: '123',
                    name: 'Alvaro',
                    token: 'asdfg34353'
                };
            },
        }));
        await store.dispatch(startChecking());
        const actions = store.getActions();
        //console.log(actions);
        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Alvaro'
            }
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'asdfg34353');
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });
    
});