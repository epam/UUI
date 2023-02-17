const {
    createSummaryFromMessages, convertSummaryToHtml,
    sumComparator, convertResultsToHtml,
    getReportLocationPath,
} = require('./formatterUtils');

module.exports = (results) => {
    let summary;
    results.forEach(({ messages }, index) => {
        summary = createSummaryFromMessages(messages, summary);
        results[index].fileSummary = createSummaryFromMessages(messages);
    });
    results.sort((i1, i2) => {
        return sumComparator(i1.fileSummary, i2.fileSummary);
    });
    const refRuleTemplate = rule => `eslint rule "${rule}"`;

    const files = convertSummaryToHtml({ summary, refRuleTemplate });
    const cr = convertResultsToHtml(results);
    console.log(JSON.stringify(summary, undefined, 1));
    const reportAbsPath = getReportLocationPath();
    reportAbsPath && console.log(`Report was generated at: ${reportAbsPath}`);
    return files + cr;
};
