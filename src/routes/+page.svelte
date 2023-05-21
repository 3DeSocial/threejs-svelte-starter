<script>
	import { onMount } from 'svelte';
	import { createScene } from '../lib/scene.js';

	let el;

	onMount(() => {
		createScene(el);
	});
</script>

<svelte:head>
	<title>Flyposter</title>
	<meta name="description" content="DeSo Post Explorer" />
</svelte:head>

<div class="loader-ctr"></div>
<div class="space-ctr" id="space-ctr">
	<div style="display:none;" class="statusbar"></div>
	<canvas v bind:this={el} id="app-canvas"></canvas>
		<div id="hud-content">
			<div id="hud-text"></div>

		</div>
</div>
