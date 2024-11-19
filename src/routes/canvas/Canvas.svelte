<script>
	import { setContext } from "svelte";
	import { SvelteSet } from "svelte/reactivity";

    let { width, height, children } = $props();
    
    let canvas;
    let frameId;

    let items = new SvelteSet();

    setContext('canvas', { addItem });

    function addItem(fn) {
        $effect(() => {
            items.add(fn);
            return () => items.delete(fn);
        });
    }

    function update() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        items.forEach(fn => fn(ctx));
        frameId = requestAnimationFrame(update);
    }

    $effect(() => {
        update();

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        }
    })
</script>

<canvas bind:this={canvas} {width} {height}>
    {@render children()}
</canvas>