const path = require('path');
const { logger } = require('../../utils/loggerUtils');

const SUM_TOP_N = 300;
const ROOT_DIR = path.resolve(`${__dirname}/../../../.`);

module.exports = {
    ROOT_DIR,
    getReportLocationPath,
    sumComparator,
    convertSummaryToHtml,
    createSummaryFromMessages,
    convertResultsToHtml,
    reportUnnecessaryRulesToBeFixed,
    logSummary,
};

function getReportLocationPath() {
    const i = process.argv.indexOf('-o');
    if (i !== -1) {
        const dir = process.argv[i + 1];
        return forwardSlashes(path.resolve(ROOT_DIR, dir));
    }
}

function forwardSlashes(pathStr) {
    return pathStr.replace(/\\/g, '/');
}

function getSeverityOpts(kind) {
    let error;
    let warning;
    if (kind === 'eslint') {
        warning = {
            id: 1,
            label: 'Warning',
            key: 'warning',
        };
        error = {
            id: 2,
            label: 'Error',
            key: 'error',
        };
    } else {
        error = {
            id: 'error',
            label: 'Error',
            key: 'error',
        };
        warning = {
            id: 'warning',
            label: 'Warning',
            key: 'warning',
        };
    }
    return {
        warning,
        error,
    };
}

/**
 * Builds HTML table with statistics about amount of errors per severity/rule.
 * "sum" is the result returned from "createSummaryFromMessages" method.
 *
 * @returns {string} html string
 */
function convertSummaryToHtml({ summary, refRuleTemplate, kind = 'eslint' }) {
    const SEV_OPTS = getSeverityOpts(kind);
    function getSumRows(s, severityOpt) {
        const rulesTopN = Object.keys(summary[severityOpt.id].amountByRuleId).slice(0, SUM_TOP_N);
        return rulesTopN.map((rule) => {
            const googleSearch = refRuleTemplate(rule);
            const url = `https://www.google.com/search?q=${encodeURIComponent(googleSearch)}`;
            const amount = summary[severityOpt.id].amountByRuleId[rule];
            return `<tr><td><a target=”_blank” href="${url}">${rule}</a></td>
                    <td>${amount}</td></tr>`;
        });
    }
    function getSumFormatted({ severityOpt }) {
        const label = severityOpt.label;
        const summaryRows = getSumRows(summary, severityOpt).join('');
        return `
        <h3 style="color: #b94a48;">${label}s by rule (Top ${SUM_TOP_N})</h3>
        <table style="width: 400px; max-width: 100%;">
            <thead><tr><th>rule</th><th>amount</th></tr></thead>
            <tbody>${summaryRows}</tbody>
        </table>
`;
    }
    const totalErr = summary[SEV_OPTS.error.id].amount;
    const totalWarn = summary[SEV_OPTS.warning.id].amount;

    return `
<div style="margin-left: 30px;">
    <h3 style="color: #b94a48;">Total ${totalErr + totalWarn} problems (${totalErr} errors, ${totalWarn} warnings). Generated: ${new Date()}</h3>
    ${getSumFormatted({ severityOpt: SEV_OPTS.error })}
    ${getSumFormatted({ severityOpt: SEV_OPTS.warning })}
</div>
`;
}

/**
 * @param obj
 */
function sortKeysByValue(obj) {
    const keys = Object.keys(obj);
    keys.sort((k1, k2) => {
        return obj[k2] - obj[k1];
    });
    return keys.reduce((acc, k) => {
        acc[k] = obj[k];
        return acc;
    }, {});
}

/**
 * @returns {{"<severity>": {amount: number, amountByRuleId: {}}, "<severity>": {amount: number, amountByRuleId: {}}}}
 */
function createSummaryFromMessages(messages, initial, ruleIdPropName = 'ruleId', kind = 'eslint') {
    const SEV_OPTS = getSeverityOpts(kind);
    const sum = initial || {
        [SEV_OPTS.error.id]: {
            amount: 0,
            amountByRuleId: {},
        },
        [SEV_OPTS.warning.id]: {
            amount: 0,
            amountByRuleId: {},
        },
    };
    messages.forEach((msg) => {
        const severity = msg.severity;
        const ruleId = msg[ruleIdPropName];
        if (!sum[severity].amountByRuleId[ruleId]) {
            sum[severity].amountByRuleId[ruleId] = 0;
        }
        sum[severity].amount += 1;
        sum[severity].amountByRuleId[ruleId] += 1;
    });
    Object.keys(sum).forEach((k) => {
        sum[k].amountByRuleId = sortKeysByValue(sum[k].amountByRuleId);
    });
    return sum;
}

/**
 * s1 and s2 params look like this:
 * { 1: { amount: 100 }, 2: { amount: 200 } }
 * @returns {number}
 */
