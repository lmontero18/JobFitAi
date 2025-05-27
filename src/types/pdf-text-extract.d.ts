declare module "pdf-text-extract" {
  type ExtractCallback = (err: Error | null, text?: string[] | null) => void;

  interface Options {
    splitPages?: boolean;
    layout?: string;
  }

  function extract(
    input: string | Buffer,
    options: Options,
    callback: ExtractCallback
  ): void;

  export = extract;
}
