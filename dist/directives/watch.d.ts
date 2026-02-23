/**
 * Type definition for the reactive expression.
 * 'this' is typed as the component instance.
 */
export type WatchExpression<T = any> = (this: T) => any;
/**
 * The 'watch' utility used inside render().
 * It creates a placeholder and registers dependencies to the current component instance.
 */
export declare const watch: (refs: string[], exp?: WatchExpression) => string;