function sumComparator(s1, s2, kind = 'eslint') {
    const SEV_OPTS = getSeverityOpts(kind);

    return s2[SEV_OPTS.error.id].amount - s1[SEV_OPTS.error.id].amount || s2[SEV_OPTS.warning.id].amount - s1[SEV_OPTS.warning.id].amount;
}

function convertResultsToHtml(results, kind = 'eslint') {
    return `
    <style>
        .m-expand-all .c-file-message {
            display: table-row !important;
        }
        .c-file-path td {
            padding: 5px 10px;
            font-weight: 400;
            font-size: medium;
        }
        .c-messages-by-file {
            border-collapse: collapse;
            width: 1000px; max-width: 100%;
        }
        .c-messages-by-file th {
            text-align: left;
            padding: 20px;
        }
        .c-messages-by-file, 
        .c-messages-by-file td, 
        .c-messages-by-file th, 
        .c-messages-by-file tr 
        { border: 1px solid gray; }
        .c-file-message {
            color: #6C6E7A;
            display: none;
        }
        .severity-label-error { color: #A72014; }
        .severity-label-warning { color: #D67B0B; }
    </style>
    <script>
        function toggleExpandAll() {
            if (document.getElementById('expand-all-toggler').checked) {
                document.body.classList.add('m-expand-all')
            } else {
                document.body.classList.remove('m-expand-all')
            }
        }
    </script>
    <table class="c-messages-by-file">
        <thead>
            <tr><th>Show details: <input id="expand-all-toggler" type="checkbox" onchange="toggleExpandAll()" /></th><th></th></tr>
            <tr><th>File</th><th>Amount</th></tr>
        </thead>
        <tbody>
            ${results.map((r) => singleFileResultsToHtml(r, kind)).join('')}
        </tbody>     
    </table>
    `;
}

function singleFileResultsToHtml(fileRow, kind) {
    const p = forwardSlashes(path.relative(ROOT_DIR, fileRow[kind === 'eslint' ? 'filePath' : 'source']));
    const SEV_OPTS = getSeverityOpts(kind);
    const totalErr = fileRow.fileSummary[SEV_OPTS.error.id].amount;
    const totalWarn = fileRow.fileSummary[SEV_OPTS.warning.id].amount;
    const total = `${totalErr} errors, ${totalWarn} warnings`;

    if (totalErr + totalWarn === 0) {
        return '';
    }

    function htmlEsc(t) {
        return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function msgToHtml(msg) {
        const row = msg.line;
        const col = msg.column;
        const rule = msg[kind === 'eslint' ? 'ruleId' : 'rule'];
        const severity = msg.severity;
        const text = htmlEsc(msg[kind === 'eslint' ? 'message' : 'text']);
        const s = '&nbsp;&nbsp;&nbsp;&nbsp;';
        const sevObj = Object.values(SEV_OPTS).find(({ id }) => id === severity);
        const severityLabel = sevObj.label;
        return `
            <tr class="c-file-message">
                <td colspan="2">
                    ${row}:${col}${s}<span class="severity-label-${sevObj.key}">${severityLabel}</span>${s}${rule}${s}${text}
                </td>
            </tr>
        `;
    }

    return `
        <tr class="c-file-path">
            <td>${p}</td><td>${total}</td>
        </tr>
        ${fileRow[kind === 'eslint' ? 'messages' : 'warnings'].map(msgToHtml).join('')}
`;
}

function reportUnnecessaryRulesToBeFixed(summary, rulesToBeFixed) {
    const mapOfRulesWithIssues = Object.values(summary).reduce((acc, map) => {
        return { ...acc, ...map.amountByRuleId };
    }, {});
    const unnecessaryOnes = rulesToBeFixed.filter((r) => {
        return !mapOfRulesWithIssues[r];
    });
    if (unnecessaryOnes.length > 0) {
        logger.warn(`There are no issues reported for next rules. Please consider removing them from rulesToBeFixed.js\n${unnecessaryOnes.join(', ')}`);
    }
}

function logSummary(summary, kind = 'eslint') {
    const SEV_OPTS = getSeverityOpts(kind);
    const sum = {
        errors: summary[SEV_OPTS.error.id]?.amount,
        warnings: summary[SEV_OPTS.warning.id]?.amount,
    };
    logger.table({ caption: 'Summary', data: sum });

    if (sum.errors) {
        const detailsErr = summary[SEV_OPTS.error.id]?.amountByRuleId;
        logger.table({ caption: 'Errors', data: detailsErr });
    }
    if (sum.warnings) {
        const detailsWarn = summary[SEV_OPTS.warning.id]?.amountByRuleId;
        logger.table({ caption: 'Warnings', data: detailsWarn });
    }
}
