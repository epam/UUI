const express = require('express');

const router = express.Router();
const getCode = require('./getCode');
const templateEndpoint = require('./templateEndpoint');
const testDataApis = require('./testDataApis');
const getChangelog = require('./getChangelog');
const docsApi = require('./docs');
const tsDocsApi = require('./docsGen');
const errorApi = require('./error');
const successApi = require('./success');
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
router.use(errorApi);
router.use(successApi);
router.use(RTEDemoApi);

module.exports = router;
