const {
    createSummaryFromMessages, convertSummaryToHtml, sumComparator, convertResultsToHtml, getReportLocationPath, logSummary,
} = require('./formatterUtils.js');
const { reportUnnecessaryRulesToBeFixed } = require('./formatterUtils.js');
const { eslintRulesToBeFixed } = require('../utils/rulesToBeFixed.js');
const { logger } = require('../../utils/loggerUtils.js');

module.exports = (results) => {
    let summary;
    results.forEach(({ messages }, index) => {
        summary = createSummaryFromMessages(messages, summary);
        results[index].fileSummary = createSummaryFromMessages(messages);
    });
    results.sort((i1, i2) => {
        return sumComparator(i1.fileSummary, i2.fileSummary);
    });
    const refRuleTemplate = (rule) => `eslint rule "${rule}"`;

    const files = convertSummaryToHtml({
        summary,
        refRuleTemplate,
    });
    const cr = convertResultsToHtml(results);
    logSummary(summary);
    logger.info(`Total amount of files scanned: ${results.length}.`);
    const reportAbsPath = getReportLocationPath();
    reportUnnecessaryRulesToBeFixed(summary, eslintRulesToBeFixed);
    reportAbsPath && logger.info(`Report was generated at: ${reportAbsPath}`);
    return files + cr;
};
