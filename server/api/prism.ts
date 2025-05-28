import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/';

loadLanguages(['typescript']);

function highlightTsCode(raw: string) {
    if (typeof raw !== 'undefined') {
        return Prism.highlight(raw, Prism.languages.typescript, 'typescript');
    }
}

export { Prism, highlightTsCode };
