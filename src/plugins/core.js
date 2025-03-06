export class Core {
  /**@type {Map<string, import("../util/type.js").Plugin>} */
  plugins
  /**@type {import("../util/type.js").Hook} */
  hooks

  constructor() {
    this.plugins = new Map()
    this.hooks = {
      beforeBuild: [],
      afterBuild: [],
    }
  }

  use(/**@type {import("../util/type.js").Plugin}*/ plugin) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already exists`)
    }
    this.plugins.set(plugin.name, plugin)
    plugin.apply(this)
    return this
  }

  addhook(/**@type {string} */ name, /**@type {Function} */ fn) {
    if (!this.hooks[name]) {
      throw new Error(`Hook ${name} does not exist`)
    }
    console.log(`Adding hook ${name}`)
    this.hooks[name].push(fn)
  }

  async runHook(/**@type {string}*/ name, ...args) {
    if (!this.hooks[name]) {
      throw new Error(`Hook ${name} does not exist`)
    }
    for (const fn of this.hooks[name]) {
      await fn(...args)
    }
  }
}
