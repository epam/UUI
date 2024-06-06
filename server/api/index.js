const express = require('express');

const router = express.Router();
const getCode = require('./getCode');
const templateEndpoint = require('./templateEndpoint');
const testDataApis = require('./testDataApis');
const getChangelog = require('./getChangelog');
const docsApi = require('./docs');
const tsDocsApi = require('./docsGen');
const themeTokensApi = require('./themeTokens');
const errorApi = require('./error');
const formApi = require('./form');
const RTEDemoApi = require('./RTEDemoApi');

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
router.use(jsonParser);

router.use(getChangelog);
router.use(getCode);
router.use(templateEndpoint);
router.use(testDataApis);
router.use(docsApi);
router.use(tsDocsApi);
router.use(themeTokensApi);
router.use(errorApi);
router.use(formApi);
router.use(RTEDemoApi);

module.exports = router;
