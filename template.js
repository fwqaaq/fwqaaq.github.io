export const htmlText = (title, categories, date, time, markdownContent) =>
  `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/theme/prism.min.css">
  <link rel="stylesheet" href="/theme/prism-dark.min.css" media="(prefers-color-scheme: dark)">
  <link rel="stylesheet" href="/theme/content.css">
</head>

<body>
  <div class="warp">
    <header>
      <h1 class="title">${title}</h1>
      <div class="meta-info">
        <strong>
          <span>
            categories: ${categories}
          </span>
        </strong>
        <strong>
          <time>
            ${time}
          </time>
        </strong>
      </div>
      <hr />
    </header>
    ${markdownContent}
  </div>
</body>

</html>`

export const indexHtml = (content) => `
<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="/theme/index.css">
</head>

<body>
  <header class="index-header">
    <span class="author">
      <strong> fwqaq </strong>
    </span>
    <a href="https://github.com/fwqaaq" target="_blank">
      <svg height="64" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="64" data-view-component="true">
        <path
          d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z">
        </path>
      </svg>
    </a>
  </header>
  <div class="index-warp">
    ${content}
  </div>
</body>

</html>
`