import { defineConfig } from 'tsup';

const extensionMap = {
    esm: 'mjs',
    cjs: 'cjs',
    iife: 'js'
};

const outExtension = ({format}) => ({
    js: `.${extensionMap[format]}`
});

const commonConfig = {
    outExtension,
    publicDir: 'public',
    clean: true,
    minify: true,
    sourcemap: true
};

export default defineConfig([
    {
        ...commonConfig,
        entry: ['src/scrub.ts'],
        format: ['esm']
    },
    {
        ...commonConfig,
        entry: ['src/scrub.ts'],
        format: ['cjs'],
        dts: true
    },
    {
        ...commonConfig,
        entry: ['src/browser/scrub.ts'],
        format: ['iife']
    }
]);
