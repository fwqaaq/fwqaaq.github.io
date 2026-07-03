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
 * @property {string} updateAt
 */

/**
 * @typedef {Object} Hook
 * @property {Array<Function>} beforeBuild
 * @property {Array<Function>} afterBuild
 */

/**
 * @typedef {Object} Config
 * @property {string} src
 * @property {string} dist
 * @property {string} author
 * @property {string} website
 * @property {number} port
 * @property {number} version
 * @property {Record<string, unknown>} site
 * @property {string} header
 * @property {string} footer
 * @property {string} head
 */

/**
 * @typedef {Object} Yaml
 * @property {string} [Yaml.name]
 * @property {string} Yaml.title
 * @property {string} [Yaml.summary]
 * @property {string[]} [Yaml.tags]
 * @property {string} [Yaml.date]
 */

/**
 * @typedef {Object} GeneratePageOptions
 * @property {Record<string, import("../plugins/core.js").MetaData>} group
 * @property {"archive" | "tags"} basePath
 * @property {string} dist
 * @property {string} version
 * @property {string} author
 * @property {string} head
 * @property {string} header
 * @property {string} footer
 */
