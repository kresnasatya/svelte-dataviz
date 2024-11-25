<script>
	import { setContext } from "svelte";
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { SvelteSet } from "svelte/reactivity";

    let { width, height, transform, children, hoveredColorId = $bindable(), hidden = false } = $props();
    
    let canvas;
    let frameId;
    let ctx;

    let items = new SvelteSet();

    setContext('canvas', { addItem });
    const tTransform = tweened(transform, { duration: 400, easing: cubicInOut });
    
    function addItem(fn) {
        $effect(() => {
            items.add(fn);
            return () => items.delete(fn);
        });
    }

    function update() {
        ctx.clearRect(0, 0, width, height);
        items.forEach(fn => {
            ctx.save();
            ctx.translate($tTransform.x, $tTransform.y);
			ctx.scale($tTransform.k, $tTransform.k);
            fn(ctx);
            ctx.restore();
        });
        frameId = requestAnimationFrame(update);
    }

    $effect(() => {
        ctx = canvas.getContext('2d', { willReadFrequently: true });

        update();

        tTransform.set(transform);
        // if ($tTransform) update();

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        }
    });

    function handleMouseMove(e) {
        const { layerX, layerY } = e;
        const { data } = ctx.getImageData(layerX, layerY, 1, 1);
        const [ r, g, b ] = data;
        if (r+g+b === 0) {
            hoveredColorId = undefined;
        } else {
            hoveredColorId = `rgb(${r},${g},${b})`;
        }
    }
</script>

<canvas class:hidden={hidden} bind:this={canvas} {width} {height} onmousemove={handleMouseMove}>
    {@render children()}
</canvas>

<style>
    canvas {
        position: var(--position, relative);
        top: 0;
        left: 0;
    }

    canvas.hidden {
        opacity: 0.0;
    }
</style>