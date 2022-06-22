// To parse this data:
//
//   import { Convert, CPU } from "./file";
//
//   const cPU = Convert.toCPU(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CPU {
    code:      number;
    data:      Data;
    isSuccess: boolean;
    message:   string;
    type:      string;
}

export interface Data {
    CPU:     number;
    disk:    Disk;
    memory:  Memory;
    network: Network;
}

export interface Disk {
    availableBytes: number;
    totalBytes:     number;
}

export interface Memory {
    memAvailable: number;
    memTotal:     number;
}

export interface Network {
    download: number;
    receive:  number;
    transmit: number;
    upload:   number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertCPU {
    public static toCPU(json: string): CPU {
        return cast(JSON.parse(json), r("CPU"));
    }

    public static cPUToJson(value: CPU): string {
        return JSON.stringify(uncast(value, r("CPU")), null, 2);
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
    "CPU": o([
        { json: "code", js: "code", typ: 0 },
        { json: "data", js: "data", typ: r("Data") },
        { json: "isSuccess", js: "isSuccess", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "Data": o([
        { json: "CPU", js: "CPU", typ: 0 },
        { json: "disk", js: "disk", typ: r("Disk") },
        { json: "memory", js: "memory", typ: r("Memory") },
        { json: "network", js: "network", typ: r("Network") },
    ], false),
    "Disk": o([
        { json: "availableBytes", js: "availableBytes", typ: 0 },
        { json: "totalBytes", js: "totalBytes", typ: 0 },
    ], false),
    "Memory": o([
        { json: "memAvailable", js: "memAvailable", typ: 0 },
        { json: "memTotal", js: "memTotal", typ: 0 },
    ], false),
    "Network": o([
        { json: "download", js: "download", typ: 0 },
        { json: "receive", js: "receive", typ: 0 },
        { json: "transmit", js: "transmit", typ: 0 },
        { json: "upload", js: "upload", typ: 0 },
    ], false),
};
