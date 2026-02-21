/* ============================================================
 * RedGin – Core + Styles + Events (Optimized)
 * ========================================================== */

import {
  applyDirectives,
  applyEventListeners,
  removeEventListeners,
  WatchExpression,
} from './directives/index'

import { applyPropsBehavior } from './props/index'

// Re-exporting utilities for public use
export { 
  on,
  event, // to obsolete
  emit, 
  s, 
  watch,
  attr,
  customDirectives,
} from './directives/index'

export { 
  getset, 
  propReflect, 
  customPropsBehavior 
} from './props/index'

/* ============================================================
 * Styles Logic
 * ========================================================== */

// Cache for constructed stylesheets to ensure CSS is parsed only once and shared across instances
const _sheetCache = new Map<string, CSSStyleSheet>()
export const shared: string[] = []
export const defaultStyle = ':host{display:block}'

/**
 * Handles style injection with support for adoptedStyleSheets (faster memory sharing)
 * and standard <style>/<link> fallbacks.
 */
export function _applyStyle(styles: string | string[], shadowRoot?: ShadowRoot) {
  const arr = Array.isArray(styles) ? styles : [styles]
  const fallback: string[] = []
  if (!shadowRoot) return arr.join('')

  for (const s of arr) {
    // 1. Handle External CSS via <link>
    if (s.startsWith('<link')) {
      const href = s.match(/href="([^"]+)"/)?.[1]
      // Only append if the link doesn't already exist in this shadowRoot
      if (href && !shadowRoot.querySelector(`link[href="${href}"]`)) {
        const temp = document.createElement('div')
        temp.innerHTML = s
        const link = temp.firstElementChild as HTMLLinkElement
        if (link) shadowRoot.appendChild(link)
      }
      continue
    }

    // 2. Handle Adoptable inline styles (Constructable Stylesheets)
    // Allows 10k components to use the same CSS object in memory
    if ('adoptedStyleSheets' in shadowRoot) {
      let sheet = _sheetCache.get(s)
      if (!sheet) {
        sheet = new CSSStyleSheet()
        sheet.replaceSync(s)
        _sheetCache.set(s, sheet)
      }
      shadowRoot.adoptedStyleSheets = [
        ...shadowRoot.adoptedStyleSheets,
        sheet,
      ]
      continue
    }

    // 3. Fallback for older browsers
    fallback.push(`<style>${s}</style>`)
  }

  return fallback.join('')
}

/**
 * Add global styles that will be applied to every RedGin component
 */
export function shareStyle(style: string) {
  if (!shared.includes(style)) shared.push(style)
}

/* ============================================================
 * Template Tag
 * ========================================================== */

/**
 * Fast escape for HTML special characters to prevent XSS.
 */
const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * RE_TRUSTED: Expanded to detect structural HTML.
 * If a string contains these, it's likely a RedGin Template, not user input.
 */
const RE_TRUSTED = /<[a-z/]|data-|class=|style=|id=|type=|disabled|checked|selected|slot=/i;

