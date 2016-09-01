declare var org;
const JSONObject = org.json.JSONObject;
const JSONArray = org.json.JSONArray;
const JSONException = org.json.JSONException;

export function serialize(value) {
    let store;
    switch (typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            return value;
        case 'object':
            if (!value) {
                return null;
            }

            if (value instanceof Date) {
                return value.toJSON();
            }
            if (Array.isArray(value)) {
                store = new JSONArray();
                value.forEach((item) => {
                    store.put(item);
                });
                return store;
            }
            store = new JSONObject();
            Object.keys(value).forEach((key) => {
                let item = value[key];
                store.put(key, serialize(item));
            });
            return store;
        default:
            return null;
    }

}

export function deserialize(value) {
    if (value === null || typeof value !== 'object') {
        return value;
    }
    let store;
    switch (value.getClass().getName()) {
        case 'java.lang.String':
            return String(value);
        case 'java.lang.Boolean':
            return Boolean(value);
        case 'java.lang.Integer':
        case 'java.lang.Long':
        case 'java.lang.Double':
        case 'java.lang.Short':
            return Number(value);
        case 'org.json.JSONArray':
            store = [];
            for (let i = 0; i < value.length(); i++) {
                store[i] = deserialize(value.get(i));
            }
            break;
        case 'org.json.JSONObject':
            store = {};
            let i = value.keys();
            while (i.hasNext()) {
                let key = i.next();
                store[key] = deserialize(value.get(key));
            }
            break;
        default:
            store = null;
    }
    return store;

}