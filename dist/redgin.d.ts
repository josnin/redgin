export { event, emit, watch, customDirectives } from './directives/index';
export { getset, propReflect, customPropsBehavior } from './props/index';
export declare const attachShadow: ShadowRootInit;
export declare let injectStyles: string[];
export declare let defaultStyles: string[];
export declare const html: (raw: TemplateStringsArray, ...values: any[]) => string;
export declare const css: (raw: TemplateStringsArray, ...values: any[]) => string;
export declare class RedGin extends HTMLElement {
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(prop: any, oldValue: any, newValue: any): void;
    disconnectedCallback(): void;
    private updateContents;
    private setEventListeners;
    private setPropsBehavior;
    getStyles(styles: string[]): string;
    private _onInit;
    private _onDoUpdate;
    private _onUpdated;
    onInit(): void;
    onDoUpdate(): void;
    onUpdated(): void;
    styles: string[];
    render(): string;
}
