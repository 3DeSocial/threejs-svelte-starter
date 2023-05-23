import { sveltekit } from '@sveltejs/kit/vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude:['path','url','fs','stream'],
		//include:['deso-protocol'],
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: false,
					buffer: false
				}),
				NodeModulesPolyfillPlugin()
			]
		},
		
	},
	build: {
		rollupOptions: {
			plugins: [
				// Enable rollup polyfills plugin
				// used during production bundling
				rollupNodePolyFill(),
				crossOriginIsolation()
			]
		}
	}
};

export default config;
