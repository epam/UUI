import { DemoDb, blankDemoDb, DemoDbTables } from './DemoDb';
import { PersonEmploymentGroup } from '@epam/uui-docs';
import { LazyDataSourceApiResponse } from '@epam/uui-core';
import { DbRef, DbSaveResponse } from '@epam/uui-db';
import { svc } from '../../../services';

export class DemoDbRef extends DbRef<DemoDbTables, DemoDb> {
    constructor() {
        super(blankDemoDb);
    }

    protected savePatch(): Promise<DbSaveResponse<DemoDbTables>> {
        return Promise.resolve({ submit: {} });
    }

    public personsLoader = this.makeListLoader({
        api: svc.api.demo.persons,
        convertToPatch: (r) => ({ persons: r.items }),
        clientToServerRequest: this.idMap.clientToServerRequest,
    });

    public departmentsLoader = this.makeListLoader({
        api: svc.api.demo.departments,
        convertToPatch: (r) => ({ departments: r.items }),
        clientToServerRequest: this.idMap.clientToServerRequest,
    });

    public jobTitlesLoader = this.makeListLoader({
        api: svc.api.demo.jobTitles,
        convertToPatch: (r) => ({ jobTitles: r.items }),
        clientToServerRequest: this.idMap.clientToServerRequest,
    });

    public personGroupsLoader = this.makeListLoader<PersonEmploymentGroup, LazyDataSourceApiResponse<PersonEmploymentGroup>>({
        api: svc.api.demo.personGroups,
        convertToPatch: (r) => ({ personGroups: r.items }),
        clientToServerRequest: this.idMap.clientToServerRequest,
    });
}
