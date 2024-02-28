const plugin = function uuiBabelPluginForPlaywrite({ types: t }) {
    return {
        name: 'uui-babel-plugin-for-playwrite',
        visitor: {
            Identifier(path) {
                if (path.node.name === '__PACKAGE_VERSION__') {
                    path.replaceWith(t.stringLiteral(''));
                }
            },
            CallExpression(path) {
                const callee = path.node.callee;
                if (t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: 'require' }) && t.isIdentifier(callee.property, { name: 'context' })) {
                    path.replaceWith(
                        t.objectExpression([
                            t.objectProperty(
                                t.identifier('keys'),
                                t.functionExpression(
                                    null,
                                    [],
                                    t.blockStatement([
                                        t.returnStatement(t.arrayExpression()),
                                    ]),
                                ),
                            ),
                        ]),
                    );
                }
            },
            ImportDeclaration(i) {
                const imp = i.node.source.value;
                const isScssModule = imp.match(/\.module\.scss$/);
                const isOtherCssImport = imp.match(/\.(css|less|scss)$/);
                const isSvg = imp.match(/\.svg$/);

                if (isSvg) {
                    const specifier = i.node.specifiers.find(
                        (s) => t.isImportSpecifier(s) && s.imported.name === 'ReactComponent',
                    );
                    if (specifier && specifier.local) {
                        /** It replaces this: "import { ReactComponent as someName } from './file_name.svg';" to this: "const someName = () => null;" */
                        const variableName = specifier.local.name;
                        i.replaceWith(
                            t.variableDeclaration('const', [
                                t.variableDeclarator(
                                    t.identifier(variableName),
                                    t.arrowFunctionExpression([], t.nullLiteral()),
                                ),
                            ]),
                        );
                    }
                } else if (isScssModule) {
                    const spec = i.node.specifiers[0];
                    if (spec) {
                        const variableName = spec.local.name;
                        i.replaceWith(
                            t.variableDeclaration('const', [
                                t.variableDeclarator(
                                    t.identifier(variableName),
                                    t.objectExpression([]),
                                ),
                            ]),
                        );
                    } else {
                        i.remove();
                    }
                } else if (isOtherCssImport) {
                    i.remove();
                }
            },
        },
    };
};

module.exports = plugin;
