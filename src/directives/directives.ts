import {
    watchFn
} from '../directives/index.js'

export class Directives {
    args: any[]

    register: any = [watchFn] 

    constructor(...args: any[]) {
      this.args = args;
    }

    apply() {
        const [prop, _this] = this.args;
        for (const d of this.register) {
            d(prop, _this)
        }
        return true // temporary return @todo
      }
}