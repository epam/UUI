const { Router } = require('express');

const router = Router();
const helpers = require('../helpers/index.js');
const _ = require('lodash');

function calculateTotal(totalData, result) {
    const totalSalary = totalData.reduce((acc, person) => acc + person.salary, 0).toFixed(1);
    // const totalSalary = totalData.reduce((acc, person) => acc + Number(person.salary.split("$")[1]), 0).toFixed(1);
    result.summary = { totalSalary };
    result.totalCount = totalData.length;
    return result;
}

function filterAndSort(request, allItems, typeName) {
    let items = allItems || [];
    request = request || {};

    if (request.search) {
        const searchString = request.search.toLowerCase();
        items = items.filter((row) => row.name.toLowerCase().indexOf(searchString) >= 0);
    }

    if (request.ids) {
        request.filter = request.filter || {};
        request.filter.id = { in: request.ids };
    }

    if (request.filter) {
        const predicate = helpers.getFilterPredicate(request.filter);
        items = items.filter(predicate);
    }

    if (request.sorting) {
        const comparer = helpers.getOrderComparer(request.sorting);
        items.sort(comparer);
    } else {
        items = _.orderBy(items, 'name');
    }

    if (request.range) {
        const from = request.range.from || 0;
        const count = request.range.count == null ? items.length : request.range.count;
        items = items.slice(from, from + count);
    }

    if (typeName) {
        items.forEach((i) => {
            i.__typename = typeName;
        });
    }

    return {
        items,
        // While we definitely can return count here, we don't do this.
        // It's optional, and we need to test real-life scenarios.
        // If needed, we can add an option like "computeCount" to request
        // count: filteredAndSorted.length,
    };
}

function group(request, allItems, typeName, getGroupId = (groupId) => groupId) {
    request = request || {};

    const { search, filter: { groupBy, ...filter } = {}, ...groupingRequest } = request;

    let groups = [];
    const items = filterAndSort({ search, filter }, allItems).items;
    const groupIdFieldName = `${groupBy}Id`;
    const grouped = _.groupBy(items, groupIdFieldName);

    Object.keys(grouped).forEach((groupIdStr) => {
        const groupId = getGroupId(groupIdStr === 'undefined' ? 0 : groupIdStr); // null-values are grouped under groupId = 0
        const groupedItem = grouped[groupIdStr];
        const name = groupedItem[0][groupBy] || groupedItem[0][`${groupBy}Name`];
        groups.push({
            count: group.length,
            groupBy,
            id: groupId,
            [groupIdFieldName]: groupId,
            name,
        });
    });

    groups = _.orderBy(groups, (g) => g.id && g.groupName);

    return filterAndSort(groupingRequest, groups, typeName);
}

[
    'continents', 'countries', 'languages', 'products',
].forEach((entitiesName) => {
    router.post(`/${entitiesName}`, async (req, res) => {
        const items = await helpers.getData(entitiesName);
        const result = filterAndSort(req.body, items);
        res.json(result);
    });
});

router.post('/locations', async (req, res) => {
    const locations = await helpers.getLocationTree();
    const result = filterAndSort(req.body, locations.list);
    result.items.forEach((l) => {
        l.childCount = locations.byParentId.get(l.id)?.length ?? 0;
    });
    res.json(result);
});

router.post('/locations/search-tree', async (req, res) => {
    const locations = await helpers.getLocationTree();
    const result = filterAndSort(req.body, locations.list);
    const searchTree = helpers.buildSearchTree(result.items, locations);

    res.json({ items: searchTree });
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
    const totalData = req.body.search || Object.keys(req.body.filter).length > 0 ? result.items : data.persons;
    res.json(calculateTotal(totalData, result));
});

router.post('/persons-paged', async (req, res) => {
    const data = await helpers.getPersons();
    const filteredAndSorted = filterAndSort({ ...req.body, range: null }, data.persons, 'Person');
    let result;
    if (req.body.pageNo != null || req.body.pageSize != null) {
        const pageSize = req.body.pageSize ?? 10;
        const pageNo = req.body.page ?? 1;
        const from = pageNo - 1;
        const items = filteredAndSorted.items.slice(from * pageSize, (from + 1) * pageSize);
        result = {
            items,
            totalCount: filteredAndSorted.items.length,
            count: req.body.page != null && items.length,
            pageCount: Math.ceil(filteredAndSorted.items.length / pageSize),
        };
    } else if (req.body.range) {
        const from = req.range.from || 0;
        const count = req.range.count == null ? filteredAndSorted.items.length : req.range.count;
        const items = filteredAndSorted.items.slice(from, from + count);
        result = { items, totalCount: filteredAndSorted.items.length };
    } else {
        const items = filteredAndSorted.items;
        result = { items, totalCount: filteredAndSorted.items.length };
    }

    res.json(result);
});

router.post('/personGroups', async (req, res) => {
    const data = await helpers.getPersons();
    const filter = req.body?.filter ?? {};
    let type, getGroupId;
    if (['jobTitle', 'department'].includes(filter.groupBy)) {
        type = 'PersonEmploymentGroup';
        getGroupId = (groupId) => +groupId;
    }
    if (['city', 'country'].includes(filter.groupBy)) {
        type = 'PersonLocationGroup';
    }

    const result = group(req.body, data.persons, type, getGroupId);
    res.json(calculateTotal(data.persons, result));
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
});

router.post('/managers', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.managers, 'Managers');
    res.json(result);
});

router.post('/offices', async (req, res) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.offices, 'Offices');
    res.json(result);
});

router.post('/todos', async (req, res) => {
    const data = await helpers.getData('todos');
    res.json(data);
});

router.post('/projectTasks', async (req, res) => {
    const data = await helpers.getProjectTasks();
    const result = filterAndSort(req.body, data.projectTasks, 'ProjectTasks');
    res.json(result);
});

module.exports = router;
