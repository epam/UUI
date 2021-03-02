"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var regexpNoSumboduleImport = /^@epam\/[\w-]+\//i;
var regexpAssetsExeption = /^@epam\/assets\/\w+(\/\w+)?(\/\w+)?(\/[\w-]+\.[a-z]+)?$/i;
var regexpIconsExeption = /^@epam\/(loveship|oswald)\/components\/icons\/[\w-]+\.[a-z]+$/i;
var epamModules = ['epam-uui', 'loveship', 'epam-promo', 'uui', 'uui-db', 'uui-components', 'uui-timeline', 'uui-editor', 'draft-rte', 'edu-bo-components', 'extra',
    'epam-assets', 'edu-utils', 'edu-ui-base', 'edu-core-routing', 'edu-core', 'uui-docs', 'grow', 'app'];
var getNoModuleOutsideRegExp = function (url) {
    var urlArr = url.split('/');
    var maxNesting;
    urlArr.some(function (item, index) {
        if (epamModules.indexOf(item) >= 0) {
            maxNesting = index;
        }
        return false;
    });
    var allowedNesting = maxNesting ? urlArr.length - maxNesting : 2;
    var regExp = '^';
    for (var i = 0; i < allowedNesting - 1; i++) {
        regExp += "(\\.\\.\/)";
    }
    return new RegExp(regExp, 'i');
};
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING_SUBMODULE_IMPORT = "Use '@epam/...' to reference other packages. You can't reference submodules in @epam packages, as it won't work for pre-build versions on NPM (all files are built into on index.js)";
    Rule.FAILURE_STRING_MODULE_OUTSIDE = "doesn't import other packages via parent folders, use '@epam/...' for this";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var NoImportsWalker = /** @class */ (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoImportsWalker.prototype.visitImportDeclaration = function (node) {
        var str = node.moduleSpecifier.getText().replace(/('|\")/g, "");
        if (regexpNoSumboduleImport.test(str) && !regexpAssetsExeption.test(str) && !regexpIconsExeption.test(str)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_SUBMODULE_IMPORT));
        }
        if (getNoModuleOutsideRegExp(node.moduleSpecifier.getSourceFile().fileName).test(str)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_MODULE_OUTSIDE));
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return NoImportsWalker;
}(Lint.RuleWalker));
