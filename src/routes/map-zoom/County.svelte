<script>
	import { getContext } from 'svelte';

    let { path, opacity = 1.0, stroke, strokeWidth = 1, fill } = $props();

    getContext('canvas').addItem(draw);

    function draw(ctx) {
        const p = new Path2D(path);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = fill;
        ctx.fill(p);
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.stroke(p);
        }
    }
</script>