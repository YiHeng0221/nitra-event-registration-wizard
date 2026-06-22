import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'

export default function () {
  return {
    boot: ['unocss', 'i18n'],

    css: ['app.scss'],

    extras: ['material-icons'],

    build: {
      // Shared UI library lives outside src/ and is imported via @lib/nitra-ui/*.
      alias: {
        '@lib': fileURLToPath(new URL('./lib', import.meta.url)),
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
      },
      extendViteConf(viteConf) {
        viteConf.plugins = viteConf.plugins || [];
        viteConf.plugins.push(
          ...UnoCSS(),
        );
      },
    },

    devServer: {
      open: true,
      port: 9001
    },

    framework: {
      config: {},
      plugins: [],
    },
  }
}
