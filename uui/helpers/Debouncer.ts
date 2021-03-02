export class Debouncer<Request, Response> {
    constructor(
        private execute: (rq: Request) => Promise<Response>,
        private handleResult: (res: Response, rq: Request) => void,
    ) {
    }

    private isLoading = false;
    private isPending = false;
    public pendingRequest: Request;
    private lastPendingRequestTime: Date | null = null;
    private debounceDelay = 500;    
    private timer: any = null;

    public run(rq: Request): void {        
        this.isPending = true;
        this.pendingRequest = rq;
        this.lastPendingRequestTime = new Date();
        this.onTimer();
    }

    private onTimer() {
        if (this.isLoading) {
            return;
        }

        if (this.isPending) {

            const rq = this.pendingRequest;
            const runNow = ((new Date()).getTime() - this.lastPendingRequestTime!.getTime() > this.debounceDelay);

            if (runNow) {
                this.isLoading = true;
                this.isPending = false;                
                this.execute(rq).then((res) => {
                    this.isLoading = false;                                   
                    this.handleResult(res, rq);       
                    this.onTimer();             
                }).catch(reason => console.error(reason));
            } else {                
                this.timer = window.setTimeout(() => this.onTimer(), 100);                
            }
        }
    }
    
    public isInProgress() {        
        return this.isLoading || this.isPending;
    }
}
