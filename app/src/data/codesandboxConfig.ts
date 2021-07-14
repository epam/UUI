export const CodeSandboxConfig = {
    initialPath: 'https://codesandbox.io/s/uui-w4i61',
    files: {
        'index.tsx': {
            isBinary: false,
            content: `
                import Example from "./Example";
                import { render } from "react-dom";
                import { skinContext as promoSkinContext } from "@epam/promo";
                import { ContextProvider } from "@epam/uui";
                import "@epam/uui-components/styles.css";
                import "@epam/promo/styles.css";
                import { svc } from "./services";

                const rootElement = document.getElementById("root");

                render(
                    <ContextProvider
                        onInitCompleted={(context) => Object.assign(svc, context)}
                        skinContext={promoSkinContext}
                    >
                        <Example />
                    </ContextProvider>,
                    rootElement
                );
            `
        },
        'services.ts': {
            isBinary: false,
            content: `
                import { CommonContexts } from "@epam/uui";
                export const svc: CommonContexts<any, any> = {} as any;
            `
        },
        'package.json': {
            isBinary: false,
            content: `{
                "name": "uui",
                "version": "1.0.0",
                "description": "Template for quickly getting started with using UUI component system.",
                "keywords": [
                  "react",
                  "uui",
                  "uikit"
                ],
                "main": "index.tsx",
                "dependencies": {
                  "@epam/assets": "4.1.1",
                  "@epam/loveship": "4.1.1",
                  "@epam/promo": "4.1.1",
                  "@epam/uui": "4.1.1",
                  "@epam/uui-components": "4.1.1",
                  "@types/react": "17.0.14",
                  "@types/react-dom": "17.0.9",
                  "history": "4.9.0",
                  "react": "17.0.2",
                  "react-dom": "17.0.2",
                  "react-scripts": "4.0.0"
                },
                "devDependencies": {
                  "@types/react": "17.0.0",
                  "@types/react-dom": "17.0.0",
                  "typescript": "4.1.3",
                  "typescript-plugin-css-modules": "1.2.1"
                },
                "scripts": {
                  "start": "react-scripts start",
                  "build": "react-scripts build",
                  "test": "react-scripts test --env=jsdom",
                  "eject": "react-scripts eject"
                },
                "browserslist": [
                  ">0.2%",
                  "not dead",
                  "not ie <= 11",
                  "not op_mini all"
                ]
            }`,
        },
        'tsconfig.json': {
            isBinary: false,
            content: `{
                "include": [
                    "./src/**/*"
                ],
                "compilerOptions": {
                    "strict": true,
                    "esModuleInterop": true,
                    "lib": [
                        "dom",
                        "es2015"
                    ],
                    "jsx": "react-jsx"
                }
            }`,
        },
        "index.html": {
            isBinary: false,
            content: `
                <!DOCTYPE html>
                <html lang="en">
                    <body>
                        <div id="root"></div>
                    </body>
                </html>
            `
        }
    }
}