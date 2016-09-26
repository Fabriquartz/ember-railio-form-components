function fireNativeMouseEvent(eventType, selectorOrDomElement, options = {}) {
  let event = new window.Event(eventType, { bubbles: true, cancelable: true, view: window });
  Object.keys(options).forEach((key) => event[key] = options[key]);
  let target;
  if (typeof selectorOrDomElement === 'string') {
    target = Ember.$(selectorOrDomElement)[0];
  } else {
    target = selectorOrDomElement;
  }
  Ember.run(() => target.dispatchEvent(event));
}

export function getPowerSelect(scope, options = {}) {
  let selector = '.ember-basic-dropdown';
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

export function currentOptions(scope, options = {}) {
  let selector = '.ember-power-select-option[aria-current="true"]';
  if (scope) {
    selector = `${scope} ${selector}`;
  }

  return $(selector);
}
