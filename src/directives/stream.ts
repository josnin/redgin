import { getUniqID } from '../utils'

/**
 * Type definition for the reactive expression.
 * 'this' is typed as the component instance.
 */
type WatchExpression<T = any> = (this: T) => any

/**
 * The 's' (stream) utility: Provides "Auto-Tracked" reactivity.
 * 
 * Unlike standard 'watch', it treats the expression as a dynamic stream.
 * It surgically extracts dependencies via regex from the function source, 
 * removing the need for manual reference arrays.
 * 
 * It creates a placeholder <in-watch> and registers it to the component 
 * instance for O(1) targeted updates.
 */
export const s = (exp: WatchExpression) => {
  const uniqId = getUniqID();
  const host = (window as any).__redgin_current_instance as any;

  if (host) {
    /**
     * AUTO-TRACKING DISCOVERY: 
     * Scans the expression source code for 'this.property' access.
     */
    const fnStr = exp.toString();
    const regex = /this\.([a-zA-Z_$][\w$]*)/g;
    let match;
    const dependencies = new Set<string>();

    while ((match = regex.exec(fnStr)) !== null) {
      const propName = match[1];

      /**
       * VALIDATION: 
       * Only stream properties that are managed by RedGin (getset/propReflect).
       */
      if (host._reactiveCache?.includes(propName)) {
        dependencies.add(propName);
      }
    }

    /**
     * STREAM REGISTRATION: 
     * Bridges the property change to the targeted DOM update.
     */
    for (const prop of dependencies) {
      let propWatchers = host._watchRegistry.get(prop);
      if (!propWatchers) {
        propWatchers = new Map();
        host._watchRegistry.set(prop, propWatchers);
      }
      propWatchers.set(uniqId, exp);
    }
    
    // Cleanup mapping for memory management
    host._idToProps.set(uniqId, Array.from(dependencies));
  }

  // Surgical DOM anchor for Path A updates
  return `<in-watch data-watch="${uniqId}"></in-watch>`;
};
