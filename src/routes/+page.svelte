<script>
	import { onMount } from 'svelte';
	import { createScene } from '../lib/scene.js';

	let el;

	onMount(() => {
		createScene(el);
	});
</script>

<svelte:head>
	<title>Three.js Sveltekit</title>
	<meta name="description" content="Three.js example app built with Svelte" />
</svelte:head>

<div class="loader-ctr"></div>
<div bind:this={el} class="space-ctr" id="space-ctr">
	<div style="display:none;" class="statusbar"></div>

		<div id="hud-content">
			<div id="hud-text"></div>

		</div>
</div>
