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

**decimals** By how many decimals your number should be rounded. Default is 2.

**keyDown(e)** By default you can use arrow-up and arrow-down to increase/decrease
the number by one. It _won't_ round the number, so it's useable with floats.

**format(value)** Gets the value and formats its, before updating the object. By
default it formats a number with a space as thousands separator and a comma as decimal
separator, like so: '17 009,87'.

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

**format(value)** Gets the value and formats it, before updating the object.
There's no default this function.

