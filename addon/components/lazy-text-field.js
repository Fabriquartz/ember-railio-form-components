import { attribute }        from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { run }              from '@ember/runloop';
import TextField            from 'ember-railio-form-components/components/text-field';

export default class LazyTextField extends TextField {
  focusIn() {
    this.set('isFocused', true);
    super.focusIn(...arguments);
  }

  focusOut() {
    this.set('isFocused', false);
    super.focusOut(...arguments);
  }

  withLazyDisabled(callback) {
    let originalFocus = this.get('isFocused');
    this.set('isFocused', false);

    callback.call(this);

    run.next(() => this.set('isFocused', originalFocus));
  }

  @attribute('value')
  @computed('_value', 'lostFocus')
  get _lazyValue() {
    if (!this.get('isFocused')) {
      return this.get('_value');
    }
    return '';
  }

  @action
  changed() {
    if (!this.get('isFocused')) {
      super.changed(...arguments);
    }
  }
}
