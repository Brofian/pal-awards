type Worker<T> = {(elements: T[]): Promise<void>};

/**
 * Helper class for periodically execute a callback for working up the elements of this array
 */
export default class QueueWorker<T> extends Array<T> {

    // configuration
    private readonly worker: Worker<T>;
    private readonly timeout: number = 1000;
    private readonly batchSize: number = 1;
    // internal
    private readonly workCallback: {(): void} = this.work.bind(this);
    private workTimer: Timer | number | undefined = undefined;

    public constructor(worker: Worker<T>, timeout: number, batchSize: number) {
        super();
        this.worker = worker;
        this.timeout = timeout;
        this.batchSize = batchSize;
    }

    public override push(...items: T[]): number {
        if (this.workTimer === undefined && items.length > 0) {
            this.workTimer = setTimeout(this.workCallback, this.timeout);
        }

        return super.push(...items);
    }

    /**
     * Please consider using push to keep the queue property intact and to improve performance
     *
     * @deprecated
     * @param items
     */
    public override unshift(...items: T[]): number {
        if (this.workTimer === undefined && items.length > 0) {
            this.workTimer = setTimeout(this.workCallback, this.timeout);
        }

        return super.unshift(...items);
    }

    /**
     * Periodically execute the worker callback on a batch of elements
     *
     * @private
     */
    private async work(): Promise<void> {
        const batch: T[] = this.splice(-this.batchSize);
        if (batch.length) {
            await this.worker(batch);
        }

        this.workTimer = undefined;
        if (this.length) {
            // if there are still items left, immediately plan the next iteration
            this.workTimer = setTimeout(this.workCallback, this.timeout);
        }
    }

}