/**
 * @file Class for managing multiple workers up to a specified limit.
 * @author James Reid
 */
export class WorkerManager {
    /**
     *
     * @param {()=>Worker} callback
     * @param {object} obj
     * @param {number} [obj.limit]
     */
    constructor(callback: () => Worker, { limit }?: {
        limit?: number | undefined;
    });
    /**
     *
     * @returns {Worker}
     */
    addWorker(): Worker;
    /**
     *
     * @param {Worker} worker
     * @param {any} message
     * @param {(event:any)=>void} callback
     */
    postWorker(worker: Worker, message: any, callback: (event: any) => void): void;
    /**
     *
     * @param {any} message
     * @param {(event:any)=>void} callback
     */
    enqueue(message: any, callback: (event: any) => void): void;
    #private;
}
