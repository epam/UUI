const { trackBundleSize } = require('../utils/bundleStatsUtils/trackBundleSize.js');
const { hasCliArg } = require('../utils/cmdUtils.js');
const path = require("path");
const {uuiRoot} = require("../utils/constants");
const {TRACK_BUNDLE_SIZE_REPORT_MD} = require("../utils/bundleStatsUtils/bundleStatsConstants");
const {createFileSync} = require("../utils/fileUtils");

//const overrideBaseline = hasCliArg('--override-baseline');

//trackBundleSize({ overrideBaseline });

const crPathResolved = path.resolve(uuiRoot, TRACK_BUNDLE_SIZE_REPORT_MD);
createFileSync(crPathResolved, '# *** test md content! ***');
