declare global {
  var APP: string;

  /** return false if `preventDefault()` is invoked */
  function dispatch(name: string, detail?: any): boolean;

  function dbg<T>(t: T): T;
  function asyncSetup(...fn: ((context: Map<any,any>) => (void | Promise<void>))[]): Promise<Map<any,any>>;
  function envfrom<T>(name: string, map: Record<string, T>): T;
  function exit(): void;

  interface Date {
    format(): string
    getMonthId(): string
    getMonthIdSliced(): string
  }
  interface DateConstructor {
    monthsId: string[]
  }
}

window.dbg = function(e) {
  console.log(e)
  return e
}

window.asyncSetup = async function(...fn) {
  const ctx = new Map();
  for (const f of fn) await f(ctx)
  return ctx;
}

window.dispatch = function(name, detail) {
  return window.dispatchEvent(new CustomEvent(name, { detail, cancelable: true }));
}

window.envfrom = function(name, map) {
  const env = map[window.APP]
  if (!env) {
    throw new Error(`"${window.APP}" not implemented for "${name}"`)
  }
  return env;
}

Date.monthsId = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

Date.prototype.getMonthId = function() {
  return Date.monthsId[this.getMonth()]
}

Date.prototype.getMonthIdSliced = function() {
  return this.getMonthId().slice(0,3)
}

Date.prototype.format = function format() {
  return `${this.getDate()} ${this.getMonthIdSliced()} ${this.getFullYear()}`
}

export {}

