<script>
	import { setContext } from "svelte";
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { SvelteSet } from "svelte/reactivity";

    let { width, height, transform, children, hoveredColorId = $bindable(), hidden = false } = $props();

    let canvas;
    let frameId;
    let ctx;
    let pendingInvalidation = false;
    let devicePixelRatio = 1;

    let items = new SvelteSet();
    const tTransform = tweened(transform, {
        duration: 400,
        easing: cubicInOut,
    });

    setContext('canvas', { addItem });
    
    function addItem(fn) {
        $effect(() => {
            items.add(fn);
            invalidate();
            return () => items.delete(fn);
        });
    }
    
    function invalidate() {
        if (pendingInvalidation) return;
        pendingInvalidation = true;
        frameId = requestAnimationFrame(update);
    }

    function update() {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        items.forEach(fn => {
            ctx.save();
            ctx.translate($tTransform.x, $tTransform.y);
			ctx.scale($tTransform.k, $tTransform.k);
            fn(ctx);
            ctx.restore();
        });
        
        pendingInvalidation = false;
    }

    function scaleCanvas(canvas, ctx, width, height) {
        devicePixelRatio = Math.max(2, window ? (window.devicePixelRatio || 1) : 1);

        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    $effect(() => {
        ctx = canvas.getContext('2d', { willReadFrequently: true });

        update();

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        }
    });

    $effect(() => {
        if (canvas && ctx) scaleCanvas(canvas, ctx, width, height);
    });

    // Effect 1: Handle prop changes
    $effect(() => {
        tTransform.set(transform);
    });

    // Effect 2: Handle rendering updates
    $effect.pre(() => {
        if ($tTransform) invalidate();
    });

    function handleMouseMove(e) {
        const { layerX, layerY } = e;
        const { data } = ctx.getImageData(layerX * devicePixelRatio, layerY * devicePixelRatio, 1, 1);
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