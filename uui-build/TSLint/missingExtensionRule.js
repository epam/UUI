"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Rule = void 0;
// The walker takes care of all the work.
var Lint = require("tslint");
// Add other external modules here.
var EXTERNAL_MODULES = ['dayjs'];
var ERR = 'Please provide file extension explicitly when importing inner files of external modules.';
var MissingExtensionWalker = /** @class */ (function (_super) {
    __extends(MissingExtensionWalker, _super);
    function MissingExtensionWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MissingExtensionWalker.prototype.visitImportDeclaration = function (node) {
        var str = node.moduleSpecifier.getText().replace(/('|\")/g, "");
        var isInvalid = EXTERNAL_MODULES.some(function (em) {
            // inner file of a module was imported, but extension is not provided.
            if (str.indexOf(em + "/") !== -1) {
                return str.indexOf('.js') === -1;
            }
        });
        if (isInvalid) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), ERR));
        }
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return MissingExtensionWalker;
}(Lint.RuleWalker));
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MissingExtensionWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
