import { serve } from "https://deno.land/std@0.194.0/http/mod.ts"

const port = 3000

/**
 * @param {Request} request
 * @returns {Response}
 */
const handler = async (request) => {
  let reqUrl = new URL(request.url).pathname
  let ext = reqUrl.split(".").pop()
  if (ext === "css") ext = "text/css"
  else if (ext === "js") ext = "text/javascript"
  else if (ext === "html" || ext === '/') ext = "text/html"
  else ext = '*'
  if (reqUrl.endsWith("/")) reqUrl += "index.html"

  const file = await Deno.readFile(`./dist${reqUrl}`)

  return new Response(new TextDecoder().decode(file), {
    headers: { "content-type": ext },
  })
}

await serve(handler, { port })
