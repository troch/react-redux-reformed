export const SET_FORM_STATE = '@@react-redux-reformed/setState';
export const REPLACE_FORM_STATE = '@@react-redux-reformed/replaceState';
export const RESET_FORM_STATE = '@@react-redux-reformed/resetState';

export const setFormState = (formName) => (state) => ({
    type: SET_FORM_STATE,
    payload: {
        formName,
        state
    }
});

export const replaceFormState = (formName) => (state) => ({
    type: REPLACE_FORM_STATE,
    payload: {
        formName,
        state
    }
});

export const resetFormState = (formName) => () => ({
    type: RESET_FORM_STATE,
    payload: {
        formName
    }
});

export const setFieldState = (formName) => {
    const setState = setFormState(formName);

    return (fieldName, fieldValue) => setState({
        [fieldName]: fieldValue
    });
};
