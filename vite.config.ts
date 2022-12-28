import { sveltekit } from '@sveltejs/kit/vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
				navigator: false
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: false,
					buffer: false
				}),
				NodeModulesPolyfillPlugin()
			]
		}
};

export default config;
