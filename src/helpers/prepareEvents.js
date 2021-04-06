import moment from 'moment';

//funcion para pasar de string a fechas
export const prepareEvents = (events = []) => {
    return events.map(
        (event) => ({
            ...event,
            //con esa instancia moment convierte un string a formato de fecha
            end: moment(event.end).toDate(),
            start: moment(event.start).toDate()
        })
    )
};