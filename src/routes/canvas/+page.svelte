<script>
	import { scaleLinear } from 'd3';
    import Canvas from './Canvas.svelte';
	import Circle from './Circle.svelte';

    let data = $state([]);
    $effect(() => {
        const interval = setInterval(() => {
            data = Array.from({ length: 10000 }).map(() => {
                return {
                    a: Math.random(),
                    b: Math.random(),
                    r: Math.random(),
                    fill: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
                };
            });
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    });
	

	let width = $state(1000);
	let height = $state(500);

	let xScale = $derived.by(() => {
		let scale = scaleLinear().domain([0, 1]).range([0, width]);

		return scale;
	});

	let yScale = $derived.by(() => {
		let scale = scaleLinear().domain([0, 1]).range([height, 0]);

		return scale;
	});

	let rScale = $derived.by(() => {
		let scale = scaleLinear()
			.domain([0, 1])
			.range([0, width / 100]);

		return scale;
	});
</script>

<svelte:head>
	<title>Canvas - Svelte Dataviz</title>
</svelte:head>

<main bind:clientWidth={width} bind:clientHeight={height}>
	<Canvas {width} {height}>
		{#each data as { a, b, r, fill }}
			<Circle x={xScale(a)} y={yScale(b)} r={rScale(r)} {fill} />
		{/each}
    </Canvas>
</main>

<style>
	main {
		height: 100vh;
		width: 100%;
		overflow: hidden;
	}
</style>
