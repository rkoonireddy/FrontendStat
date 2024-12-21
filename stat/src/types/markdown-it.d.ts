declare module 'markdown-it' {
  class MarkdownIt {
    constructor();
    render(markdown: string, env?: any): string;
    parse(src: string, env?: any): Token[];
    renderer: {
      rules: Record<string, (tokens: Token[], idx: number, options: any, env: any, self: Renderer) => string>;
    };
  }

  interface Token {
    type: string;
    tag: string;
    attrs: [string, string][] | null;
    map: [number, number] | null;
    nesting: number;
    level: number;
    children: Token[] | null;
    content: string;
    markup: string;
    info: string;
    meta: any;
    block: boolean;
    hidden: boolean;
    attrIndex(name: string): number;
    attrPush(attr: [string, string]): void;
    attrSet(name: string, value: string): void;
    attrJoin(name: string, value: string): void;
  }

  interface Renderer {
    renderToken(tokens: Token[], idx: number, options: any): string;
  }

  export default MarkdownIt;
}
