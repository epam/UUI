const { trackBundleSize } = require('../utils/bundleStatsUtils/trackBundleSize.js')
const {hasCliArg} = require("../utils/cmdUtils");

const overrideBaseline = hasCliArg('--override-baseline');

trackBundleSize({ overrideBaseline })
