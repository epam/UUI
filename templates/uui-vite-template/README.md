# vite-template-uui

This is the official [UUI](https://uui.epam.com/) template for [Vite](https://vitejs.dev).

Create project from template:
```
1. Clone the UUI repo
2. Copy/paste the forder "templates/uui-vite-template"
```

For more information, please refer to:
- [Community templates](https://vitejs.dev/guide/#community-templates) – Vite templates documentation.
- [UUI docs](https://uui.epam.com/) – UUI library official documentation.

<br/>

#### TODO
In the future, we may want to simplify the setup process for Vite template and do it via a single CLI command (like create-react-app or create-next-app).
It would require the following:
- Publish to NPM a new package with name like: ```@epam/create-*```
- As a result, it would be possible to init UUI template via a single command, e.g.: 
```
npm|yarn create @epam/uui-template@latest my-app template=vite|cra|nextjs 
```
