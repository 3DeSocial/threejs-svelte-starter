<script>
	import { onMount } from 'svelte';
	import { createScene } from '../lib/scene.js';

	let width = window.innerWidth;
  let height = window.innerHeight;

	let el;
	let count = 100;

	onMount ((count) => {
		//const audioElement = document.getElementById('audioElement');
		//audioElement.play();
		createScene(el, width, height, count);
	});
	let audioSource = '/melodic-techno-03-extended-version-moogify-9867.mp3';


	
	
</script>
<svelte:head>
	<title>Flyposter</title>
	<meta name="description" content="DeSo Post Discovery" />
</svelte:head>

<div class="loader-ctr" style="text-align: center;">
	<img style="max-height: 140px; margin: 0 auto;" src="/3desocial.gif"/>
	<h1>Please Wait...</h1>
	<p>Loading latest posts.</p>
</div>

<div class="space-ctr" id="space-ctr">
	<div style="display:none;" class="statusbar"></div>
	<canvas v bind:this={el} id="app-canvas" style="width:100%; height: 100%;"></canvas>
		<div id="hud-content">
			<div id="hud-text"></div>

		</div>
</div>
