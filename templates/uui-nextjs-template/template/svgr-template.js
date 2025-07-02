// svgr-template.js
const template = (variables, { tpl }) => {
    return tpl`

  ${variables.imports}

  ${variables.interfaces}

  function ${variables.componentName}({ containerClassName, ...props }) {
    return (<div className={containerClassName ?? ""}>{${variables.jsx}}</div>);
  };

  ${variables.exports};
  `;
};

module.exports = template;
