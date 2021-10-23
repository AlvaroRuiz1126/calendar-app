import '@testing-library/jest-dom';
import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { AppRouter } from '../../../components/router/AppRouter';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Pruebas en AppRouter', () => {
    test('Debe mostrar el Espere...', () => {
        const initState = {
            auth: {
                checking: true
            }
        };
        const store = mockStore(initState);
        store.dispatch = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();
    });
    
    test('Debe mostrar la ruta pública', () => {
        const initState = {
            auth: {
                uid: null,
                checking: false
            }
        };
        const store = mockStore(initState);
        store.dispatch = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('.login-container').exists()).toBe(true);
    });

    test('Debe mostrar la ruta privada', () => {
        const initState = {
            ui: {
                modalOpen: false
            },
            calendar: {
                events: []
            },
            auth: {
                uid: '123',
                checking: false,
                name: 'Alvaro'
            }
        };
        const store = mockStore(initState);
        store.dispatch = jest.fn();
        const wrapper = mount(
            <Provider store={store}>
                <AppRouter />
            </Provider>
        );

        //expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('.calendar-screen').exists()).toBe(true);
    });
});