## The process of updating theme tokens

1. Reach out to the UX design team in order to obtain the most recent `Theme.json` file exported from Figma
2. Replace existing `public/docs/figmaTokensGen/Theme.json` with the new one
3. Run yarn scripts (from UUI monorepo root!) with next params:
```shell
yarn generate-theme-tokens
```
4. The command above takes `public/docs/figmaTokensGen/Theme.json` as an input and generates:
- File `public/docs/figmaTokensGen/ThemeOutput.json` This file differs from the original. It contains extra info about CSS variable. E.g.:
   ```
     "codeSyntax": {
       "WEB": "var(--uui-control-border-focus)"
     }
   ```
- File `public/docs/figmaTokensGen/ThemeTokens.json` This file contains info about tokens and tokens inheritance hierarchy in minimalistic format.
- Files with theme-specific mixins (`*.scss`) with token variables under `epam-assets/theme/tokens` folder
