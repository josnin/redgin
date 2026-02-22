import { getUniqID, kebabToCamel } from '../utils'
import { customDirectives } from './directives'

/**
 * Type definition for the reactive expression.
 * 'this' is typed as the component instance.
 */
export type WatchExpression<T = any> = (this: T) => any

/**
 * The 'watch' utility used inside render().
 * It creates a placeholder and registers dependencies to the current component instance.
 */
export const watch = (refs: string[], exp?: WatchExpression) => {
  const uniqId = getUniqID()
  
  /**
   * CONTEXT RETRIEVAL:
   * Accesses the 'handshake' variable set by RedGin._init().
   * This identifies which of the 10,000 components is currently rendering.
   */
  const host = (window as any).__redgin_current_instance as any

  if (host) {
    // Register this uniqId under every property it depends on
    for (let i = 0; i < refs.length; i++) {
      const prop = refs[i]
      let propWatchers = host._watchRegistry.get(prop)
      
      if (!propWatchers) {
        propWatchers = new Map()
        host._watchRegistry.set(prop, propWatchers)
      }
      
      // Store the expression (callback) to be executed when 'prop' changes
      propWatchers.set(uniqId, exp!)
    }
    
    // Map the ID back to the props for easier cleanup later
    host._idToProps.set(uniqId, refs)
  }

  // Return a lightweight placeholder. RedGin will find this later and cache it.
  return `<in-watch data-watch="${uniqId}"></in-watch>`
}

/**
 * A tiny custom element that acts as a DOM anchor.
 * Its primary job is to trigger 'cleanup' when it is removed from the DOM.
 */
class InWatch extends HTMLElement {
  disconnectedCallback() {
    const uniqId = this.dataset.watch
    
    /**
     * DOM TRAVERSAL FOR CLEANUP:
     * Finds the parent component (host) by looking up the ShadowRoot.
     */
    const host = this.getRootNode() as ShadowRoot
    const comp = host?.host as any // 'host' on a ShadowRoot is the Custom Element instance
    
    if (uniqId && comp) {
      // Remove references from the component's internal Maps to prevent memory leaks
      comp._cleanupWatch(uniqId)
    }
  }
}

// Ensure the helper element is defined only once
if (!customElements.get('in-watch')) {
  customElements.define('in-watch', InWatch)
}

/**
 * LOCAL FLATTENER: 
 * Prevents "Array.toString()" from injecting commas in the UI.
 */
const _f = (v: any): string => {
  if (Array.isArray(v)) return v.map(_f).join(''); // Explicitly join with empty string
  if (v === undefined) return ''; // do not include boolean or null
  return String(v);
};

/**
 * THE PERFORMANCE ENGINE: watchFn Directive
 * This runs whenever a property is updated via requestUpdate().
 */
// inside watchFn directive
customDirectives.define(function watchFn(this: any, rawProp: string): boolean {
  const prop = kebabToCamel(rawProp);
  const propWatchers = this._watchRegistry.get(prop);
  if (!propWatchers) return false;

  let updated = false;

  for (const [uniqId, expression] of propWatchers) {
    let el = this._watchElements.get(uniqId);

    /**
     * OPTIMIZATION: Lazy Repair
     * If the element isn't in cache, OR it was detached from the DOM 
     * (e.g. by an outer watch's innerHTML swap), find it directly by ID.
     */
    if (!el || !el.isConnected) {
      // Using an ID selector is significantly faster than a general sweep
      el = this.shadowRoot.querySelector(`[data-watch="${uniqId}"]`);
      if (el) this._watchElements.set(uniqId, el);
    }

    if (el) {
      const value = expression ? expression.call(this) : this[prop];
       /**
       * SURGICAL CONVERSION:
       * We no longer rely on String(value). 
       * We use _f to ensure [ '<li>A</li>', '<li>B</li>' ] 
       * becomes '<li>A</li><li>B</li>' (No Commas).
       */
      const newVal = _f(value); 
      // console.log(prop, newVal, value, expression)
      //const newVal = value ?? '';
      
      // DIRTY CHECK: Only touch DOM if string actually changed
      if (el.innerHTML !== String(newVal)) {
        el.innerHTML = newVal;
        updated = true;
      }
    }
  }
  return updated;
});
