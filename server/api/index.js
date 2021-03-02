var express = require('express');
var router = express.Router();
var getCode = require('./getCode');
var templateEndpoint = require('./templateEndpoint');
var testDataApis = require('./testDataApis');
var getChangelog = require('./getChangelog');
var docsApi = require('./docs');
var errorApi = require('./error');
const successApi = require('./success');

const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
router.use(jsonParser);

router.use(getChangelog);
router.use(getCode);
router.use(templateEndpoint);
router.use(testDataApis);
router.use(docsApi);
router.use(errorApi);
router.use(successApi);

module.exports = router;