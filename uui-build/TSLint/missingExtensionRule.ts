// The walker takes care of all the work.
import * as Lint from "tslint";
import * as ts from "typescript";

// Add other external modules here.
const EXTERNAL_MODULES = ['dayjs'];
const ERR = 'Please provide file extension explicitly when importing inner files of external modules.';

class MissingExtensionWalker extends Lint.RuleWalker {
    public visitImportDeclaration(node: ts.ImportDeclaration) {
        let str = node.moduleSpecifier.getText().replace(/('|\")/g, "");
        const isInvalid = EXTERNAL_MODULES.some(em => {
            // inner file of a module was imported, but extension is not provided.
            if (str.indexOf(`${em}/`) !== -1) {
                return str.indexOf('.js') === -1;
            }
        });
        if (isInvalid) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), ERR));
        }
        super.visitImportDeclaration(node);
    }
}

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingExtensionWalker(sourceFile, this.getOptions()));
    }
}
