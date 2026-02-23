import { WatchExpression } from './directives/index';
export { on, event, // to obsolete
emit, s, watch, attr, customDirectives, } from './directives/index';
export { getset, propReflect, customPropsBehavior } from './props/index';
export declare const shared: string[];
export declare const defaultStyle = ":host{display:block}";
/**
 * Handles style injection with support for adoptedStyleSheets (faster memory sharing)
 * and standard <style>/<link> fallbacks.
 */
export declare function _applyStyle(styles: string | string[], shadowRoot?: ShadowRoot): string;
/**
 * Add global styles that will be applied to every RedGin component
 */
export declare function shareStyle(style: string): void;
/**
 * THE SURGICAL FLATTENER:
 * 1. Recursively flattens arrays.
 * 2. Joins with EMPTY STRING '' (kills the comma). --> Note: watcher do this
 * 3. Filters out 'dead' values (null, undefined, false).
 */
export declare const _f: (v: any) => string;
export declare const html: (raw: TemplateStringsArray, ...vals: any[]) => string;
export declare const safe: (val: any) => string;
export declare const css: (raw: TemplateStringsArray, ...vals: any[]) => string;
export declare class RedGin extends HTMLElement {
    private _pending;
    private _changed;
    private _connected;
    private _reactiveCache;
    /**
     * INSTANCE-LEVEL CACHING
     * These Maps allow O(1) lookups for data-binding.
     * We store direct references to HTMLElements so we never use querySelector during updates.
     */
    _watchRegistry: Map<string, Map<string, WatchExpression<any>>>;
    _idToProps: Map<string, string[]>;
    _watchElements: Map<string, HTMLElement>;
    _attrRegistry: Map<string, Map<string, WatchExpression<any>>>;
    _attrElements: Map<string, HTMLElement>;
    _eventElements: Map<string, HTMLElement>;
    styles: string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(prop: string, oldV: any, newV: any): void;
    /**
     * Schedules a DOM update using a Microtask.
     * If 5 properties change at once, only 1 DOM update is triggered.
     */
    protected requestUpdate(prop: string): void;
    /**
     * The "Tick" where DOM updates actually happen.
     */
    private _flush;
    /**
     * Initial setup: Sets up props, applies styles, renders HTML, and caches DOM nodes.
     */
    private _init;
    private _collectElements;
    /**
     * Garbage collection: Removes watcher references when an <in-watch> element is removed.
     */
    _cleanupWatch(uniqId: string): void;
    /**
     * First-time synchronization of property values to DOM.
     */
    private _sync;
    /**
     * Core update logic: Calls registered directives (like watchFn)
     */
    private _update;
    /**
     * Lifecycle hook triggered after DOM updates are finished.
     */
    private _afterUpdate;
    private _afterUpdateNoDomChange;
    /**
     * Identifies all class properties to be made reactive.
     * Caches the list to avoid repeat CPU-heavy property reflection.
     */
    private _setupProps;
    private _reactiveProps;
    onInit(): void;
    onDoUpdate(): void;
    onUpdated(): void;
    render(): string;
}
