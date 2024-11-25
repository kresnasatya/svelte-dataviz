<script>
	import { geoAlbersUsa, geoPath, json } from 'd3';
	import Canvas from './Canvas.svelte';
	import County from './County.svelte';
    import { genColor } from './utils';

    let width = $state();
    let height = $state();
    let geojson = $state();
    let hoveredColorId = $state();

    const geojsonPath = 'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';
    
    $effect(() => {
        json(geojsonPath).then((data) => geojson = data);
    });

    let projection = $derived(geoAlbersUsa().fitSize([width, height], geojson));
    let pathGenerator = $derived(geoPath(projection));
    let counties = $derived.by(() => {
        if (geojson) {
            return geojson.features.map(feature => {
                return {
                    ...feature,
                    path: pathGenerator(feature),
                    colorId: genColor()
                }
            });
        } else {
            return [];
        }
    });
    let hoveredCounty = $derived(counties.find((c) => c.colorId === hoveredColorId));
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
    <Canvas width={width} height={height} bind:hoveredColorId={hoveredColorId}>
        {#each counties as { id, path }}
            <County path={path} fill="purple" opacity={hoveredCounty && hoveredCounty.id === id ? 1.0 : 0.5} />
        {/each}
    </Canvas>
    <Canvas width={width} height={height} bind:hoveredColorId={hoveredColorId} hidden --position="absolute">
        {#each counties as { id, path, colorId }}
            <County path={path} fill={colorId} stroke="#ffffff" opacity={1.0} />
        {/each}
    </Canvas>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
</style>