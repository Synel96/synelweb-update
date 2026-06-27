import { usePageContext } from "vike-react/usePageContext";

type ErrorPageContext = {
  abortStatusCode?: number;
  is404?: boolean;
  urlPathname?: string;
};

export default function Page() {
  const pageContext = usePageContext() as ErrorPageContext;
  const statusCode = pageContext.abortStatusCode ?? (pageContext.is404 ? 404 : 500);
  const pathname = pageContext.urlPathname ?? "unknown route";

  return (
    <>
      <h1>Something went wrong</h1>
      <p>
        Request failed for <strong>{pathname}</strong> with status <strong>{statusCode}</strong>.
      </p>
      <p>Please try again in a moment or return to the homepage.</p>
    </>
  );
}
