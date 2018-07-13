import run               from 'ember-runloop';
import $                 from 'jquery';
import { click, fillIn } from '@ember/test-helpers';

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

export async function clickTrigger(scope, options = {}) {
  let selector = '.ember-power-select-trigger';
  if (scope) {
    selector = `${scope} ${selector}`;
  }
  return click(selector, options);
}

export async function clickItem(eqValue, options = {}) {
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

export function typeInSearch(scopeOrText, text) {
  let scope = '';

  if (typeof text === 'undefined') {
    text = scopeOrText;
  } else {
    scope = scopeOrText;
  }

  let selectors = [
    '.ember-power-select-search-input',
    '.ember-power-select-search input',
    '.ember-power-select-trigger-multiple-input',
    'input[type="search"]'
  ].map((selector) => `${scope} ${selector}`).join(', ');

  return fillIn(selectors, text);
}
