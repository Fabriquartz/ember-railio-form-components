import { tagName, classNames } from '@ember-decorators/component';
import TextInput               from 'ember-railio-form-components/components/text-input';
import formFieldOptions        from 'ember-railio-form-components/mixins/form-field-options';

export default
@tagName('input')
@classNames('text-field')
class TextField extends TextInput.extend(formFieldOptions) {}
