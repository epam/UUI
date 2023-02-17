const {
    convertSummaryToHtml, createSummaryFromMessages, sumComparator, convertResultsToHtml, getReportLocationPath,
} = require('./formatterUtils');
const path = require('path');
const fs = require('fs');

function writeReport(dataStr) {
    const reportAbsPath = getReportLocationPath();
    if (reportAbsPath) {
        const outDir = path.dirname(reportAbsPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        fs.writeFileSync(reportAbsPath, dataStr);
    } else {
        console.error('Report location is missed. Pass it as "-o <path-to-the-report>"');
    }
}

function stylelintFormatter(results) {
    const kind = 'stylelint';
    const refRuleTemplate = rule => `stylelint rule "${rule}"`;
    let summary;
    results.forEach(({ warnings }, index) => {
        summary = createSummaryFromMessages(warnings, summary, 'rule', kind);
        results[index].fileSummary = createSummaryFromMessages(warnings, undefined, 'rule', kind);
    });
    results.sort((i1, i2) => {
        return sumComparator(i1.fileSummary, i2.fileSummary, kind);
    });

    const files = convertSummaryToHtml({ summary, refRuleTemplate, kind });
    const cr = convertResultsToHtml(results, kind);
    writeReport(`${files}${cr}`);
    console.log(JSON.stringify(summary, undefined, 1));
    const reportAbsPath = getReportLocationPath();
    reportAbsPath && console.log(`Report was generated at: ${reportAbsPath}`);
}

module.exports = stylelintFormatter;
