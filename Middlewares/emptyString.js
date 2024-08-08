function removeEmptyString(object) {
    Object
        .entries(object)
        .forEach(([key, value]) => {
            if (value && typeof value === 'object')
                removeEmptyString(value);
            if (value &&
                typeof value === 'object' &&
                !Object.keys(value).length ||
                value === null ||
                value === undefined ||
                value.length === 0
            ) {
                if (Array.isArray(object))
                    object.splice(key, 1);
                else
                    delete object[key];
            }
        });
    return object;
}

module.exports.removeEmptyString = removeEmptyString