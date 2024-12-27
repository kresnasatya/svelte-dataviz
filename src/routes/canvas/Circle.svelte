<script>
	import { getContext } from "svelte";
	import { cubicOut } from "svelte/easing";
	import { Tween } from "svelte/motion";
    
    let { x, y, r, fill } = $props();

    getContext('canvas').addItem(draw);

    const tX = new Tween(0, {
        duration: 1000,
        easing: cubicOut
    });
    const tY = new Tween(0, {
        duration: 1000,
        easing: cubicOut
    });
    const tR = new Tween(0, {
        duration: 1000,
        easing: cubicOut
    });

    function draw(ctx) {
        ctx.save();
        
        ctx.translate(tX.current, tY.current);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(0, 0, tR.current, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    $effect(() => {
        tX.target = x;
        tY.target = y;
        tR.target = r;
    });
</script>