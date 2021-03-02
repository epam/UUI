import { Project, Symbol } from "ts-morph";
import * as fs from 'fs';

const getPropType = (prop: Symbol) => {
    const name = prop.getEscapedName();

    prop.getDeclarations()[0].getLeadingCommentRanges();

    const type = prop.getDeclarations()[0].getType();
    let typeName = type.getText().replace(/import.*"\)\.*/g, '');

    if ((type.compilerType as any).types) {
        const types = (type.compilerType as any).types.map((i: any) => i.value).filter((i: any) => i !== undefined);

        if (types.length) {
            typeName = types.join(' | ');
        }

    }

    return {
        name: name,
        value: typeName,
    };
};

// const getTypeFromFile = (sourceFile: SourceFile, type: Type, name: string): string => {
//     if (!sourceFile.getFilePath().includes('@epam')) { // if type not from our packages, return just type name
//         return name;
//     }
//
//     if (sourceFile.getInterface(name)) {
//         return sourceFile.getInterface(name).getMembers().map(i => i.getType().getText()).join();
//
//     } else if (sourceFile.getTypeAlias(name)) {
//         return sourceFile.getTypeAlias(name).getStructure().type as string;
//     }
// };

const project = new Project(
    {
        tsConfigFilePath: '../tsconfig.json',
    },
);

let docsProps: any = {};

const docsFiles = project.addSourceFilesAtPaths(["../**/*.doc{.ts,.tsx}", "!../**/node_modules/**", "!../**/app/**"]);

docsFiles.map(i => {
    const exportExpression = i.getExportAssignment(() => true).getStructure().expression;
    const props = i.getVariableDeclaration(exportExpression as any).getType().getTypeArguments()[0].getProperties().map(prop => getPropType(prop));
    const docPath = i.getFilePath().replace(/.*\/ui/g, '');
    docsProps[docPath] = props;
});


fs.writeFile('../public/docs/componentsPropsSet.json', JSON.stringify({ props: docsProps }, null, 2), () => null);
