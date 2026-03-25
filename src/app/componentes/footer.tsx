import { Link, Text } from "@radix-ui/themes";
import ThemeButton from "./theme.button";

export default function Footer() {
    return (
        <footer className="footer-container">
            <ThemeButton />
            <Text>
                Open source project on{" "}
                <Link
                    href="https://github.com/bymoxb/dspace2tex"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </Link>
            </Text>
        </footer>
    );
}

