// To parse this data:
//
//   import { Convert, Setting } from "./file";
//
//   const setting = Convert.toSetting(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Setting {
    method: string;
    data:   Data;
}

export interface Data {
    autoStartUp:                   boolean;
    checkFaceTemp:                 boolean;
    checkMask:                     boolean;
    checkTemp:                     boolean;
    companyNameVisibility:         boolean;
    debugMode:                     boolean;
    delayOnlRecognitionTime:       number;
    detectDistance:                number;
    doesNotRecognizeTheSamePerson: number;
    faceQuality:                   boolean;
    highTempWarning:               number;
    irCameraVisibility:            boolean;
    irLiveness:                    boolean;
    keepDoorTime:                  number;
    keepFaceResultDay:             number;
    langCode:                      string;
    lightBrightness:               number;
    openDoorInfoVisibility:        boolean;
    recognitionMode:               string;
    restartOnCrash:                boolean;
    rgbLiveness:                   boolean;
    showCompanyLabel:              boolean;
    sound:                         boolean;
    strictModeLiveness:            boolean;
    timekeepingVisibility:         boolean;
    useLed:                        boolean;
    volume:                        number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertSetting {
    public static toSetting(json: string): Setting {
        return cast(JSON.parse(json), r("Setting"));
    }

    public static settingToJson(value: Setting): string {
        return JSON.stringify(uncast(value, r("Setting")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Setting": o([
        { json: "method", js: "method", typ: "" },
        { json: "data", js: "data", typ: r("Data") },
    ], false),
    "Data": o([
        { json: "autoStartUp", js: "autoStartUp", typ: true },
        { json: "checkFaceTemp", js: "checkFaceTemp", typ: true },
        { json: "checkMask", js: "checkMask", typ: true },
        { json: "checkTemp", js: "checkTemp", typ: true },
        { json: "companyNameVisibility", js: "companyNameVisibility", typ: true },
        { json: "debugMode", js: "debugMode", typ: true },
        { json: "delayOnlRecognitionTime", js: "delayOnlRecognitionTime", typ: 0 },
        { json: "detectDistance", js: "detectDistance", typ: 0 },
        { json: "doesNotRecognizeTheSamePerson", js: "doesNotRecognizeTheSamePerson", typ: 0 },
        { json: "faceQuality", js: "faceQuality", typ: true },
        { json: "highTempWarning", js: "highTempWarning", typ: 3.14 },
        { json: "irCameraVisibility", js: "irCameraVisibility", typ: true },
        { json: "irLiveness", js: "irLiveness", typ: true },
        { json: "keepDoorTime", js: "keepDoorTime", typ: 0 },
        { json: "keepFaceResultDay", js: "keepFaceResultDay", typ: 0 },
        { json: "langCode", js: "langCode", typ: "" },
        { json: "lightBrightness", js: "lightBrightness", typ: 0 },
        { json: "openDoorInfoVisibility", js: "openDoorInfoVisibility", typ: true },
        { json: "recognitionMode", js: "recognitionMode", typ: "" },
        { json: "restartOnCrash", js: "restartOnCrash", typ: true },
        { json: "rgbLiveness", js: "rgbLiveness", typ: true },
        { json: "showCompanyLabel", js: "showCompanyLabel", typ: true },
        { json: "sound", js: "sound", typ: true },
        { json: "strictModeLiveness", js: "strictModeLiveness", typ: true },
        { json: "timekeepingVisibility", js: "timekeepingVisibility", typ: true },
        { json: "useLed", js: "useLed", typ: true },
        { json: "volume", js: "volume", typ: 0 },
    ], false),
};
