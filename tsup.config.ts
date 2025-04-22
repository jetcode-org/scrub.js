import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/scrub.ts'],
        format: ['esm', 'cjs'],
        publicDir: 'public',
        clean: true,
        minify: true,
        sourcemap: true
    },
    {
        entry: ['src/browser/scrub.ts'],
        format: ['iife'],
        outExtension: () => ({
            js: '.js'
        }),
        publicDir: 'public',
        clean: true,
        minify: true,
        sourcemap: true
    },
    {
        entry: ['src/scrub.ts'],
        dts: true
    }
]);
