import { createStore, combineReducers } from 'redux';
import { expect } from 'chai';
import { createFormReducer, validator } from '../src';
import { createModelValidator, isRequired } from '../src/validate';
import * as actions from '../src/actions';

describe('react-redux-reformed', () => {
    describe('createFormReducer', () => {
        const formInitialState = { name: 'default' };
        const store = createStore(combineReducers({
            form: createFormReducer('myForm', formInitialState, { resetActions: [ 'RESET' ]})
        }));

        context('when receiving actions for itself', () => {
            it('should set the form state', () => {
                const action = actions.setFormState('myForm')({ email: 'react@redux.reformed' });

                store.dispatch(action);
                expect(store.getState().form).to.eql({
                    name: 'default',
                    email: 'react@redux.reformed'
                });
            });

            it('should replace the form state', () => {
                const action = actions.replaceFormState('myForm')({ email: 'react@redux.reformed' });

                store.dispatch(action);
                expect(store.getState().form).to.eql({
                    email: 'react@redux.reformed'
                });
            });

            it('should set a field state', () => {
                const action = actions.setFieldState('myForm')('email', 'react@example.com');

                store.dispatch(action);
                expect(store.getState().form).to.eql({
                    email: 'react@example.com'
                });
            });

            it('should reset the form state', () => {
                const action = actions.resetFormState('myForm')();
                const action2 = actions.setFieldState('myForm')('email', 'react@example.com');

                store.dispatch(action);
                expect(store.getState().form).to.equal(formInitialState);

                store.dispatch(action2);
                store.dispatch({ type: 'RESET' });
                expect(store.getState().form).to.equal(formInitialState);
            });
        });

        context('when receiving actions for itself', () => {
            it('should not set the form state', () => {
                const action = actions.setFormState('notMyForm')({ email: 'react@redux.reformed' });

                store.dispatch(action);
                expect(store.getState().form).to.equal(formInitialState);
            });

            it('should not replace the form state', () => {
                const action = actions.replaceFormState('notMyForm')({ email: 'react@redux.reformed' });

                store.dispatch(action);
                expect(store.getState().form).to.equal(formInitialState);
            });

            it('should not set a field state', () => {
                const action = actions.setFieldState('notMyForm')('email', 'react@example.com');

                store.dispatch(action);
                expect(store.getState().form).to.equal(formInitialState);
            });

            it('should not reset the form state', () => {
                const action = actions.resetFormState('notMyForm')();

                store.dispatch(action);
                expect(store.getState().form).to.equal(formInitialState);
            });
        });
    });

    describe('createModelValidator', () => {
        const minLength = (fieldName, min) => validator(fieldName, (val) => val && val.length >= min, 'minLength');
        const lowerCase = (fieldName) => validator(fieldName, (val) => val.toLowerCase() === val, 'lowerCase');
        const validateModel = createModelValidator(
            isRequired('name'),
            lowerCase('name'),
            minLength('name', 2)
        );
        const model = {
            name: 'abcD'
        };

        it('should output a model validity report', () => {
            const modelValidity = validateModel(model);

            expect(modelValidity).to.eql({
                valid: false,
                name: {
                    valid: false,
                    required: true,
                    lowerCase: false,
                    minLength: true
                }
            });
        });
    })
});
