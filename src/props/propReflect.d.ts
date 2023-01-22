interface IPropReflect<T = any> {
    serializerFn?: (this: any, prop: string, type: any, _default: T) => T;
    deserializerFn?: (this: any, prop: string, type: any, _default: T, value: T) => void;
    type?: any;
    name?: string;
}
export declare function propReflect<T>(value: T, options?: IPropReflect<T>): T;
export {};
