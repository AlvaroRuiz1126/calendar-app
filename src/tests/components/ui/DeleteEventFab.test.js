import '@testing-library/jest-dom';
import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { mount } from 'enzyme';
import { eventStartDelete } from '../../../actions/event';
jest.mock('../../../actions/event', () => ({
    eventStartDelete: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {};
const store = mockStore(initState);
store.dispatch = jest.fn();
const wrapper = mount(
    <Provider store={store}>
        <DeleteEventFab />
    </Provider>
);

describe('Pruebas en el componente DeleteEventFab', () => {
    test('Debe mostrar el componente correctamente', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('Debe llamar el event startDelete cuando se de click en el botón', () => {
        wrapper.find('button').prop('onClick')();
        
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(eventStartDelete).toHaveBeenCalled();
    });
});