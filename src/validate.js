export const validator = (fieldName, validatorFn, validatorName) => {
    const name = validatorName || validatorFn.name;

    if (!name) {
        throw new Error(`[validator][unnamed] No 'validatorName' (3rd argument) or named validator function was provided`);
    }
    const fieldNames = typeof fieldName === 'array'
        ? fieldName
        : [ fieldName ];

    return (model, form) => {
        const values = fieldNames.map((_) => model[_]);

        const isValid = Boolean(validatorFn(...values));

        const formCopy = {
            ...form,
            valid: form.valid && isValid
        };

        fieldNames.forEach((fieldName) => {
            if (!form[fieldName]) {
                form[fieldName] = {
                    valid: true
                };
            }

            formCopy[fieldName] = {
                ...form[fieldName],
                [name]: isValid,
                valid: form[fieldName].valid && isValid
            };
        });

        return formCopy;
    };
}

export const isRequired = (fieldName) => validator(fieldName, (val) => Boolean(val), 'required');

export default function createModelValidator(...validators) {
    return function validateModel(model) {
        return validators.reduce(
            (acc, validator) => validator(model, acc),
            { valid: true }
        );
    }
}
