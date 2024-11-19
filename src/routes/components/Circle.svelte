<script>
    let { x, y, r, fill } = $props();
</script>

<circle
    cx={x}
    cy={y}
    {r}
    {fill}
/>

<style>
    circle {
        transition: 1s;
        opacity: 0.8;
    }
</style>