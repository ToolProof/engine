import Ajv, { DefinedError } from "ajv";
// Optional nicer types:
// import type { KeywordDefinition } from "ajv";

type ExtractHit = { instancePath: string; what: "value" | "self" };

function addExtractKeyword(ajv: Ajv) {
    const hits: ExtractHit[] = [];

    ajv.addKeyword({
        keyword: "x-extract",
        schemaType: "string", // the schema value for this keyword must be a string
        errors: false,
        // Annotation-only: always return true, just record where it applies
        validate(schema: unknown, _data: unknown, _parentSchema: unknown, dataCxt: any) {
            const what = schema === "self" ? "self" : "value"; // narrow safely at runtime
            hits.push({ instancePath: dataCxt.instancePath || "", what });
            return true;
        },
    });

    // expose a getter so you can read and reset after each validation
    return () => {
        const copy = hits.slice();
        hits.length = 0;
        return copy;
    };
}

// Utility to resolve a JSON Pointer
function getAtPointer(root: any, ptr: string) {
    if (!ptr) return root;
    return ptr
        .split("/").slice(1)
        .reduce(
            (acc, seg) => (acc === undefined ? acc : acc[seg.replace(/~1/g, "/").replace(/~0/g, "~")]),
            root
        );
}

export const bar = async (path: string) => {
    // Fetch data from the provided path
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${path}: ${response.statusText}`);
    }
    const data = await response.json();

    // ---- Example usage ----
    const schema = {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        type: "object",
        "x-extract": "value",
        properties: {
            value: { type: "number" }
        },
        required: ["value"],
        additionalProperties: false
    };

    const ajv = new Ajv({ allErrors: true });
    const getAndResetExtractHits = addExtractKeyword(ajv);

    const validate = ajv.compile(schema);

    const ok = validate(data);
    if (!ok) {
        console.error(validate.errors as DefinedError[]);
    }

    const hits = getAndResetExtractHits(); // e.g. [{ instancePath: "/value", what: "value" }]

    const extracted = hits.map(h =>
        h.what === "self" ? getAtPointer(data, h.instancePath) : getAtPointer(data, h.instancePath)
    );

    console.log(extracted); // If property-level: [3] ; If object-level: [{ value: 3 }]

    return extracted[0]; // Return the first extracted value
}










