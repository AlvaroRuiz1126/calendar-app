import Swal from "sweetalert2";
import { fetchWhithToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = (event) => {
    return async(dispatch, getState) => {
        //console.log(event);
        const {uid, name} = getState().auth;
        try {
            const resp = await fetchWhithToken('events', event, 'POST');
            const body = await resp.json();
            console.log(body);
            
            if(body.ok){
                event.id = body.event.id
                event.user = {
                    _id: uid,
                    name
                };

                console.log(event);
                dispatch(eventAddNew(event));
                dispatch(eventStartLoading());
            }

        } catch (error) {
            console.log(error);
        }
    };
};

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
});

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent
});

export const eventStartUpdated = (event) => {
    return async(dispatch) => {
        //console.log(event);
        try {
            const resp = await fetchWhithToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();

            if(body.ok){
                dispatch(updated(event));
            }else{
                Swal.fire('Error', body.msg, 'error');
            }
            
        } catch (error) {
            console.log(error);
        }
    };
};

const updated = (event) => ({
    type: types.eventUpdated,
    payload: event
});

export const eventStartDelete = (event) => {
    return async(dispatch, getState) => {
        const {id} = getState().calendar.activeEvent
        try {
            const resp = await fetchWhithToken(`events/${id}`, {}, 'DELETE');
            const body = await resp.json();
            
            if(body.ok){
                dispatch(eventDeleted());
            }else{
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            console.log(error);
        }


    };
};

const eventDeleted = () => ({
    type: types.eventDeleted
});

export const eventStartLoading = () => {
    return async(dispatch) => {
        const resp = await fetchWhithToken('events');
        const body = await resp.json();
        //console.log(body);

        const events = prepareEvents(body.events);
        console.log(events);

        //dispatch(eventLoaded(body.events));
        dispatch(eventLoaded(events));
    };
};

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});

export const clearEvents = () => ({type: types.eventLogout});