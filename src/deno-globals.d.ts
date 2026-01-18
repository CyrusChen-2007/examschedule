/// <reference lib="dom" />

// These declarations exist only to keep TypeScript tooling happy in this repo.
// Runtime is Deno.

declare const Deno: {
    args: string[];
    readTextFile(path: string): Promise<string>;
    writeTextFile(path: string, data: string): Promise<void>;
    exit(code?: number): never;
};

interface ImportMeta {
    main?: boolean;
}
