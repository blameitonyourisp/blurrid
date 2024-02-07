export type workerCb = () => Worker;
export type workerEventCb = (event: any) => void;
export type EnqueuedWorker = {
    message: any;
    callback: workerEventCb;
};
/**
 * @file Class for managing multiple workers up to a specified limit.
 * @author James Reid
 */
/**
 * @callback workerCb
 * @returns {Worker}
 */
/**
 * @callback workerEventCb
 * @param {any} event
 * @returns {void}
 */
/**
 * @typedef {object} EnqueuedWorker
 * @property {any} message
 * @property {workerEventCb} callback
 */
export class WorkerManager {
    /**
     *
     * @param {workerCb} callback
     * @param {object} obj
     * @param {number} [obj.limit]
     */
    constructor(callback: workerCb, { limit }?: {
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
     * @param {workerEventCb} callback
     */
    postWorker(worker: Worker, message: any, callback: workerEventCb): void;
    /**
     *
     * @param {any} message
     * @param {workerEventCb} callback
     */
    enqueue(message: any, callback: workerEventCb): void;
    #private;
}
