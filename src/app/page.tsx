"use client"
import { Box, Button, Container, Flex, Heading, Tabs } from "@radix-ui/themes";
import { useActionState } from "react";
import { convertDspaceToBibtex } from "./actions/actions";
import { useBackSlash } from "./hooks/use-shortcuts";
import Input from "./componentes/input";
import Error from "./componentes/error";
import Footer from "./componentes/footer";
import Detail from "./componentes/detail";

export default function Home() {

  const [state, action, pending] = useActionState(convertDspaceToBibtex, null);

  return (
    <Container>
      <Flex direction="column" gap="2" p="4">
        <Heading size="8">DSpace2Tex</Heading>

        <form action={action}>
          <Flex gap="3" my="4">
            <Input
              autoFocus
              id="url"
              name="url"
              type="url"
              placeholder="DSpace URI/URL: https://repo.edu/handle/1/1"
              required
            />
            <Button
              type="submit"
              loading={pending}
              disabled={pending}
            >
              {pending ? "Extracting..." : 'Extract'}
            </Button>
          </Flex>
        </form>

        <Error hasError={state?.ok} message={!state?.ok ? state?.error : ""} />

        <Box>
          <Tabs.Root defaultValue="1">
            <Tabs.List>
              <Tabs.Trigger value="1">BibTeX</Tabs.Trigger>
              <Tabs.Trigger value="2">Metadata</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="1">
                <Detail
                  value={state?.ok ? state?.bibtex : ""}
                  rows={15}
                />
              </Tabs.Content>

              <Tabs.Content value="2">
                <Detail
                  value={state?.ok ? JSON.stringify(state?.meta, null, 4) : null}
                  rows={20}
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Box>

        <Footer /> {/* El Footer siempre está al final */}
      </Flex>
    </Container>
  );
}
