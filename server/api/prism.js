const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages(['typescript']);

function highlightTsCode(raw) {
    if (typeof raw !== 'undefined') {
        return Prism.highlight(raw, Prism.languages.typescript, 'typescript');
    }
}

module.exports = {
    Prism,
    highlightTsCode,
};
