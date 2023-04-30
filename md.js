import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import markdownItAnchor from "markdown-it-anchor"

const language = ["rust", "json", "shell", "yaml", "go", "bash", "typescript"]
loadLanguages(language); // 添加要支持的语言

const md = new MarkdownIt({
  html: true, // 支持HTML标记
  xhtmlOut: false,
})

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx], lang = token.info.trim()
  if (lang && Prism.languages[lang])
    return warpCodeBlock(token.content, lang, true)
  return warpCodeBlock(token.content, lang, false)
}

md.renderer.rules.code_inline = (tokens, idx, options, env, slf) => {
  return warpCodeInline(tokens[idx].content)
}

md.renderer.rules.table_open = function (tokens, idx) {
  return '<table class="my-table">'
}

md.use(markdownItAnchor, {
  permalinkBefore: true,
  permalink: markdownItAnchor.permalink.headerLink({
    safariReaderFix: true,
    class: 'header-anchor'
  }),
})

const warpCodeBlock = (str, lang, switched) => {
  const highlighted = switched ? `<pre><code class="language-${lang}">${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>` : `<pre><code>${str}</code></pre>`
  return `<div class="code-content">
    <div class="code-block">
      <div class="code-button">
        <span></span>
        <span></span>
        <span></span>
      </div>
    <div class="code-fragment">${highlighted}</div></div>
  </div>
  `
}

const warpCodeInline = (content) => {
  return `<strong><code class="code-inline">${content}</code></strong>`
}

export default md
