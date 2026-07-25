import { Link, Text, Flex, Separator } from "@radix-ui/themes";
import ThemeButton from "./theme.button";

export default function Footer() {
    return (
        <Flex direction="column" gap="4" mt="8">
            <Separator size="4" />
            <Flex justify="between" align="center">
                <Text size="2" color="gray">
                    Open source on{" "}
                    <Link
                        href="https://github.com/bymoxb/dspace2tex"
                        target="_blank"
                        rel="noopener noreferrer"
                        weight="medium"
                    >
                        GitHub
                    </Link>
                </Text>
                <ThemeButton />
            </Flex>
        </Flex>
    );
}