import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdated } from '../../actions/event';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

if(process.env.NODE_ENV !== 'test'){
  //el id appElement es el root del index.js
  Modal.setAppElement('#root');
}

const startDate = moment().minutes(0).seconds(0).add(1, 'hours');
const endDate = startDate.clone().add(1, 'hours');

const initEvent = {
  title: '',
  notes: '',
  start: startDate.toDate(),
  end: endDate.toDate()
};

export const CalendarModal = ({modalOpen}) => {
  const dispatch = useDispatch();
  const {activeEvent} = useSelector(state => state.calendar)
  const [dateStart, setDateStart] = useState(startDate.toDate());
  const [dateEnd, setDateEnd] = useState(endDate.toDate());
  //const [isOpen, setIsOpen] = useState(false);
  const [titleValid, setTitleValid] = useState(true);
  const [formValues, setFormValues] = useState(initEvent);

  const { title, notes, start, end } = formValues;

  useEffect(() => {
    if(activeEvent !== null){
      setFormValues(activeEvent);
    }else{
      setFormValues(initEvent);
    }
  }, [activeEvent, setFormValues]);

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  };


  const closeModal = () => {
    console.log('closing...');
    //setIsOpen(false);
    dispatch(uiCloseModal());
    setFormValues(initEvent);
    dispatch(eventClearActiveEvent());
  };

  const handleStartDateChange = (e) => {
    console.log(e);
    setDateStart(e);
    setFormValues({
      ...formValues,
      start: e
    });
  };

  const handleEndDateChange = (e) => {
    console.log(e);
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    //console.log(formValues);
    //pasamos las fechas a un formato de moment para usar las funciones de comparaciones de fechas de la libreria
    const momentStart = moment(start);
    const momentEnd = moment(end);

    //validacion de que la fecha final sea mayor que la inicial
    if(momentStart.isSameOrAfter(momentEnd)){
      //console.log('Fecha end debe ser mayor');
      return Swal.fire('Error', 'La fecha de finalización debe ser mayor a la fecha de inicio', 'error');
    }

    if(title.trim().length < 2){
      return setTitleValid(false);
    }

    //preguntamos si hay una nota activa ya que ahi tenemos toda la informacion almacenada, y los datos nuevos se encontraran en el formValues
    if(activeEvent){
      dispatch(eventStartUpdated(formValues));
    }else{
      //Para agregar un nuevo evento
      dispatch(eventStartAddNew({
        ...formValues
        //no se envian los siguientes datos por lo que esos vienen de la base de datos
        // id: new Date().getTime(),
        // user: {
        //   _id: '123',
        //   name: 'Alvaro'
        // }
      }));
    }


    //si pasa la validacion entonces el el titulo es valido y deja la caja en verde, luego se llama la funcion closeModal()
    //para cerrar el modal
    setTitleValid(true);
    closeModal();
  };

  return (
    <Modal
      isOpen={modalOpen}
      //   onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      //añade estilos para centrar el modal
      style={customStyles}
      //hace de fadeout para que no haya un cierre tan brusco del modal
      closeTimeoutMS={200}
      className="modal"
      //una clase para el fondo detras del modal
      overlayClassName="modal-fondo"
      contentLabel="Example Modal"
      ariaHideApp={!process.env.NODE_ENV === 'test'}
    >
      <h1> {(activeEvent) ? 'Editar Evento' : 'Nuevo Evento'} </h1>
      <hr />
      <form 
        className="container"
        onSubmit={handleSubmitForm}
      >

        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={dateStart}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndDateChange}
            value={dateEnd}
            minDate={dateStart}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid'}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={title}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>

      </form>
    </Modal>
  );
};
