"use client"
import { useActionState } from "react";
import { convertDspaceToBibtex } from "./actions/actions";
import Detail from "./componentes/detail";
import Error from "./componentes/error";
import Footer from "./componentes/footer";
import Input from "./componentes/input";
import { useBackSlash } from "./hooks/use-shortcuts";

export default function Home() {

  const [state, action, pending] = useActionState(convertDspaceToBibtex, null);

  const [searchInputRef, _, setIsFocused] = useBackSlash();

  return (
    <>
      <main className="container mx-auto grow">
        <h1 className="text-center font-semibold text-6xl my-4">DSpace2Tex</h1>
        <form action={action}
          className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-center"
        >
          <Input
            id="url"
            type="url"
            title="DSpace URI/URL"
            customRef={searchInputRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="https://repo.edu/handle/1/1"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className={"border rounded-2xl px-2 py-1 cursor-pointer min-w-36" + (pending ? " cursor-progress" : "")}
          >
            {pending ? "Convert..." : 'Convert'}
          </button>
        </form>

        <Error hasError={state?.ok} message={!state?.ok ? state?.error : ""} />


        <section className="mt-4 flex flex-col gap-4">
          <Detail
            open
            title="BibTeX"
            value={state?.ok ? state?.bibtex : ""}
            rows={8}
          />

          <Detail
            title="Ver metadatos extraídos"
            value={state?.ok ? JSON.stringify(state?.meta, null, 4) : null}
            rows={15}
          />
        </section>
      </main>

      <Footer />
    </> 
  );
}
