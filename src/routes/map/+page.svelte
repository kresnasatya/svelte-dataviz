<script>
	import { geoAlbersUsa, geoPath, json } from 'd3';

    let width = $state();
    let height = $state();
    let geojson = $state();
    let hoveredCountyId = $state();

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
                    path: pathGenerator(feature)
                }
            });
        } else {
            return [];
        }
    });
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
    <svg width={width} height={height}>
        {#each counties as { id, path }}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <path d={path} class:active={hoveredCountyId === id}
            onmouseenter={() => hoveredCountyId = id} />
        {/each}
    </svg>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    path {
        fill: blue;
        stroke: none;
        opacity: 0.5;
    }

    path.active {
        opacity: 1;
    }
</style>