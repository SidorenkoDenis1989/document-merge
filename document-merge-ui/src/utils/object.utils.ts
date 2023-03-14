export const isEqualObjects = (obj1: any, obj2: any): boolean => {
    try {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const deepEquals = (object1: object, object2: object) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !deepEquals(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
    }
    return true;
};

const isObject = (object) => {
    return object != null && typeof object === 'object';
};

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
