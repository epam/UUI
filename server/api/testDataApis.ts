import { Router } from 'express';
import * as helpers from '../helpers/index';
import _ from 'lodash';
import { getFilterPredicate, getOrderComparer } from '@epam/uui-core';
import { undefined } from 'zod';

const router = Router();

function calculateTotal(totalData: any, result: any) {
    const totalSalary = totalData.reduce((acc: any, person: any) => acc + person.salary, 0).toFixed(1);
    // const totalSalary = totalData.reduce((acc, person) => acc + Number(person.salary.split("$")[1]), 0).toFixed(1);
    result.summary = { totalSalary };
    result.totalCount = totalData.length;
    return result;
}

function filterAndSort(request: any, allItems: any, typeName: any) {
    let items = allItems || [];
    request = request || {};

    if (request.search) {
        const searchString = request.search.toLowerCase();
        items = items.filter((row: any) => row.name.toLowerCase().indexOf(searchString) >= 0);
    }

    if (request.ids) {
        request.filter = request.filter || {};
        request.filter.id = { in: request.ids };
    }

    if (request.filter) {
        const predicate = getFilterPredicate(request.filter);
        items = items.filter(predicate);
    }

    if (request.sorting) {
        const comparer = getOrderComparer(request.sorting);
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
        items.forEach((i: any) => {
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

function group(request: any, allItems: any, typeName: any, getGroupId: any = (groupId: any) => groupId) {
    request = request || {};

    const { search, filter: { groupBy, ...filter } = { groupBy: undefined }, sorting, ...groupingRequest } = request;

    let groups: any[] = [];
    const items = filterAndSort({ sorting, search, filter }, allItems, typeName).items;
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

    groups = _.orderBy(groups, (g: any) => g.id && g.groupName);

    return filterAndSort(groupingRequest, groups, typeName);
}

['continents', 'countries', 'languages', 'products'].forEach((entitiesName) => {
    router.post(`/${entitiesName}`, async (req: any, res: any) => {
        const items = await helpers.getData(entitiesName);
        const result = filterAndSort(req.body, items, undefined);
        res.json(result);
    });
});

router.post('/locations', async (req: any, res: any) => {
    const locations = await helpers.getLocationTree();
    const result = filterAndSort(req.body, locations.list, undefined);
    result.items.forEach((l: any) => {
        l.childCount = locations.byParentId.get(l.id)?.length ?? 0;
    });
    res.json(result);
});

router.post('/locations/search-tree', async (req: any, res: any) => {
    const locations = await helpers.getLocationTree();
    const result = filterAndSort(req.body, locations.list, undefined);
    const searchTree = helpers.buildSearchTree(result.items, locations);

    res.json({ items: searchTree });
});

router.post('/cities', async (req: any, res: any) => {
    const items = await helpers.getCities();
    const result = filterAndSort(req.body, items, undefined);
    res.json(result);
});

router.post('/schedules', async (req: any, res: any) => {
    const data = await helpers.getData('schedules');
    res.json(data);
});

router.post('/persons', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.persons, 'Person');
    const totalData = req.body.search || Object.keys(req.body.filter).length > 0 ? result.items : data.persons;
    res.json(calculateTotal(totalData, result));
});

router.post('/persons-paged', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const filteredAndSorted = filterAndSort({ ...req.body, range: null }, data.persons, 'Person');
    let result;
    if (req.body.page != null || req.body.pageSize != null) {
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

router.post('/personGroups', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const filter = req.body?.filter ?? {};
    let type, getGroupId;
    if (['jobTitle', 'department'].includes(filter.groupBy)) {
        type = 'PersonEmploymentGroup';
        getGroupId = (groupId: any) => +groupId;
    }
    if (['city', 'country'].includes(filter.groupBy)) {
        type = 'PersonLocationGroup';
    }

    const result = group(req.body, data.persons, type, getGroupId);
    res.json(calculateTotal(data.persons, result));
});

router.post('/departments', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.departments, 'Department');
    res.json(result);
});

router.post('/jobTitles', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.jobTitles, 'JobTitle');
    res.json(result);
});

router.post('/statuses', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.statuses, 'Statuses');
    res.json(result);
});

router.post('/managers', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.managers, 'Managers');
    res.json(result);
});

router.post('/offices', async (req: any, res: any) => {
    const data = await helpers.getPersons();
    const result = filterAndSort(req.body, data.offices, 'Offices');
    res.json(result);
});

router.post('/projectTasks', async (req: any, res: any) => {
    const data = await helpers.getProjectTasks();
    const result = filterAndSort(req.body, data.projectTasks, 'ProjectTasks');
    res.json(result);
});

export default router;
