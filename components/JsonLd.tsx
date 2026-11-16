// A Schema.org block for the page it is rendered on. Search engines read
// JSON-LD anywhere in the document, so a page can describe itself next to
// the content it describes (its FAQ, its prices).
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so text from the admin can't close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
