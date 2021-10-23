import '@testing-library/jest-dom';
import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/event';
import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';
jest.mock('../../../actions/event', () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn()
}));
Storage.prototype.setItem = jest.fn();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initState = {
    calendar: {
        events: []
    },
    ui: {
        modalOpen: false
    },
    auth: {
        uid: '123',
        name: 'Alvaro'
    }
};
const store = mockStore(initState);
store.dispatch = jest.fn();
const wrapper = mount(
    <Provider store={store}>
        <CalendarScreen />
    </Provider>
);

describe('Pruebas en el componente CalendarScreen', () => {
    test('Debe mostrar el componente correctamente', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('Pruebas con las interacciones del calendario', () => {
        const calendar = wrapper.find('Calendar');
        const calendarMessages = calendar.prop('messages');
        //configuracion de los mensajes en espeañol
        expect(calendarMessages).toEqual(messages);
        calendar.prop('onDoubleClick')();
        expect(store.dispatch).toHaveBeenCalledWith({type: types.uiOpenModal});

        calendar.prop('onSelectEvent')({
            start: 'Hola'
        });
        expect(eventSetActive).toHaveBeenCalledWith({
            start: 'Hola'
        });

        act(() => {
            calendar.prop('onView')('week');
            expect(localStorage.setItem).toHaveBeenCalledWith('lastView', 'week');
        });
    });
});