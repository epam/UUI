const { trackBundleSize } = require('../utils/trackBundleSize/trackBundleSize.js');
const { hasCliArg } = require('../utils/cmdUtils.js');

const overrideBaseline = hasCliArg('--override-baseline');

trackBundleSize({ overrideBaseline });
