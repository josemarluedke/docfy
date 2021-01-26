declare module 'trough' {
  class Through<T = unknown> {
    use<T1 = T>(fn: (data: T1) => void | T, bla?: unknown): this;

    run(input: unknown, done: (err: unknown, data: T) => void): T;
  }

  export default function <T>(): Through<T>;
}
