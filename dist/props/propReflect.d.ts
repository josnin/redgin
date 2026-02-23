/**
 * Interface for propReflect options.
 * Allows custom conversion logic and explicit type declarations.
 */
interface IPropReflect<T = any> {
    serializerFn?: (this: any, prop: string, type: any, _default: T) => T;
    deserializerFn?: (this: any, prop: string, type: any, _default: T, value: T) => void;
    type?: any;
    name?: string;
}
/**
 * Marks a property for reflection.
 * Usage: myProp = propReflect(false)
 */
export declare function propReflect<T>(value: T, options?: IPropReflect<T>): T;
export {};
