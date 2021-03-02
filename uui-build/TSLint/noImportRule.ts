import * as Lint from "tslint";
import * as ts from "typescript";

const regexpNoSumboduleImport = /^@epam\/[\w-]+\//i;
const regexpAssetsExeption = /^@epam\/assets\/\w+(\/\w+)?(\/\w+)?(\/[\w-]+\.[a-z]+)?$/i;
const regexpIconsExeption = /^@epam\/(loveship|oswald)\/components\/icons\/[\w-]+\.[a-z]+$/i;

const epamModules = ['epam-uui', 'loveship', 'epam-promo', 'uui', 'uui-db', 'uui-components', 'uui-timeline', 'uui-editor', 'draft-rte', 'edu-bo-components', 'extra',
    'epam-assets', 'edu-utils', 'edu-ui-base', 'edu-core-routing', 'edu-core', 'uui-docs', 'grow', 'app'];

const getNoModuleOutsideRegExp = (url: string) => {
    let urlArr: string[] = url.split('/');
    let maxNesting;
    urlArr.some((item, index) => {
        if (epamModules.indexOf(item) >= 0) {
            maxNesting = index;
        }
        return false;
    });

    let allowedNesting = maxNesting ? urlArr.length - maxNesting : 2;

    let regExp = '^';
    for (let i = 0; i < allowedNesting - 1; i++) {
        regExp += "(\\.\\.\/)";
    }

    return new RegExp(regExp, 'i');
};

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_SUBMODULE_IMPORT = "Use '@epam/...' to reference other packages. You can't reference submodules in @epam packages, as it won't work for pre-build versions on NPM (all files are built into on index.js)";
    public static FAILURE_STRING_MODULE_OUTSIDE = "doesn't import other packages via parent folders, use '@epam/...' for this";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        let str = node.moduleSpecifier.getText().replace(/('|\")/g, "");

        if (regexpNoSumboduleImport.test(str) && !regexpAssetsExeption.test(str) && !regexpIconsExeption.test(str)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_SUBMODULE_IMPORT));
        }

        if (getNoModuleOutsideRegExp(node.moduleSpecifier.getSourceFile().fileName).test(str)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_MODULE_OUTSIDE));
        }
        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}