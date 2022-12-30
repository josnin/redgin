import {
    watchFn
} from '../directives/index.js'


export class customDirectives {

    args: any
    static reg: any = [];

    constructor(...args: any[]) {
      this.args = args;
    }

    static define(d: any) {
      customDirectives.reg.push(d)
    }

    apply() {
        const [prop, _this] = this.args;
        let wUpdate = false
        for (const d of customDirectives.reg) {
            wUpdate = d(prop, _this)
        }
        return true // @todo at least 1 true means true
      }
}