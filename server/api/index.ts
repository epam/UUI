import express from 'express';
import getCode from './getCode';
import testDataApis from './testDataApis';
import getChangelog from './getChangelog';
import docsApi from './docs';
import tsDocsApi from './docsGen';
import themeTokensApi from './themeTokens';
import errorApi from './error';
import formApi from './form';
import RTEDemoApi from './RTEDemoApi';
import bodyParser from 'body-parser';
import { mcpApis } from '../mcp/apis';

const router = express.Router();
const jsonParser = bodyParser.json();
router.use(jsonParser);

router.use(mcpApis);
router.use(getChangelog);
router.use(getCode);
router.use(testDataApis);
router.use(docsApi);
router.use(tsDocsApi);
router.use(themeTokensApi);
router.use(errorApi);
router.use(formApi);
router.use(RTEDemoApi);

export default router;
