export const validator = (fieldName, validatorFn, validatorName) => {
    const name = validatorName || validatorFn.name;

    if (!name) {
        throw new Error(`[validator][unnamed] No 'validatorName' (3rd argument) or named validator function was provided`);
    }
    const fieldNames = typeof fieldName === 'array'
        ? fieldName
        : [ fieldName ];

    return (model, modelValidity) => {
        const values = fieldNames.map((_) => model[_]);

        const isValid = Boolean(validatorFn(...values));

        const modelValidityCopy = {
            ...modelValidity,
            valid: modelValidity.valid && isValid
        };

        fieldNames.forEach((fieldName) => {
            if (!form[fieldName]) {
                modelValidity[fieldName] = {
                    valid: true
                };
            }

            modelValidityCopy[fieldName] = {
                ...form[fieldName],
                [name]: isValid,
                valid: form[fieldName].valid && isValid
            };
        });

        return modelValidityCopy;
    };
}

export const isRequired = (fieldName) => validator(fieldName, (val) => Boolean(val), 'required');

export function createModelValidator(...validators) {
    return function validateModel(model) {
        return validators.reduce(
            (modelValidity, validator) => validator(model, modelValidity),
            { valid: true }
        );
    }
}
