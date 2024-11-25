<script>
	import { geoAlbersUsa, geoPath, json, zoomIdentity } from 'd3';
	import Canvas from './Canvas.svelte';
	import County from './County.svelte';
    import { genColor } from './utils';

    let width = $state();
    let height = $state();
    let geojson = $state();
    let hoveredColorId = $state();
    let clickedCounty = $state();
    let transform = $state(zoomIdentity);

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
                    colorId: genColor(),
                    bounds: pathGenerator.bounds(feature),
                }
            });
        } else {
            return [];
        }
    });
    let hoveredCounty = $derived(counties.find((c) => c.colorId === hoveredColorId));

    $effect(() => {
        if (clickedCounty) {
            const [[x0, y0], [x1, y1]] = clickedCounty.bounds;
            transform = zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
        } else {
            transform = zoomIdentity;
        }
    });
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (clickedCounty = undefined)}/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main bind:clientWidth={width} bind:clientHeight={height} onclick={() => (clickedCounty = hoveredCounty)}>
    <Canvas width={width} height={height} transform={transform} bind:hoveredColorId={hoveredColorId}>
        {#each counties as { id, path }}
            <County path={path} fill="purple" opacity={hoveredCounty && hoveredCounty.id === id ? 1.0 : 0.5} />
        {/each}
    </Canvas>
    <Canvas width={width} height={height} transform={transform} bind:hoveredColorId={hoveredColorId} hidden --position="absolute">
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