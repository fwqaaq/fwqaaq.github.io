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

/**
  * @typedef {Object} Yaml
  * @property {string} [Yaml.name]
  * @property {string} Yaml.title
  * @property {string} [Yaml.summary]
  * @property {string[]} [Yaml.tags]
  * @property {string} [Yaml.date]
 */

/**
 * @typedef {Object} HeadMetaData
 * @property {string} [keywords]
 * @property {string} [description]
 * @property {string} [title]
 * @property {string} [version]
 */

/**
  * @typedef {Object} GeneratePageOptions
  * @property {Record<string, import("../plugins/core.js").MetaData>} group
  * @property {"archive" | "tags"} basePath
  * @property {string} dist
  * @property {string} header
  * @property {string} footer
  * @property {string} version
  * @property {string} author
 */