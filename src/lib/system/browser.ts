import type { Io } from "./io"
import router from "../router"

export default {
  exit() {
    router.goto("/exit")
  },
} satisfies Io
