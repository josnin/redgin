export declare const event: (type: string, fn: any) => string;
export declare function emit(this: any, customEvent: string, value: any, options?: CustomEvent): void;
export declare function applyEventListeners(this: any): void;
export declare function removeEventListeners(this: any): void;
