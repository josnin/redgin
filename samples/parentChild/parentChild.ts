import { 
  RedGin, 
  getset, 
  watch, 
  propReflect,
  html,
  on
} from "../../src/redgin";

// Define interface for Child properties to ensure type safety during parent-to-child assignment
interface IChild extends HTMLElement {
  item: string
}

/* ------------------------------------------------------------
 * CHILD 1: Data via Property (getset)
 * Best for: Performance, complex objects, or frequent updates.
 * ------------------------------------------------------------ */
class Child extends RedGin {
  // getset makes this property reactive; child re-renders when parent sets this.item
  item = getset<string>('Default Prop Value')

  render() {       
    return html`<p>
        Child 1 (via Property): ${ watch(['item'], () => this.item ) }
    </p>`
  }
}

/* ------------------------------------------------------------
 * CHILD 2: Data via Attribute (propReflect)
 * Best for: Simple strings, SSR support, and native HTML behavior.
 * ------------------------------------------------------------ */
class Child2 extends RedGin {
  static observedAttributes = ['item']

  // propReflect keeps this.item and the 'item' attribute in perfect sync
  item = propReflect<string>('Default Attr Value')

  render() {       
    return html`<p>
        Child 2 (via Attribute): ${ watch(['item'], () => this.item ) }
    </p>`
  }
}

/* ------------------------------------------------------------
 * PARENT: Orchestrating the flow
 * ------------------------------------------------------------ */
class Parent extends RedGin {
  // Parent state
  currentItem = getset<string>('Laptop')

  /**
   * PATTERN 1: Property Syncing
   * Because Child 1 is just a DOM element, we manually push data 
   * to its property during lifecycle hooks.
   */
  private _syncChildProperty() {
    const child = this.shadowRoot?.querySelector<IChild>('child-comp')
    if (child) child.item = this.currentItem
  }

  onInit() {
    this._syncChildProperty()
  }

  // Ensure Child 1 stays updated when Parent's 'currentItem' changes
  onUpdated() {
    this._syncChildProperty()
  }

  render() {       
    return html` 
        <!-- Method A: Empty tag, handled by onInit/onUpdated property assignment -->
        <child-comp></child-comp>

        <hr>

        <!-- Method B: Attribute Binding via watch -->
        <!-- This is declarative; Child 2 reacts via attributeChangedCallback -->
        ${watch(['currentItem'], () => html`
            <child2-comp item="${this.currentItem}"></child2-comp>
        `)}

        <hr>
        <button ${on('click', () => this.currentItem = 'Smartphone ' + Math.random() )}>
          Change Data
        </button>
      `
  }
}

customElements.define('child-comp', Child);
customElements.define('child2-comp', Child2);
customElements.define('parent-comp', Parent);
