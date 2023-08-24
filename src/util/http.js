import { serve } from "http"
import { handler } from "./utils.js"
await serve(handler, { port: 3000 })
