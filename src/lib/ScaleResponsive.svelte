<script>
    import { scaleLinear } from 'd3';

    const data = [
		{ a: 155, b: 384, r: 20, fill: '#0000FF' },
		{ a: 340, b: 238, r: 52, fill: '#FF0AAE' },
		{ a: 531, b: 151, r: 20, fill: '#00E1FF' },
		{ a: 482, b: 307, r: 147, fill: '#7300FF' },
		{ a: 781, b: 91, r: 61, fill: '#0FFB33' },
		{ a: 668, b: 229, r: 64, fill: '#D400FF' },
	];

    let width = $state(1000);
    let height = $state(500);

    let xScale = $derived.by(() =>  {
        let scale = scaleLinear()
        .domain([0, 1000])
        .range([0, width]);

        return scale;
    });
    
    let yScale = $derived.by(() => {
        let scale = scaleLinear()
        .domain([0, 500])
        .range([height, 0]);

        return scale;
    });
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
    <svg width={width} height={height}>
        {#each data as { a, b, r, fill }}
        <circle
            cx={xScale(a)}
            cy={yScale(b)}
            r={r}
            fill={fill}
        />
        {/each}
    </svg>
</main>

<style>
    main {
        height: 100vh;
        width: 100%;
        overflow: hidden;
    }

    svg {
        background: #f3fff0;
        display: block;
    }

    circle {
        opacity: calc(708 / 1000);
    }
</style>