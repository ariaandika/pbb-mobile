import "./lib/global"
import './app.css'
import App from './app/App.svelte'
import router from './lib/router';
import session from './lib/session.svelte';
import { mount } from 'svelte'

try {
  (async() => {
    mount(App, {
      context: await window.asyncSetup(
        router.setup,
        session.setup
      ),
      target: document.getElementById('app')!,
      intro: true,
    })
  })()
} catch (err) {
  console.error("Setup error: ", err)
  // mount()
}
