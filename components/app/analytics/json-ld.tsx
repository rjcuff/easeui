export type JsonLdSchema = Record<string, unknown>;

/** Escape "<" so structured data can never close the script tag early. */
const serialize = (schema: JsonLdSchema) => JSON.stringify(schema).replace(/</g, "\\u003c");

/** Structured data for search engines. Accepts one schema or a list of them. */
export function JsonLd({ data }: { data: JsonLdSchema | JsonLdSchema[] }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: schemas.length === 1 ? serialize(schemas[0]) : `[${schemas.map(serialize).join(",")}]`,
      }}
    />
  );
}
