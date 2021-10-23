import '@testing-library/jest-dom';
import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartUpdated, eventStartAddNew } from '../../../actions/event';
import moment from 'moment';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';
jest.mock('../../../actions/event', () => ({
    eventStartUpdated: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn(),
}));
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));
Storage.prototype.setItem = jest.fn();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const startDate = moment().minutes(0).seconds(0).add(1, 'hours');
const endDate = startDate.clone().add(1, 'hours');
const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hola Mundo',
            notes: 'Algunas notas',
            start: startDate.toDate(),
            end: endDate.toDate()
        }
    },
    ui: {
        modalOpen: true
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
        <CalendarModal modalOpen={initState.ui.modalOpen} />
    </Provider>
);

describe('Pruebas en el CalendarModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe mostrar el componente correctamente', () => {
        //expect(wrapper.find('.modal').exists()).toBe(true);
        expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
    });

    test('Debe llamar la acción de actualizar y cerrar el modal', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(eventStartUpdated).toHaveBeenCalledWith(initState.calendar.activeEvent);
        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test('Debe mostrar error si falta el título', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);
    });

    test('Debe crear un nuevo evento', () => {
        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            ui: {
                modalOpen: true
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
                <CalendarModal modalOpen={initState.ui.modalOpen} />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        });
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(eventStartAddNew).toHaveBeenCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: 'Hola pruebas',
            notes: ''
        });
        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test('Debe validar las fechas', () => {
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        });
        const today = new Date();

        act(() => {
            wrapper.find('DateTimePicker').at(1).prop('onChange')(today);
        });

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(Swal.fire).toHaveBeenCalledWith('Error', 'La fecha de finalización debe ser mayor a la fecha de inicio', 'error');
    });
});