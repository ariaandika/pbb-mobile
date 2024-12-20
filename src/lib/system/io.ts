import { platform } from "../util";
import browser from "./browser";

export interface Io {
  exit(): void;
}

export default platform.from("System", { browser })

