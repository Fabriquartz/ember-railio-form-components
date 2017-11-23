import run from 'ember-runloop';
import $   from 'jquery';

function fireNativeMouseEvent(eventType, selectorOrDomElement, options = {}) {
  let eventOptions = { bubbles: true, cancelable: true, view: window };
  let event        = new window.Event(eventType, eventOptions);

  Object.keys(options).forEach((key) => event[key] = options[key]);
  let target;
  if (typeof selectorOrDomElement === 'string') {
    target = $(selectorOrDomElement)[0];
  } else {
    target = selectorOrDomElement;
  }
  run(() => target.dispatchEvent(event));
}

export function getPowerSelect(scope) {
  let selector = '.ember-basic-dropdown';
  if (scope) {
    selector = `${scope} ${selector}`;
  }

  return $(selector);
}

export function getSelected(scope) {
  let selector = '.ember-power-select-selected-item';
  if (scope) {
    selector = `${scope} ${selector}`;
  }

  return $(selector);
}

export function getClearButton(scope) {
  let selector = '.ember-power-select-clear-btn';
  if (scope) {
    selector = `${scope} ${selector}`;
  }

  return $(selector);
}

export function getMultipleTrigger(scope) {
  let selector = '.ember-power-select-multiple-trigger';
  if (scope) {
    selector = `${scope} ${selector}`;
  }

  return $(selector);
}

export function clickTrigger(scope, options = {}) {
  let selector = '.ember-power-select-trigger';
  if (scope) {
    selector = `${scope} ${selector}`;
  }
  fireNativeMouseEvent('mousedown', selector, options);
}

export function clickItem(eqValue, options = {}) {
  let selector = '.ember-power-select-option';
  if (eqValue) {
    selector = `${selector}:eq(${eqValue})`;
  }
  fireNativeMouseEvent('mouseup', selector, options);
}

export function currentOptions(scope) {
  let selector = '.ember-power-select-option[aria-current="true"]';
  if (scope) {
    selector = `${scope} ${selector}`;
  }

  return $(selector);
}
