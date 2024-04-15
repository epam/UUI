import { Fragment } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function HomePage() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js</a>
                </h1>
                <h2>
                    This is a NextJS App template using{" "}
                    <a href="https://uui.epam.com/">UUI library</a>
                </h2>

                <h3>Read more about UUI:</h3>
                <ul>
                    <li>
                        UUI docs:{" "}
                        <a href="https://uui.epam.com/">uui.epam.com</a>
                    </li>
                    <li>
                        Git:{" "}
                        <a href="https://github.com/epam/uui">
                            github.com/epam/uui
                        </a>
                    </li>
                </ul>

                <p>
                    Get started by editing
                    <code className={styles.code}>app/page.tsx</code>
                </p>

                <div className={styles.grid}>
                    <p>
                        Find in-depth information about{" "}
                        <a href="https://nextjs.org/docs">Next.js</a> features
                        and API.
                    </p>
                </div>
            </main>
            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span className={styles.logo}>
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            width={72}
                            height={16}
                        />
                    </span>
                </a>
            </footer>
        </div>
    );
}
