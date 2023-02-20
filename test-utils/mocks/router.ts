export class RouterMock {
    listeners = [] as Function[];

    listen(listener: Function) {
        this.listeners.push(listener);
    }

    block() {}
}
