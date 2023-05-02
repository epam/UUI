const { trackBundleSize } = require('../utils/trackBundleSize/trackBundleSize.js');
const { hasCliArg } = require('../utils/cmdUtils.js');
const {saveComparisonResultsMd} = require('../utils/trackBundleSize/trackBundleSizeFileUtils');

const overrideBaseline = hasCliArg('--override-baseline');

saveComparisonResultsMd('Test!');
