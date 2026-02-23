export type EventHandler = (this: any, e: any) => any;
export declare const event: (type: string, fn: EventHandler) => string;
/**
 * Alias for 'event'. Moving forward, use 'on' for a more
 * declarative feel (e.g., on('click', ...))
 */
export declare const on: (type: string, fn: EventHandler) => string;
export declare function emit(this: any, customEvent: string, value: any, options?: CustomEvent): void;
/**
 * Attach all events for this component
 */
export declare function applyEventListeners(this: any): void;
/**
 * Remove all events for this component
 */
export declare function removeEventListeners(this: any): void;
