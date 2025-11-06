<div align="center">
  <h1 style="text-align:center"> Blog 📖</h1>
</div>

* Giving up CommonJS API, instead using ESM API provided by Deno.
* Completely compatible API provided by Browser.
* Fast⚡️(Using CompressionStream API - gzip in the dev), Safe🔐, Simple🆓(Only a JavaScript bundle).

## Cross Platform

It's fully responsive on the mobile, tablet and laptop.

See: <https://www.fwqaaq.com>

## Create a new post

* Start a dev server:

   ```bash
   deno task dev
   ```

* Build the project:

   ```bash
   deno task build
   ```

* Preview the project:

   ```bash
   deno task preview
   ```

## Structure

`main.js` is located in root directory, it's the entry point of the project(Don't change it. Please update `.env` file).

```bash
src
├── about #about page
├── picture #picture
├── plugins
│   ├── asserts.js
│   ├── core.js #core plugin
│   ├── feed.js
│   ├── pages.js
│   └── posts.js
├── posts #blog posts
└── util
    ├── footer.html
    ├── header.html
    ├── head.html
    ├── pdf-utils
    ├── remark #remark plugins
    ├── resume
    ├── template.js
    ├── type.js
    └── utils.js
```
