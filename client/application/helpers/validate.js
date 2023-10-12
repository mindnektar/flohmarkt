import { validate as emailValidate } from 'email-validator';

export default {
    required: () => ({ value }) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }

        if (typeof value === 'string') {
            return !!value.trim();
        }

        return !!value;
    },
    email: () => ({ value }) => (
        !value || emailValidate(value)
    ),
    unique: ({ values }) => ({ value }) => {
        if (!value.trim()) {
            return true;
        }

        return !values.includes(value.trim());
    },
};
