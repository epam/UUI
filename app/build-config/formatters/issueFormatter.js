const { createCodeFrameFormatter } = require('../../../node_modules/fork-ts-checker-webpack-plugin/lib/formatter/CodeFrameFormatter.js');
const path = require('path');
const os = require('os');

module.exports = { uuiCustomFormatter };

const defaultFormatter = createCodeFrameFormatter({});

function uuiCustomFormatter(issue) {
    function formatIssueLocation(location) {
        return `${location.start.line}:${location.start.column}`;
    }
    function norm(p) {
        return path.normalize(p).replace(/\\+/g, '/');
    }
    const formattedIssue = defaultFormatter(issue);
    if (issue.file) {
        // Next line is the main reason why we created custom formatter
        // We want error location to be clickable in WebStorm console log.
        // In order to make it clickable, the location must be absolute or relative to the root folder, but not relative to "app".
        //
        let location = norm(issue.file);
        location = 'at ' + location;
        if (issue.location) {
            location += `:${formatIssueLocation(issue.location)}`;
        }
        return `${location}${os.EOL}${formattedIssue}`;
    }
    return formattedIssue;
}
