import { emptyDb, sampleDb, sampleData } from './TaskDb';
import { DbRef } from '../index';

describe("db - DbRef query and updates", () => {
    describe("Basic updates", () => {
        it("user by id with query/one", () => {
            const db = new DbRef(sampleDb);
            db.commitFetch(sampleData);
            expect(db.db.users.byId('DT').name).toEqual("Daenerys Targaryen");
            db.commit({ users: [{ id: 'DT', name: "Daenerys Snow" }] });
            expect(db.db.users.byId('DT').name).toEqual("Daenerys Snow");
        });
    });

    describe("Basic lenses", () => {
        it("update with entity lens", () => {
            const db = new DbRef(sampleDb);
            db.commitFetch(sampleData);
            // const lens = db.entityLens('users', { id: 'DT' });
            // expect(lens.get().name).eq("Daenerys Targaryen");
            // lens.update({ name: "Daenerys Snow" });
            // expect(lens.get().name).eq("Daenerys Snow");
            // lens.prop('name').onValueChange("Ivan");
            // expect(lens.get().name).eq("Ivan");
        });
    });
});
