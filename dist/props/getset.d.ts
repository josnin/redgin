/**
 * Options for the getset behavior.
 * forWatch: determines if changing this property should trigger a DOM update.
 */
interface IGetSet {
    forWatch?: boolean;
}
/**
 * Factory function to mark a property as reactive state.
 * Usage: myData = getset(0)
 */
export declare function getset<T>(value: T, options?: IGetSet): T;
export {};
