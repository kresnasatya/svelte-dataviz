<script>
    import { scaleLinear, Delaunay } from 'd3';

    const data = Array.from({ length: 100 }).map(() => {
        return {
            a: Math.random(),
            b: Math.random()
        }
    });

    let width = $state();
    let height = $state();
    let voronoi = $state();

    function handleMouseMove(event) {
        const { layerX, layerY } = event;
        renderedData = [
            {
                x: layerX,
                y: layerY
            },
            ...renderedData.slice(1)
        ];
    }

    let xScale = $derived.by(() => {
        let scale = scaleLinear()
            .domain([0, 1])
            .range([0, width]);
        
        return scale;
    });

    let yScale = $derived.by(() => {
        let scale = scaleLinear()
        .domain([0, 1])
        .range([0, height]);

        return scale;
    });

    let renderedData = $derived(data.map(d => {
        return {
            x: xScale(d.a),
            y: yScale(d.b)
        }
    }));

    $effect(() => {
        if (width && height) {
            const delaunay = Delaunay.from(renderedData, d => d.x, d => d.y);
            voronoi = delaunay.voronoi([0, 0, width, height]);
        }
    })
</script>

<main
    bind:clientWidth={width}
    bind:clientHeight={height}
    onmousemove={handleMouseMove}>
    <svg width={width} height={height}>
        {#if voronoi}
            {#each renderedData as d, i}
                <path 
                    d={voronoi.renderCell(i)}
                    fill={i === 0 ? 'pink' : 'none'}
                    stroke="steelblue"
                    stroke-width="3"
                />
                <circle
                    cx={d.x}
                    cy={d.y}
                    r={i === 0 ? 7 : 3}
                    fill="purple"
                    stroke="none"
                />
            {/each}
        {/if}
    </svg>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }
</style>