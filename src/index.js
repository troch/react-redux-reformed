import { createModelValidator, validator } from './validate';
import {
    RESET_FORM_STATE,
    SET_FORM_STATE,
    REPLACE_FORM_STATE,
    setFormState,
    setFieldState,
    replaceFormState,
    resetFormState
} from './actions';

const shallowMerge = (left, right) => ({
    ...left,
    ...right
});

const defaultOptions = {
    resetActions: [],
    mergeState: shallowMerge
};

function createFormReducer(formName, initialFormState = {}, options = {}) {
    const { resetActions, mergeState } = { ...defaultOptions, ...options };
    const resetArgs = typeof resetActions === 'string' ? [ resetActions ] : resetActions;
    const shouldReset = (action) => {
        resetArgs.some((resetArg) => typeof resetArg === 'string'
            ? action.type === resetArg
            : resetArg(action)
        )
    };

    return function (state = initialFormState, action) {
        if (!action) {
            return state;
        }

        if (shouldReset()) {
            return initialFormState;
        }

        if (!action.payload || action.payload.formName !== formName) {
            return state;
        }

        switch (action.type) {
            case RESET_FORM_STATE:
                return initialFormState;

            case SET_FORM_STATE:
                return mergeState(state, action.payload.state);

            case REPLACE_FORM_STATE:
                return action.payload.state;
        }
    }
};

function connectForm(formName, formSelector, validators = []) {
    const validateModel = createModelValidator(...validators);

    const mapStateToProps = (state, props) => ({
        model: formSelector(state)
    });

    const mapDispatchToProps = {
        setFormState: setFormState(formName),
        setFieldState: setFieldState(formName),
        replaceFormState: replaceFormState(formName),
        resetFormState: resetFormState(formName)
    };
    
    const mergeProps = validators && validators.length
        ? ({ model }) => ({
            modelValidity: validateModel(model)
        })
        : undefined;

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    );
}


export {
    createFormReducer,
    connectForm,
    validator
};
