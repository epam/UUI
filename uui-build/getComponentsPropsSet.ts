import { Project, SourceFile, Symbol } from 'ts-morph';
import path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';

const PATH_PREFIX = './app/src/docs/_props';
const DOCS_GLOB = [`../${PATH_PREFIX}/**/*.props{.ts,.tsx}`];

const project = new Project(
    {
        tsConfigFilePath: '../tsconfig.json',
    },
);

const typeChecker = project.getTypeChecker().compilerObject;

// Playground to modify and debug https://regex101.com/r/dd4hyi/1
const linksRegex = /(?:\[(.*)\])?\{\s*@link\s*(https:\/\/\S+?)\s*}/gm;

function escape(htmlStr: string) {
    return htmlStr.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatComment(comment: string) {
    comment = escape(comment);
    comment = comment.replace(linksRegex, (_, a, b) => `<a href='${b}'>${a ?? b}</a>`);
    comment = '<p>' + comment + '</p>'; // TBD split to lines?
    return comment;
}

let propsCount = 0;
let JsDocCommentsCount = 0;
let missingJsDocCommentsCount = 0;

const getPropType = (prop: Symbol, path: string) => {
    const name = prop.getEscapedName();

    let htmlComment = null;

    const commentSymbolDp = prop.compilerSymbol.getDocumentationComment(typeChecker);
    const jsDocComment = ts.displayPartsToString(commentSymbolDp);

    if (jsDocComment) {
        htmlComment = formatComment(jsDocComment);
        JsDocCommentsCount++;
    } else {
        console.debug(`Missing comment for ${name} in ${path}`);
        missingJsDocCommentsCount++;
    }
    propsCount++;

    const typeDeclarations = prop.getDeclarations();
    const type = typeDeclarations[0].getType();
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
        comment: htmlComment,
    };
};

function main() {
    const docsProps: any = {};
    /**
     * Sorting of files and props is necessary to make the output more stable and comparable.
     */
    const docsFiles = project.addSourceFilesAtPaths(DOCS_GLOB);
    const docsFilesSorted = sortDocFiles(docsFiles);
    docsFilesSorted.map((i) => {
        const docPath = getDocPathFromFile(i);
        const props = getPropsFromDocFile(i);
        docsProps[docPath] = props;
    });
    fs.writeFile('../public/docs/componentsPropsSet.json', JSON.stringify({ props: docsProps }, null, 2), () => null);
    console.log(`Props: ${propsCount}. JsDoc exists: ${JsDocCommentsCount}, missing: ${missingJsDocCommentsCount}`);
}
function getPropsFromDocFile(f: SourceFile) {
    const docPath = getDocPathFromFile(f);
    const exportExpression = f.getExportAssignment(() => true).getStructure().expression;
    const propsArr = f.getVariableDeclaration(exportExpression as any).getType().getTypeArguments()[0].getProperties();
    const propsArrSorted = sortProps(propsArr);
    const props = propsArrSorted.map((prop) => getPropType(prop, docPath));
    return props;
}
function getDocPathFromFile(f: SourceFile) {
    const fpFull = f.getFilePath();
    const rootOfTheRepo = path.resolve(process.cwd(), '..').replace(/\\+/g, '/');
    return fpFull.substring(rootOfTheRepo.length);
}
function sortProps(propsArr: Symbol[]) {
    const arr = [...propsArr];
    arr.sort((p1, p2) => {
        const en1 = p1.getEscapedName();
        const en2 = p2.getEscapedName();
        return en1.localeCompare(en2);
    });
    return arr;
}
function sortDocFiles(filesArr: SourceFile[]) {
    const arr = [...filesArr];
    arr.sort((f1, f2) => {
        const dp1 = getDocPathFromFile(f1);
        const dp2 = getDocPathFromFile(f2);
        return dp1.localeCompare(dp2);
    });
    return arr;
}

main();
