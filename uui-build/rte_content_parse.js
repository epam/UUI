const fs = require('fs');
const path = require('path');

const itemsArray = require('/Users/Aliaksei_Manetau/Downloads/pages_202305121258.json');

itemsArray.forEach(function (item, index) {
    const docContentPath = path.join(__dirname, '../', 'public/rte_content', `content_${index}.json`);

    fs.writeFileSync(docContentPath, JSON.stringify(item));
});
