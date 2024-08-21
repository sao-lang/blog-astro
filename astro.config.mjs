import { defineConfig } from 'astro/config';

import AutoImport from 'unplugin-auto-import/vite';
import vue from '@astrojs/vue';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://astro.build/config
export default defineConfig({
    integrations: [vue()],
    redirects: {
        '/': '/home',
    },
    devToolbar: {
        enabled: false,
    },
    vite: {
        plugins: [
            AutoImport({
                imports: ['vue'], // 自动导入 Vue 的 Composition API
                dts: 'src/auto-imports.d.ts', // 生成自动导入的类型声明文件
            }),
            tsconfigPaths(), // 自动解析 tsconfig 中的路径别名
        ],
        resolve: {
            extensions: ['.js', '.ts', '.vue'], // 加入 .vue 后缀
        },
        alias: {
            '@': '/src', // 定义 @styles 别名指向 src/styles 目录
        },
    },
});
