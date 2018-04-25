import { expect } from 'chai';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import { Calendar } from 'react-date-picker';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import DatePickerControl from './DatePickerControl';
import SearchControlOverlay from './SearchControlOverlay';

const defaults = {
  onConfirm: () => null,
  value: '01.01.2017',
};
function getWrapper(props) {
  return shallowWithIntl(<DatePickerControl {...defaults} {...props} />);
}

describe('pages/search/controls/DatePickerControl', () => {
  it('renders a div.app-DatePickerControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-DatePickerControl')).to.be.true;
  });

  it('renders ControlLabel with correct text', () => {
    const wrapper = getWrapper();
    const controlLabel = wrapper.find(ControlLabel);
    expect(controlLabel).to.have.length(1);
  });

  it('renders FormGroup with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const formGroup = wrapper.find(FormGroup);
    expect(formGroup).to.have.length(1);
    expect(formGroup.prop('onClick')).to.equal(instance.showOverlay);
  });

  it('renders FormControl with correct props', () => {
    const wrapper = getWrapper();
    const formControl = wrapper.find(FormControl);
    expect(formControl).to.have.length(1);
    expect(formControl.prop('disabled')).to.be.true;
    expect(formControl.prop('type')).to.equal('text');
    expect(formControl.prop('value')).to.equal(defaults.value);
  });

  it('renders Overlay with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const overlay = wrapper.find(Overlay);
    expect(overlay).to.have.length(1);
    expect(overlay.prop('container')).to.equal(instance);
    expect(overlay.prop('onHide')).to.equal(instance.hideOverlay);
    expect(overlay.prop('placement')).to.equal('bottom');
    expect(overlay.prop('rootClose')).to.be.true;
    expect(overlay.prop('show')).to.equal(instance.state.visible);
  });

  it('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const controlOverlay = wrapper.find(SearchControlOverlay);
    expect(controlOverlay).to.have.length(1);
    expect(controlOverlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
    expect(controlOverlay.prop('title')).to.equal('DatePickerControl.header');
  });

  it('renders calendar for selecting date', () => {
    const wrapper = getWrapper();
    const calendar = wrapper.find(Calendar);
    expect(calendar).to.have.length(1);
    expect(calendar.prop('dateFormat')).to.equal('L');
    expect(calendar.prop('defaultDate')).to.equal(defaults.value);
    expect(calendar.prop('onChange')).to.equal(wrapper.instance().handleConfirm);
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = '12.12.2017';
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });

    it('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).to.equal(1);
      simple.restore();
    });
  });

  describe('hideOverlay', () => {
    it('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('showOverlay', () => {
    it('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).to.be.true;
    });
  });
});
