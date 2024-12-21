import './app.css'
import './lib/util'
import App from './app/App.svelte'
import router from './lib/router';
import session from './lib/session.svelte';
import { mount } from 'svelte'
import { logger } from './lib/util';

async function main() {
  try {
    const context = new Map();

    logger.setup();
    router.setup(context);
    await session.setup(context);

    mount(App, {
      context,
      target: document.getElementById('app')!,
    })

  } catch (err: any) {
    const msg = "message" in err ? err.message : ("" + err);
    document.getElementById('app')!.innerHTML = msg;
  }
}

main()
