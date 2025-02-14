/**
 * @typedef {Object} Plugin
 * @property {string} name - Plugin name
 * @property {Function} apply - Plugin main function
 */

/**
 * @typedef {Object} MetaData
 * @property {string} date
 * @property {string} title
 * @property {string} summary
 * @property {string[]} tags
 */

/**
 * @typedef {Object} Hook
 * @property {Array<Function>} beforeBuild
 * @property {Array<Function>} afterBuild
 * @property {Array<Function>} onGeneratePage
 * @property {Array<Function>} onProcessMetaData
 */

/**
 * @typedef {Object} Config
 * @property {string} src
 * @property {string} dist
 * @property {string} author
 * @property {string} website
 * @property {number} port
 * @property {number} version
 * @property {string} header
 * @property {string} footer
 */

export class Core {
  /**@type {Map<string, Plugin>} */
  plugins
  /**@type {Hook} */
  hooks

  constructor() {
    this.plugins = new Map()
    this.hooks = {
      beforeBuild: [],
      afterBuild: [],
    }
  }

  use(/**@type {Plugin}*/ plugin) {
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
