import '@testing-library/jest-dom';
import { authReducer } from '../../reducers/authReducer';
import { types } from '../../types/types';

describe('Pruebas en el authReducer', () => {
    const initState = {
        checking: true
    };

    test('Debe retornar el estaod por defecto', () => {
        const state = authReducer(initState, {});
        expect(state).toEqual(initState);
    });

    test('Debe ejecutar el authChekingFinish', () => {
        const state = authReducer(initState, {type: types.authChekingFinish});
        expect(state).toEqual({
            checking: false
        });
    });
});