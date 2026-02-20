import { getUniqID, kebabToCamel } from '../utils'
import { customDirectives } from './directives'
/**
 * watchProp: Specifically for component attributes/props.
 * Returns a marker string that the RedGin core parses as a "Directive on a Tag".
 */
/**
 * Type definition for the reactive expression.
 * 'this' is typed as the component instance.
 */
type WatchExpression<T = any> = (this: T) => any
export const attr = (refs: string[], attrName: string, exp?: WatchExpression) => {
  const uniqId = getUniqID();
  const host = (window as any).__redgin_current_instance as any;

  if (host) {
    for (const prop of refs) {
      // Use a separate registry specifically for attributes to avoid clashing with 'watch'
      if (!host._attrRegistry) host._attrRegistry = new Map();
      
      let attrWatchers = host._attrRegistry.get(prop);
      if (!attrWatchers) {
        attrWatchers = new Map();
        host._attrRegistry.set(prop, attrWatchers);
      }
      // Store specific attribute config
      attrWatchers.set(uniqId, { attrName, exp });
    }
  }
  return `data-attr__${attrName}="${uniqId}"`;
};

customDirectives.define(function attrFn(this: any, rawProp: string): boolean {
  const prop = kebabToCamel(rawProp);
  const attrWatchers = this._attrRegistry?.get(prop);
  if (!attrWatchers) return false;

  let updated = false;

  for (const [uniqId, config] of attrWatchers) {
    let el = this._watchElements.get(uniqId);
    
    if (!el || !el.isConnected) {
      el = this.shadowRoot.querySelector(`[data-attr__${config.attrName}="${uniqId}"]`);
      if (el) this._watchElements.set(uniqId, el);
    }


    if (el) {
      const value = config.exp ? config.exp.call(this) : this[prop];
      const attrName = config.attrName;

      /**
       * THE BOOLEAN FIX:
       * If value is strictly false, null, or undefined, remove the attribute.
       * This ensures <button disabled> becomes <button> (enabled).
       */
      if (value === false || value === null || value === undefined) {
        if (el.hasAttribute(attrName)) {
          el.removeAttribute(attrName);
          updated = true;
        }
      } else {
        // For true or any string/number, set the attribute
        // If it's true, we set an empty string (standard HTML practice)
        const newVal = value === true ? '' : String(value);
        if (el.getAttribute(attrName) !== newVal) {
          el.setAttribute(attrName, newVal);
          updated = true;
        }
      }
    }
  }
  return updated;
});
