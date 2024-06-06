## The process of updating theme tokens

1. Reach out to the UX design team in order to obtain the most recent `Theme.json` file exported from Figma
2. Replace existing `public/docs/figmaTokensGen/Theme.json` with the new one
3. Run yarn scripts in next order:
```shell
# It takes "public/docs/figmaTokensGen/Theme.json" as an input and generates "public/docs/figmaTokensGen/ThemeOutput.json"
yarn generate-theme-tokens

# It takes "public/docs/figmaTokensGen/ThemeOutput.json" as an input and generates the following:
# 1. The "public/docs/figmaTokensGen/ThemeTokens.json"
# 2. Theme-specific mixins (*.scss) with token variables under "epam-assets/theme/tokens/" folder
yarn generate-theme-mixins
```
