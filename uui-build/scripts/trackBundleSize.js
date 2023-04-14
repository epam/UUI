const { trackBundleSize } = require('../utils/bundleStatsUtils/trackBundleSize.js');
const { hasCliArg } = require('../utils/cmdUtils.js');

const overrideBaseline = hasCliArg('--override-baseline');

trackBundleSize({ overrideBaseline });
