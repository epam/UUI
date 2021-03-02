var express = require('express');
var router = express.Router();
const helpers = require('../helpers');
const _ = require('lodash');

function filterAndSort(request, allItems, typeName) {
    let items = allItems || [];
    request = request || {};

    if (request.search) {
        const searchString = request.search.toLowerCase()
        items = items.filter(row => row.name.toLowerCase().indexOf(searchString) >= 0);
    }

    if (request.ids) {
        request.filter = request.filter || {};
        request.filter.id = { in: request.ids };
    }

    if (request.filter) {
        const predicate = helpers.getPatternPredicate(request.filter);
        items = items.filter(predicate);
    }

    if (request.sorting) {
        const comparer = helpers.getOrderComparer(request.sorting);
        items.sort(comparer);
    } else {
        items = _.orderBy(items, 'name');
    }

    const filteredAndSorted = items;

    if (request.range) {
        const from = request.range.from || 0;
        const count = request.range.count == null ? items.length : request.range.count;
        items = items.slice(from, from + count);
    }

    if (typeName) {
        items.forEach(i => { i.__typename = typeName; });
    }

    return {
        items,
        // While we definitely can return count here, we don't do this. It's optional, and we need to test real-life scenarios.
        // If needed, we can add an option like "computeCount" to request
        //count: filteredAndSorted.length,
    };
};

function group(request, allItems, typeName) {
    request = request || {};
    const items = filterAndSort(request.itemsRequest, allItems).items;
    filter = request.filter || {};

    let groups = [];
    const groupBy = filter.groupBy;
    const groupIdFieldName = `${groupBy}Id`;
    const grouped = _.groupBy(items, groupIdFieldName);
    Object.keys(grouped).forEach((groupIdStr) => {
        const groupId = groupIdStr === 'undefined' ? 0 : +groupIdStr; // null-values are grouped under groupId = 0
        const group = grouped[groupIdStr];
        const name = (group[0])[groupBy] || (group[0])[groupBy + 'Name'];
        groups.push({
            id: groupId,
            [groupIdFieldName]: groupId,
            name,
            groupBy,
            count: group.length,
        });
    });
    groups = _.orderBy(groups, (g) => g.id && g.groupName);

    return filterAndSort(request, groups, typeName);
}

['continents', 'countries', 'languages', 'products'].forEach(entitiesName => {
    router.post('/' + entitiesName, async (req, res) => {
        const items = await helpers.getData(entitiesName);
        const result = filterAndSort(req.body, items);
        res.json(result);
    });
});

router.post('/locations', async (req, res) => {
    const locations = await helpers.getLocationTree();
    const result = filterAndSort(req.body, locations.list);
    result.items.forEach(l => l.childCount = locations.byParentId.get(l.id)?.length ?? 0);
    res.json(result);
});

router.post('/cities', async (req, res) => {
    const items = await helpers.getCities();
    const result = filterAndSort(req.body, items);
    res.json(result);
});

router.post('/schedules', async (req, res) => {
    const data = await helpers.getData('schedules');
    res.json(data);
});

router.post('/persons', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.persons, 'Person');
    res.json(result);
});

router.post('/personGroups', async (req, res) => {
    const data = await helpers.getPersons();
    const result = group(req.body, data.persons, 'PersonGroup');
    res.json(result);
});

router.post('/departments', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.departments, 'Department');
    res.json(result);
});

router.post('/jobTitles', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.jobTitles, 'JobTitle');
    res.json(result);
});

router.post('/statuses', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.statuses, 'Statuses');
    res.json(result);
})

router.post('/managers', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.managers, 'Managers');
    res.json(result);
})

router.post('/offices', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.offices, 'Offices');
    res.json(result);
})

module.exports = router;