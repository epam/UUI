import { LockContext } from "../LockContext";

class RouterMock {
    listeners = [];

    constructor() {
        this.listen = this.listen.bind(this);
    }

    listen(listener: Function) {
        console.log("pushed listener");
        this.listeners.push(listener);
    }

    emit() {
        console.log("EMIT");
        this.listeners.forEach(l => l());
    }
}

describe("LockContext", () => {
    it("should ", () => {
        const context = new LockContext(new RouterMock() as any);
        
    });
});