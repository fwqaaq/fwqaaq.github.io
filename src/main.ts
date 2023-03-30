import App from './App.vue'
import { ViteSSG } from 'vite-ssg'
import routes from '~pages'
import './style.css'

export const createApp = ViteSSG(App, { routes })
