import { layout } from '@ember-decorators/component';
import Component  from '@ember/component';
import { action } from '@ember/object';
import template   from 'ember-railio-form-components/templates/components/paper/check-box';

export default
@layout(template)
class PaperCheckBox extends Component {
  @action
  changed(value) {
    this.updated(value);
  }
}
