# react-redux-reformed

Forms with React and Redux made simple: start with the bare minimum, no magic, then __use composition__ (components, functions, global and local states) to solve more complex cases. This package has no external dependencies and will have a very little impact on your bundle (< 1.5kB gzipped).

__This package is similar to [react-reformed](https://github.com/davezuko/react-reformed), and I encourage you to look at it and read its README if you don't know it.__

This package contains:
- A reducer factory
- A higher-order component wrapping `connect` (from react-redux package)
- Validation helpers

This package does not contain:
- Components (you can easily create your own form components), whether it is for the web or native
- DOM events handlers and UI elements state management and DOM event handlers (focused, blurred, touched, submitted, etc...): you can choose to include them in your redux store, or simply use local state
- Async validation of input values: again, use state and component composition to solve those more complex problems
- Currently doesn't work with nested objects (will be supported)


## Table of contents

[1. Get started in no time](#get-started-in-no-time)  
[2. API reference](#api-reference)  
[3. Build your own API](#build-your-own-api)  


## Get started in no time

__1. Include your forms in your store__

```js
import { createStore, combineReducers } from 'redux';
import { createFormReducer } from 'react-redux-reformed';

const reducer = combineReducers({
    form: createFormReducer('myForm', { name: '' })
})
```

__2. Bind your form to your store__

```js
import React, { PureComponent } from 'react';
import { connectForm } from 'react-redux-reformed';
import { isRequired } from 'react-redux-reformed/validate';

class MyForm extends PureComponent {
    submitHandler = (evt) => {
        evt.preventDefault();
        // Send the model somewhere
    };
    nameChangeHandler = (evt) => setFormField('name', evt.target.value);

    render() {
        const { model, modelValidity, setFormField, resetForm } = this.props;

        return (
            <form onSubmit={ this.submitHandler }>
                <input name='name' value={ model.name } onChange={ this.nameChangeHandler } />

                <button type='submit' disabled={ !modelValidity.valid }>Submit</button>

                <button type='button' onClick={ resetForm }>Reset</button>
            </form>
        );
    }
}

const formName = 'myForm';
const formSelector = (state) => state.form;
const validators = [
    isRequired('name')
]

export default connectForm(formName, formSelector, validators)(MyForm);
```

And that's it, you have a basic form set up, connected to your redux store and with validation.


## API reference

### createFormReducer(formName: string, initialFormState: object, options: object)

A form reducer can react to 3 types of actions:
- Reset state actions: to reset the state
- Set state actions: to amend the current state
- Replace state actions: to replace the current state

Set and replace work similarly to local state in React (`setState`, `replaceState`).

```js
import { createFormReducer } from 'react-redux-reformed';

const reducer = createFormReducer(
    'myForm',
    { name: '' },
    {
        resetActions: [
            (action) => action.type === 'CREATE_USER_RECEIVE' && !action.error
        ]
    }
);
```

- `formName`: the form name, so the reducer knows if actions can be applied or ignored
- `initialFormState`: to initialise your form
- `options`: see below

Options:

- `resetActions`: a list of actions which can reset your form reducer. The list can contain action types (strings) or functions of actions (returning a boolean). The last one is useful for piggy backing on other actions like successful AJAX requests (see example above).
- `mergeState`: a function to merge state received in `SET_FORM_STATE`. By default, it performs a shallow merge.


### connectForm(formName: string, formSelector: function, validators: array)

```js
import { connectForm } from 'react-redux-reformed';
import { isRequired } from 'react-redux-reformed/validate';

const MyConnectedForm = connectForm(
    'myForm',
    (state) => state.form
)(MyForm);
```

- `formName`: the form name, so the actions can be created with it (and touch the right reducer)
- `formSelector`: so your form can be located (connectForm has no idea where your form is otherwise) 
- `validators`: a list of validation functions, see `validator` function below

The following props will be available:

- `model`: the form object stored in your redux store
- `modelValidity`: if validators are supplied (optional), a validity report is added to the props
- Action creators: `setFormState`, `replaceFormState`, `setFieldState`, `resetFormState`

A model validity looks like the following (don't call one of your fields `valid`):

```js
const modelValidity = {
    valid: false,
    name: {
        valid: true,
        required: true
    },
    email: {
        valid: false,
        require: true,
        email: false
    }
};
```


### validator(fieldName: string, validationFn: function, name: string)

```js
import { validator } from 'react-redux-reformed';

const minLength = (fieldName, min) =>
    validator(
        fieldName,
        (val) => val && val.length >= min,
        'minLength'
    );
```

- `fieldName`: the name of the field being validated
- `validationFn: a function of the field value, returning `true` (if valid) or `false` (if not valid)
- `name`: the validator name. Optional if `validationFn` is named


For reference purposes, a `isRequired` validator is included (but that's the only one). Don't call one of your validators `valid`.


## Build your own API

You might want to compose selectors and actions together in your own `connect` HOC, have validation in a selector or in a separate higher-order component, or simply compose things together differently.

### createModelValidator(...validators)

```js
import { createModelValidator, isRequi } from 'react-redux-reformed/validate';

const validateModel = createModelValidator(isRequired('name'));

validateModel({ name: 'hello' })
// Prints:
{
    valid: true,
    name: {
        valid: true,
        required: true
    }
}
```

### setFormState(formName: string)(state: object)

```js
import { SET_FORM_STATE, setFormState } from 'react-redux-reformed/actions';
```

Action creator for action type `SET_FORM_STATE`.


### setFieldState(formName: string)(fieldName: string, fieldValue: any)

```js
import { SET_FORM_STATE, setFormState } from 'react-redux-reformed/actions';
```

Action creator using `setFormState` action creator.


### replaceFormState(formName: string)(state: object)

```js
import { REPLACE_FORM_STATE, replaceFormState } from 'react-redux-reformed/actions';
```

Action creator for action type `REPLACE_FORM_STATE`.


### resetFormState(formName: string)(state: object)

```js
import { RESET_FORM_STATE, resetFormState } from 'react-redux-reformed/actions';
```

Action creator for action type `RESET_FORM_STATE`.
