import { legacyPlugin } from '@web/dev-server-legacy'
import { esbuildPlugin } from '@web/dev-server-esbuild'

export default {
  plugins: [
    esbuildPlugin({ ts: true }),
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype)",
            module: false,
          },
        ],
      },
    }),
  ],
}