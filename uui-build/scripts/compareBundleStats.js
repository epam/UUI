const { compareBundleStats } = require('../utils/collectBundleStatsUtils.js');
const { getCliArgValue } = require('../utils/cmdUtils.js');

const before = getCliArgValue('--before');
const after = getCliArgValue('--after');

compareBundleStats(before, after, true);
