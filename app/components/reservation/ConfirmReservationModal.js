import pick from 'lodash/object/pick';
import camelCase from 'lodash/string/camelCase';
import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import CompactReservationsList from 'components/common/CompactReservationsList';
import constants from 'constants/AppConstants';
import ReservationForm from 'containers/ReservationForm';
import { isStaffEvent } from 'utils/DataUtils';

class ConfirmReservationModal extends Component {
  constructor(props) {
    super(props);
    this.getFormFields = this.getFormFields.bind(this);
    this.getFormInitialValues = this.getFormInitialValues.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.renderIntroTexts = this.renderIntroTexts.bind(this);
  }

  onConfirm(values) {
    const { onClose, onConfirm } = this.props;
    onClose();
    onConfirm(values);
  }

  getFormFields() {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    const formFields = [];
    if (resource.needManualConfirmation) {
      formFields.push(...constants.RESERVATION_FORM_FIELDS);
    }

    if (isAdmin) {
      formFields.push('comments');
    }
    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    return formFields;
  }

  getFormInitialValues() {
    const {
      isEditing,
      reservationsToEdit,
      resource,
      selectedReservations,
    } = this.props;
    let reservation;

    if (isEditing) {
      reservation = reservationsToEdit.length ? reservationsToEdit[0] : null;
    } else {
      reservation = selectedReservations.length ? selectedReservations[0] : null;
    }

    let rv = reservation ?
      pick(reservation, ['comments', ...constants.RESERVATION_FORM_FIELDS]) :
      {};
    if (isEditing) {
      rv = Object.assign(rv, { staffEvent: isStaffEvent(reservation, resource) });
    }
    return rv;
  }

  getModalTitle(isEditing, isPreliminaryReservation) {
    if (isEditing) {
      return 'Muutosten vahvistus';
    }
    if (isPreliminaryReservation) {
      return 'Alustava varaus';
    }
    return 'Varauksen vahvistus';
  }

  renderIntroTexts() {
    const {
      isEditing,
      isPreliminaryReservation,
      reservationsToEdit,
      selectedReservations,
    } = this.props;

    if (isEditing) {
      return (
        <div>
          <p><strong>Oletko varma että haluat muuttaa varaustasi?</strong></p>
          <p>Ennen muutoksia:</p>
          <CompactReservationsList reservations={reservationsToEdit} />
          <p>Muutosten jälkeen:</p>
          <CompactReservationsList reservations={selectedReservations} />
        </div>
      );
    }

    let helpText;

    if (isPreliminaryReservation) {
      helpText = selectedReservations.length === 1 ?
        'Olet tekemässä alustavaa varausta ajalle:' :
        'Olet tekemässä alustavaa varausta ajoille:';
    } else {
      helpText = selectedReservations.length === 1 ?
        'Oletko varma että haluat tehdä varauksen ajalle:' :
        'Oletko varma että haluat tehdä varaukset ajoille:';
    }

    return (
      <div>
        <p><strong>{helpText}</strong></p>
        <CompactReservationsList reservations={selectedReservations} />
        {isPreliminaryReservation && (
          <div>
            <p>
              Huomioi, että  tilan käyttö voi olla maksullista. Tarkemmat hintatiedot löytyvät
              tilan tiedoista. Varaus on alustava ja käsitellään kahden arkipäivän kuluessa.
            </p>
            <p>
              Täytä vielä seuraavat tiedot alustavaa varausta varten.
              Tähdellä (*) merkityt tiedot ovat pakollisia.
            </p>
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      isPreliminaryReservation,
      onClose,
      resource,
      show,
    } = this.props;

    const requiredFormFields = resource.requiredReservationExtraFields.map((field) => {
      return camelCase(field);
    });

    return (
      <Modal
        animation={false}
        className="confirm-reservation-modal"
        onHide={onClose}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.getModalTitle(isEditing, isPreliminaryReservation)}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderIntroTexts()}
          <ReservationForm
            fields={this.getFormFields()}
            initialValues={this.getFormInitialValues()}
            isMakingReservations={isMakingReservations}
            onClose={onClose}
            onConfirm={this.onConfirm}
            requiredFields={requiredFormFields}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

ConfirmReservationModal.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  isPreliminaryReservation: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  reservationsToEdit: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  selectedReservations: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmReservationModal;
