import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { NavBar } from '../ui/NavBar';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/event';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

const localizer = momentLocalizer(moment); // or globalizeLocalizer

//estos son los eventos que e le mandan a Calendar para que se visualicen. Cumplen con la sgte estructura
// const events = [{
//     title: 'Cumpleaños mio',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgcolor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Alvaro'
//     }
// }];


export const CalendarScreen = () => {
    const dispatch = useDispatch();
    const {events, activeEvent} = useSelector(state => state.calendar);
    const {modalOpen} = useSelector(state => state.ui);
    const {uid} = useSelector(state => state.auth)
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch(eventStartLoading());
    }, [dispatch])

    const onDoubleClick = (e) => {
        //imprime el evento que ocurre cuando se le da doble click sobre el evento en el calendario
        //console.log(e);
        console.log('Abriendo Modal');
        dispatch(uiOpenModal());
    };

    const onSelectEvent = (e) => {
        //el evento se dispara cuando se le da un solo click al evento de calendario
        //console.log(e);
        dispatch(eventSetActive(e));
        //dispatch(uiOpenModal());
    };

    const onViewChange = (e) => {
        //el evento se dispara cuando se cambia de ventana (semana, dia, mes, año)
        console.log(e);
        setLastView(e);
        localStorage.setItem('lastView', e);
        console.log(lastView);
    };

    const onSelectSlot = (e) => {
        console.log(e);
        dispatch(eventClearActiveEvent());
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: (uid === event.user._id) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
        };

        return {style};
    };

    return (
        <div className="calendar-screen">
            <NavBar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                //se necesita para llamar al onSelectSlot
                selectable={true}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}
            />

            <CalendarModal modalOpen={modalOpen} />

            <AddNewFab />
            { (activeEvent) && <DeleteEventFab /> }
        </div>
    );
};
