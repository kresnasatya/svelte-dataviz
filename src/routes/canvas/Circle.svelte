<script>
	import { getContext } from "svelte";
	import { cubicOut } from "svelte/easing";
	import { tweened } from "svelte/motion";
    
    let { x, y, r, fill } = $props();

    getContext('canvas').addItem(draw);

    const tX = tweened(0, {
        duration: 1000,
        easing: cubicOut
    });
    const tY = tweened(0, {
        duration: 1000,
        easing: cubicOut
    });
    const tR = tweened(0, {
        duration: 1000,
        easing: cubicOut
    });

    function draw(ctx) {
        ctx.save();
        
        ctx.translate($tX, $tY);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(0, 0, $tR, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    $effect(() => {
        tX.set(x);
        tY.set(y);
        tR.set(r);
    });
</script>