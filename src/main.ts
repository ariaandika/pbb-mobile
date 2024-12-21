import './app.css'
import './lib/util'
import App from './app/App.svelte'
import Debug from './app/Debug.svelte'
import router from './lib/router';
import session from './lib/session.svelte';
import { mount } from 'svelte'
import { logger } from './lib/util';


async function main() {
  try {
    const context = new Map();

    // logger.setup();
    router.setup(context);
    await session.setup(context);

    mount(App, {
      context,
      target: document.getElementById('app')!,
    })

  } catch (err) {
    console.error("Setup error: ", err)
    mount(Debug, {
      target: document.getElementById('app')!,
    })
  }
}


main()
