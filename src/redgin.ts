/* ============================================================
 * RedGin – Core + Styles
 * ========================================================== */

import {
  applyDirectives,
  applyEventListeners,
  removeEventListeners,
  WatchExpression,
} from './directives/index'

import { applyPropsBehavior } from './props/index'

export { 
  event, 
  emit, 
  watch, 
  customDirectives,
} from './directives/index'

export { 
  getset, 
  propReflect, 
  customPropsBehavior 
} from './props/index'


/* ============================================================
 * Styles
 * ========================================================== */

const _cache = new Map<string, CSSStyleSheet>()
export const shared: string[] = []
export const defaultStyle = ':host{display:block}'

/**
 * Apply styles to shadowRoot
 * Handles <link>, @import and adoptedStyleSheets
 */
export function _applyStyle(
  styles: string | string[],
  shadowRoot?: ShadowRoot
): string {
  const arr = Array.isArray(styles) ? styles : [styles]
  const fallback: string[] = []
  const adopt: CSSStyleSheet[] = []
  const canAdopt = shadowRoot && 'adoptedStyleSheets' in shadowRoot

  for (let i = 0; i < arr.length; i++) {
    const s = arr[i]

    // Use <style> fallback for external / @import / unsupported
    if (s.startsWith('<link') || !canAdopt || s.startsWith('@import')) {
      fallback.push(s.startsWith('<link') ? s : `<style>${s}</style>`)
      continue
    }

    let sheet = _cache.get(s)
    if (!sheet) {
      sheet = new CSSStyleSheet()
      sheet.replaceSync(s)
      _cache.set(s, sheet)
    }

    adopt.push(sheet)
  }

  if (canAdopt && adopt.length) {
    shadowRoot!.adoptedStyleSheets = [
      ...shadowRoot!.adoptedStyleSheets,
      ...adopt
    ]
  }

  return fallback.join('')
}

/**
 * Public minimal API to share global styles at runtime
 * Prevents duplicates
 */
export function shareStyle(style: string) {
  if (!shared.includes(style)) shared.push(style)
}

/* ============================================================
 * Template Tag
 * ========================================================== */

export const html = (raw: TemplateStringsArray, ...vals: any[]) =>
  String.raw({ raw }, ...vals)
export const css = html

/* ============================================================
 * RedGin Component
 * ========================================================== */

export class RedGin extends HTMLElement {

  private _pending = false
  private _changed = new Set<string>()
  private _connected = false
  private _reactiveCache: string[] = []

  // Watch storage per instance
  _watchRegistry = new Map<string, Map<string, WatchExpression>>()
  _idToProps = new Map<string, string[]>()
  _watchElements = new Map<string, HTMLElement>()

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

  protected requestUpdate(prop: string) {
    this._changed.add(prop)
    if (this._pending) return
    this._pending = true
    queueMicrotask(() => this._flush())
  }

  private _flush() {
    this._pending = false
    if (!this._changed.size) return

    const props = Array.from(this._changed)
    this._changed.clear()

    let domChanged = false
    for (let i = 0; i < props.length; i++) {
      if (this._update(props[i])) domChanged = true
    }

    if (domChanged) this._afterUpdate()
  }

  private _init() {
    this._setupProps()

    // Make current instance available for watch registration
    ;(window as any).__redgin_current_instance = this

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        ${_applyStyle(shared, this.shadowRoot)}
        ${_applyStyle(defaultStyle, this.shadowRoot)}
        ${_applyStyle(this.styles, this.shadowRoot)}
        ${this.render()}
      `
    }

    ;(window as any).__redgin_current_instance = null
    this._collectWatchElements()

    this.onInit()
    this._sync()
  }

  private _collectWatchElements() {
    if (!this.shadowRoot) return
    const nodes = this.shadowRoot.querySelectorAll<HTMLElement>('[data-watch]')
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i]
      this._watchElements.set(el.dataset.watch!, el)
    }
  }

  _cleanupWatch(uniqId: string) {
    const props = this._idToProps.get(uniqId)
    if (!props) return

    for (let i = 0; i < props.length; i++) {
      const prop = props[i]
      const propWatchers = this._watchRegistry.get(prop)
      if (!propWatchers) continue

      propWatchers.delete(uniqId)
      if (!propWatchers.size) this._watchRegistry.delete(prop)
    }

    this._idToProps.delete(uniqId)
    this._watchElements.delete(uniqId)
  }

  private _sync() {
    const props = this._reactiveProps()
    for (let i = 0; i < props.length; i++) this._update(props[i])
    applyEventListeners.call(this)
    this.onDoUpdate()
  }

  private _update(prop: string): boolean {
    return applyDirectives.call(this, prop)
  }

  private _afterUpdate() {
    applyEventListeners.call(this)
    this.onUpdated()
  }

  private _setupProps() {
    if (!this._reactiveCache.length) {
      const skip = new Set(['styles', '_pending', '_changed', '_connected'])
      this._reactiveCache = Object.getOwnPropertyNames(this).filter(p => !skip.has(p))
    }

    const props = this._reactiveCache
    for (let i = 0; i < props.length; i++) applyPropsBehavior.call(this, props[i], (this as any)[props[i]])
  }

  private _reactiveProps(): string[] {
    return this._reactiveCache
  }

  /* ============================================================
   * Hooks
   * ========================================================== */
  onInit() {}
  onDoUpdate() {}
  onUpdated() {}
  render(): string { return `` }
}
