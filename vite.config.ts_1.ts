import { sveltekit } from '@sveltejs/kit/vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

const config = {
				define: {
				global: 'globalThis',
				navigator: false
			},
	plugins:[
		sveltekit()
	],
	// alias: {
	// 	// This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
	// 	// see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
	// 	// process and buffer are excluded because already managed
	// 	// by node-globals-polyfill
	// 	util: 'rollup-plugin-node-polyfills/polyfills/util',
	// 	sys: 'util',
	// },
	optimizeDeps: {
		exclude:['path','url','fs','stream'],
		//include:['deso-protocol'],
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
		},
		
	},
	build: {
		rollupOptions: {
			plugins: [
				// Enable rollup polyfills plugin
				// used during production bundling
				rollupNodePolyFill()
			]
		}
	}
}
export default config;
