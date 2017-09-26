const defaultModelValidity = { valid: true };

export const validator = (fieldName, validatorFn, validatorName) => {
    const name = validatorName || validatorFn.name;

    if (!name) {
        throw new Error(`[validator][unnamed] No 'validatorName' (3rd argument) or named validator function was provided`);
    }
    const fieldNames = [].concat(fieldName);

    return (model, modelValidity = defaultModelValidity) => {
        const values = fieldNames.map((_) => model[_]);

        const isValid = Boolean(validatorFn(...values));

        const modelValidityCopy = {
            ...modelValidity,
            valid: modelValidity.valid && isValid
        };

        fieldNames.forEach((fieldName) => {
            if (!modelValidity[fieldName]) {
                modelValidityCopy[fieldName] = defaultModelValidity;
            }

            modelValidityCopy[fieldName] = {
                ...modelValidityCopy[fieldName],
                [name]: isValid,
                valid: modelValidityCopy[fieldName].valid && isValid
            };
        });

        return modelValidityCopy;
    };
}

export const isRequired = (fieldName) => validator(fieldName, (val) => Boolean(val), 'required');

export function createModelValidator(...validators) {
    return function validateModel(model) {
        return validators.reduce(
            (modelValidity, validationFn) => validationFn(model, modelValidity),
            defaultModelValidity
        );
    }
}
