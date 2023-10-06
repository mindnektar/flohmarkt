const findInObject = (object, attributes = []) => {
    const nextAttributes = [...attributes];
    const attribute = nextAttributes.shift();

    return attribute ? findInObject(object?.[attribute], nextAttributes) : object;
};

export const findDeep = (object, attributeString = null) => (
    findInObject(object, attributeString?.split('.'))
);

export const isObject = (value) => (
    value && typeof value === 'object' && value.constructor === Object
);
