# Ember-railio-form-components

An Ember addon for data-down/action-up based form-fields for (Ember) objects. By installing this addon, you can use the form-field component to add form-fields that can be used on data-down / action-up.

If you want to use our paper form fields, you install the addon as described below. [Click here](../master/paper-form-components) for
the documentation.

## Install

In your application's directory:

```sh
$ ember install ember-railio-form-components
```

## Available types

The form-field component can be used directly with some build-in types:

- text-area
- text-field
- lazy-text-field
- number-field
- check-box
- date-time-field

#### text-area

#### text-field

#### lazy-text-field

Is like a normal text-field, but calls the update function not on each change / keydown, but only on pressing enter or leaving the input.

#### number-field

Is a lazy-text-field, but only accepts numeric values. You'll be able to use the arrow-up and arrow-down key to increase or decrease the value. 

#### check-box

Indicates a boolean value, so can only be false or true.

#### date-time-field

Needs a datetime as a value, and uses a datepicker for selecting the date. Also you are able to set the current datetime and empty the value.

#### file-input

Button that opens a file dialog, and uses an `EmberArray` containing the files selected by the user (as native [`File`](https://developer.mozilla.org/docs/Web/API/File) objects) as a value.

Unlike the other fields this field does not show an initial value, as it can only handle files after the user selects them in a browser dialog (its behaviour mimics that of an `HTMLInputElement` with `type=file`)

Available options: 
 - multiple: true/false, wether or not the user should be able to select multiple files, defaults to `false`
 - type: string, used in labels and to infer accepted files, defaults to `'file'`
 - accept: [unique file type specifier](https://developer.mozilla.org//docs/Web/HTML/Element/input/file#Unique_file_type_specifiers), accepted file type(s) (automatically inferred from `type` when it is one of image, video or audio) defaults to `'*/*'`
 - iconComponent: string, name of the component to use to render an icon in the button, defaults to 'fa-icon'
 - iconName: string, name passed to the icon component, defaults to `'upload'`

#### Components for use with block-form

Other form-components that are need to be used with the block-form:

- auto-complete
- select-auto-complete
- radio-select

By using the block-form you could use your own written components when they have a 'value' and call the update action for using data-down/action-up.

## Basic usage

Because the form-field component is build for using data-down/action-up, you need to have an action in your project that handles the changes. So in your project's component, you need an update action. This way you have your data handling on just one place, so when you want to do something on each change, like a validation, you are able to put this on just one location in your code. 

```js
actions: {
  update(object, propertyPath, newValue) {
    Ember.set(object, propertyPath, newValue);
  }
}
```

The form-field component can be used by calling it with the wanted field type. In your Handlebars templates:

```handlebars
{{form-field type="text-area"
             object=movie
             propertyPath="description"
             updated=(action "update")
             disabled=locked}}
```

On each change of the value, the updated action is called with the new value. 

## Block-form usage

You could use the block-form usage of the form-field component with components that are not directly usable of if you need to add more information to the used component.

```handlebars
{{#form-field object=movie
              propertyPath="description"
              updated=(action "update")
              disabled=locked
              as |value updated disabled|}}
  {{text-area value=value
              updated=updated
              disabled=disabled}}
{{/form-field}}
```

## Using your own components

You can use your own components by using the form-field component in block form, like shown above.

