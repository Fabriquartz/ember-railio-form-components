# Paper-form-field
Paper-form-field is a variant of the default form-field, using ember-paper for
Google's Material Design-like form fields. The following sections describe how the
paper-form-field component works and what options you can pass to it.

## Usage
```handlebars
{{paper-form-field type="text-area"
                   object=movie
                   propertyPath="description"
                   options=options
                   updated=(action "update")
                   disabled=locked}}
```


## Options
Options is an object that can contain attributes and methods. Every attribute and
method will be added to the ember-paper component. This can be used to reach built-in
functionality of the underlying ember-paper components or to add/overwrite event handlers.

## htmlAttributes
If you want to pass attributes to the actual html element that the form field renders,
you can add 'htmlAttributes' to the options object. This object can contain things
like placeholder, name of maxlength. You can read the ember-paper documentation
for more information.

## Available types

The following paper form field types are available.

### number-field

Renders an HTML input[type="text"] element, wrapped by a component with attributes,
event handlers and build-in methods. You can overwrite them by passing attributes/methods
as options, as described above. Possible attributes and methods for this field include:

**lazy** Whether the value only should be updated after focusOut (instead of
after every keypress). Default is true

**decimals** By how many decimals your number should be rounded. There's no default.

**keyDown(e)** By default you can use arrow-up and arrow-down to increase/decrease
the number by one. It _won't_ round the number, so it's useable with floats.

**format(value)** Gets the value and formats it (only for displaying). By
default it formats a number with a space as thousands separator and a comma as decimal
separator, like so: '17 009,87'.

**serialize(value)** Gets the value and formats it before the actual value is
updated. By default it formats a number to an actual float. So, '17 009,87' becomes
'17009.87'.

#### Example

```javascript
options: {
  decimals: 0

  htmlAttributes: {
    minValue: 0
    maxValue: 99
  }
}

```

```hbs
{{paper-form-field type="number-field"
                   object=bakery
                   propertyPath="baguettes"
                   options=options
                   updated=(action "update")
                   disabled=locked}}
```


### text-field
Renders an HTML input[type="text"] element, wrapped by a component with attributes,
event handlers and build-in methods. You can overwrite them by passing attributes/methods
as options, as described above. Possible attributes and methods for this field include:

**lazy** Whether the value only should be updated after focusOut (instead of after
every keypress). Default is true

**keyUp(e)** Gives you the ability to pass an enter or escape function.

**enter()** You can pass a function called enter, that will be executed everytime you
press the enter key. There's no default for this function.

**escape()** You can pass a function called escape, that will be executed everytime
you press the escape key. There's no default for this function.

**format(value)** Gets the value and formats it (only for displaying). There's no
default function.

**serialize(value)** Gets the value and formats it before the actual value is
updated. There's no default function.

### check-box
It renders a md-checkbox, which is actually _not_ a HTML input[type="checkbox"] element.
This checkbox kan toggle a boolean and does not need any specific attributes. There're
no attributes or methods to overwrite.

### radio-group
It renders a md-radio-group, including a md-radio-button for each given option. It does
_not_ render an actual HTML input[type="radio"] element. There are no attributes or
methods to override. Possible attributes and methods for this field include:

**options (required)** This array can contain number, strings or objects. If you have an array
of objects, you need te pass a labelPropertyPath too.

**labelPropertyPath** If the options contain objects, you have to pass a propertyPath as string
to tell which attribute of the object should be displayed as the label of the option.

### Auto-complete
Renders an md-autocomplete that contains a ember-power-select.

**multiSelect** If you want to select more than one option, you can pass true. It will
render the 'paper-chips' component instead of the 'paper-autocomplete' component. The
default is false.

**enableSelectAll** You can display a 'select all' and 'deselect all' button by passing
true. The default is false. Only works when 'multiSelect' is enabled.

**allowClear** Whether the button to clear the input field should be available or not.
Default is true.

**readOnly** A boolean that can disable the autocomplete to make it a read only.
Default is false.

**required** Display an astrix after the label when true. It's not possible to display
an error message when the input field is empty. Default is false.

**options (required)** An array that contains objects.

**searchPath (required)** You have to pass a propertyPath as string to tell on which
attribute you want to search.

**labelPropertyPath (required)** You have to pass a propertyPath as string to tell
which attribute of the object should be displayed as the label of the option.

**doubleClickItem(value)** This action will be called after a doublick on an option.
There's no default function.

