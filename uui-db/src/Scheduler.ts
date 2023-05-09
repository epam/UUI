export interface SchedulerTask {
    run: () => Promise<any>;
    result?: any;
    error?: any;
    resolve?: (result: any) => void;
    reject?: (result: any) => void;
    isConcurrent: boolean;
}

export class Scheduler {
    scheduled: SchedulerTask[] = [];
    running: SchedulerTask[] = [];
    complete: SchedulerTask[] = [];
    public run(run: () => Promise<any>, isConcurrent = false) {
        return new Promise((resolve, reject) => {
            this.scheduled.push({
                run, isConcurrent, resolve, reject,
            });
            this.scheduleRun();
        });
    }

    isRunScheduled = false;
    private scheduleRun() {
        if (this.isRunScheduled) {
            return;
        }
        setTimeout(() => {
            this.isRunScheduled = false;
            this.runQueues();
        }, 0);
        this.isRunScheduled = true;
    }

    tasksRunning = 0;
    private runQueues() {
        while (this.scheduled.length > 0) {
            const pendingTask = this.scheduled[0];
            if (this.running.length > 0 && !pendingTask.isConcurrent) {
                break;
            }

            if (this.running.length > 0 && !this.running[0].isConcurrent) {
                break;
            }

            const task = this.scheduled.shift();
            this.running.push(task);
            task.run()
                .then((r) => {
                    task.result = r;
                })
                .catch((err) => {
                    task.error = err;
                })
                .finally(() => {
                    this.complete.push(task);
                    this.running = this.running.filter((t) => t !== task);
                    this.scheduleRun();
                });
        }

        while (this.complete.length > 0) {
            const task = this.complete.shift();
            if (task.error) {
                task.reject(task.error);
            } else {
                task.resolve(task.result);
            }
        }
    }
}