export const sanitize = (val: any): string => {
  // 1. Convert non-strings (numbers/booleans) to string immediately
  if (typeof val !== 'string') return String(val ?? '');

  // 2. TRUST CHECK:
  // - <[a-z/] matches tags like <div>, <button>, or </div>
  // - type=, disabled, checked covers form-heavy components
  // - slot= covers your shadow DOM compositions
  if (RE_TRUSTED.test(val)) {
    return val; 
  }

  // 3. SECURE ESCAPE:
  // Only runs on "naked" strings like product names or user bios.
  return val.replace(/[&<>"']/g, (s) => ESCAPE_MAP[s]);
};


/**
 * Template Tag with Built-in Sanitization
 * Automatically escapes values while preserving RedGin directives.
 */
export const html = (raw: TemplateStringsArray, ...vals: any[]) => {
  const result = raw.reduce((acc, str, i) => {
    const val = vals[i];
    
    // If it's an array (from a .map()), sanitize each item and join
    const processedVal = Array.isArray(val) 
      ? val.map(v => sanitize(v)).join('') 
      : sanitize(val);
      
    return acc + str + (processedVal ?? '');
  }, '');
  return result;
};


export const css = html

/* ============================================================
 * RedGin Component
 * ========================================================== */

export class RedGin extends HTMLElement {

  private _pending = false              // Flag to batch multiple property changes into one update
  private _changed = new Set<string>()  // Tracks which properties changed during a tick
  private _connected = false            // Ensures initialization runs only once
  private _reactiveCache: string[] = [] // Cached list of properties to avoid repeat reflection

  /**
   * INSTANCE-LEVEL CACHING
   * These Maps allow O(1) lookups for data-binding. 
   * We store direct references to HTMLElements so we never use querySelector during updates.
   */
  _watchRegistry = new Map<string, Map<string, WatchExpression>>() // prop -> { id: callback }
  _idToProps = new Map<string, string[]>()                         // watchId -> [relatedProps]
  _watchElements = new Map<string, HTMLElement>()                  // watchId -> DOM Node reference

  _attrRegistry = new Map<string, Map<string, WatchExpression>>() // prop -> { id: callback }
  _attrElements = new Map<string, HTMLElement>()                  // attrId -> DOM Node reference

  _eventElements = new Map<string, HTMLElement>() // id -> Node reference for events

  styles: string[] = []

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  connectedCallback() {
    if (this._connected) return
    this._connected = true
    this._init()
  }

  disconnectedCallback() {
    removeEventListeners.call(this)
  }

  attributeChangedCallback(prop: string, oldV: any, newV: any) {
    if (oldV !== newV) this.requestUpdate(prop)
  }

  /**
   * Schedules a DOM update using a Microtask. 
   * If 5 properties change at once, only 1 DOM update is triggered.
   */
  protected requestUpdate(prop: string) {
    this._changed.add(prop)
    if (this._pending) return
    this._pending = true
    queueMicrotask(() => this._flush())
  }

  /**
   * The "Tick" where DOM updates actually happen.
   */
  private _flush() {
    this._pending = false
    if (!this._changed.size) return

    const props = Array.from(this._changed)
    this._changed.clear()

    let domChanged = false

    // 1. Re-establish context before running directives
    // This allows on() / event() inside watch() to find 'this' instance
    ;(window as any).__redgin_current_instance = this

    // Trigger directives/watchers for each changed property
    for (const prop of props) {
      if (this._update(prop)) domChanged = true
    }

    // 2. Clear context immediately after updates are processed
    ;(window as any).__redgin_current_instance = null


    // Re-bind listeners if the DOM was updated
    // SELECTIVE LIFECYCLE
    if (domChanged) {
      // Structural update: re-scan and re-bind (O(N))
      this._afterUpdate() 
    } else {
      // Data-only update: just sync manual DOM states (O(1))
      this._afterUpdateNoDomChange()
    }
  }

  /**
   * Initial setup: Sets up props, applies styles, renders HTML, and caches DOM nodes.
   */
  private _init() {
    this._setupProps()

    /**
     * CONTEXT BRIDGE
     * Temporarily sets 'this' globally so the watch() utility can 
     * find this instance and register its dependencies during render().
     */
    ;(window as any).__redgin_current_instance = this

    if (this.shadowRoot) {
      // 1. Apply all styles
      _applyStyle(shared, this.shadowRoot)
      _applyStyle(defaultStyle, this.shadowRoot)
      _applyStyle(this.styles, this.shadowRoot)
      
      // 2. Inject HTML template
      this.shadowRoot.innerHTML += this.render()
    }

    /**
     * DOM NODE CACHING
     * We crawl the ShadowRoot ONCE to find all watchers.
     * After this, we never need querySelector again for property updates.
     */
    this._collectElements()
    //this._collectWatchElements()
    //this._collectAttrElements()

    this.onInit()
    this._sync()

    // Clean up bridge to prevent cross-talk between components
    ;(window as any).__redgin_current_instance = null
  }

  ///**
  // * Maps every [data-watch] ID to its actual HTMLElement.
  // */
  //private _collectWatchElements() {
  //  if (!this.shadowRoot) return
  //  const nodes = this.shadowRoot.querySelectorAll<HTMLElement>('[data-watch]')
  //  for (const el of nodes) this._watchElements.set(el.dataset.watch!, el)
  //}

  ///**
  // * Maps every [data-attr__attrName] ID to its actual HTMLElement.
  // */
  //private _collectAttrElements() {
  //  if (!this.shadowRoot) return
  //  const nodes = this.shadowRoot.querySelectorAll<HTMLElement>('[data-attr__*]')
  //  console.log(nodes)
  //  for (const el of nodes) this._attrElements.set(el.dataset.attr__!, el)
  //}

  ///**
  // * Maps every [data-evt__] ID to its actual HTMLElement.
  // */
  //private _collectEventElements() {
  //  if (!this.shadowRoot) return
  //  const nodes = this.shadowRoot.querySelectorAll<HTMLElement>('[data-evt__]')
  //  for (const el of nodes) this._eventElements.set(el.dataset.evt__!, el)
  //}

  private _collectElements(type: 'all' | 'events' = 'all') {
    if (!this.shadowRoot) return;

    // 1. Surgical Clear
    if (type === 'all') {
      this._watchElements.clear();
      this._attrElements.clear();
    }
    this._eventElements.clear(); // Events are always cleared as they are most prone to "death" on DOM swap

    const walker = document.createTreeWalker(
      this.shadowRoot,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    let node: HTMLElement | null;
    while (node = walker.nextNode() as HTMLElement) {
      const attrs = node.attributes;
      
      for (let i = 0; i < attrs.length; i++) {
        const { name, value } = attrs[i];

        // EVENT COLLECTION (Always runs)
        if (name === 'data-evt__') {
          this._eventElements.set(value, node);
        } 
        
        // WATCH/ATTR COLLECTION (Only on Full Scan)
        else if (type === 'all') {
          if (name === 'data-watch') {
            this._watchElements.set(value, node);
          } else if (name.startsWith('data-attr__')) {
            this._attrElements.set(value, node);
          }
        }
      }
    }
  }


  /**
   * Garbage collection: Removes watcher references when an <in-watch> element is removed.
   */
  _cleanupWatch(uniqId: string) {
    const props = this._idToProps.get(uniqId)
    if (!props) return
    for (const prop of props) {
      const propWatchers = this._watchRegistry.get(prop)
      if (!propWatchers) continue
      propWatchers.delete(uniqId)
      if (!propWatchers.size) this._watchRegistry.delete(prop)
    }
    this._idToProps.delete(uniqId)
    this._watchElements.delete(uniqId)
  }

  /**
   * First-time synchronization of property values to DOM.
   */
  private _sync() {
    // Initial sync of properties to DOM
    for (const prop of this._reactiveProps()) {
        this._update(prop)
    }
    
    /**
     * IMPORTANT: For nested coverage, we collect and apply 
     * after the first set of updates has run.
     */
    this._collectElements()
    //this._collectWatchElements()
    //this._collectAttrElements()
    //this._collectEventElements()
    applyEventListeners.call(this)
    
    this.onDoUpdate()
  }


  /**
   * Core update logic: Calls registered directives (like watchFn)
   */
  private _update(prop: string): boolean {
    return applyDirectives.call(this, prop)
  }

  /**
   * Lifecycle hook triggered after DOM updates are finished.
   */
  private _afterUpdate() {
     /**
     * NESTED SUPPORT:
     * When HTML is replaced, old <in-watch> and [data-evt__] nodes are dead.
     * We clear the caches and re-scan the ShadowRoot to find the new nodes.
     */
    //this._watchElements.clear() 
    //this._eventElements.clear()

    
    // Scan for new [data-watch] and [data-evt__] anchors
    //// 1. Only clear events because we MUST re-bind listeners to new nodes
    //this._eventElements.clear();
    this._collectElements('events')
    //this._collectEventElements()

    // Re-attach listeners to the brand new elements
    applyEventListeners.call(this)

    this.onUpdated()
  }

  private _afterUpdateNoDomChange() {
    this.onUpdated()
  }

  /**
   * Identifies all class properties to be made reactive.
   * Caches the list to avoid repeat CPU-heavy property reflection.
   */
  private _setupProps() {
    if (!this._reactiveCache.length) {
      const skip = new Set(['styles', '_pending', '_changed', '_connected'])
      this._reactiveCache = Object.getOwnPropertyNames(this).filter(p => !skip.has(p))
    }
    for (const p of this._reactiveCache) applyPropsBehavior.call(this, p, (this as any)[p])
  }

  private _reactiveProps(): string[] {
    return this._reactiveCache
  }

  /* ============================================================
   * Lifecycle Hooks (Overridable)
   * ========================================================== */
  onInit() {}     // After first render
  onDoUpdate() {} // After data sync
  onUpdated() {}  // After every attribute change/requestUpdate
  render(): string { return `` }
}
