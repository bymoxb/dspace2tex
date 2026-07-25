"use client"
import { Box, Button, Container, Flex, Heading, Tabs, Text, Section } from "@radix-ui/themes";
import { useActionState } from "react";
import { convertDspaceToBibtex } from "./actions/actions";
import Input from "./componentes/input";
import Error from "./componentes/error";
import Footer from "./componentes/footer";
import Detail from "./componentes/detail";

export default function Home() {
  const [state, action, pending] = useActionState(convertDspaceToBibtex, null);

  return (
    <Container size="2">
      <Section p="4">
        <Flex direction="column" gap="5">
          <header>
            <Heading size="8" mb="1" align="center">DSpace2Tex</Heading>
            <Text color="gray" size="2" align="center" as="p">
              Instantly convert DSpace records to BibTeX.
            </Text>
          </header>

          <form action={action}>
            <Flex gap="3" direction={{ initial: 'column', sm: 'row' }}>
              <Box flexGrow="1">
                <Input
                  autoFocus
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://repo.edu/handle/1/1"
                  required
                />
              </Box>
              <Button
                size="3"
                variant="solid"
                type="submit"
                loading={pending}
                disabled={pending}
              >
                {pending ? "Extracting..." : 'Extract'}
              </Button>
            </Flex>
          </form>

          <Error hasError={state?.ok} message={!state?.ok ? state?.error : ""} />

          <Box style={{ display: state?.ok ? 'block' : 'none' }}>
            <Tabs.Root defaultValue="1">
              <Tabs.List color="indigo" highContrast>
                <Tabs.Trigger value="1">BibTeX</Tabs.Trigger>
                <Tabs.Trigger value="2">Metadata (JSON)</Tabs.Trigger>
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
                    rows={15}
                  />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </Box>

          <Footer />
        </Flex>
      </Section>
    </Container>
  );
}