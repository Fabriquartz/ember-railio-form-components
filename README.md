# Ember-railio-form-components

An Ember addon for data-down/action-up based form-fields for (Ember) objects. By installing this addon, you can use the form-field component to add form-fields that can be used on data-down / action-up.

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



## Using your own components

