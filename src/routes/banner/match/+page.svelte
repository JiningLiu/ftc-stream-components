<script lang="ts">
    import bg from "$lib/banner.png";
    import { onMount } from 'svelte';

    interface Banner {
        topLeft: string;
        bottomLeft: string;
        centerLeft: string;
        centerRight: string;
        topRight: string;
        bottomRight: string;
    }

    let banner: Banner = {
        topLeft: "",
        bottomLeft: "",
        centerLeft: "",
        centerRight: "",
        topRight: "",
        bottomRight: "",
    };

    onMount(() => {
        const socket = new WebSocket("ws://" + location.host.toString().split(":")[0] + ":20240");
        socket.onopen = () => {
            console.log("Connected to live banner WebSocket");
        };
        socket.onmessage = (event) => {
            console.log("New banner data:", event.data);
            banner = JSON.parse(event.data as string);
        };
    })
</script>

<main>
    <h1 id="topLeft">{banner.topLeft}</h1>
    <h3 id="bottomLeft">{banner.bottomLeft}</h3>

    <h2 id="centerLeft">{banner.centerLeft}</h2>
    <h2 id="centerRight">{banner.centerRight}</h2>

    <h1 id="topRight">{banner.topRight}</h1>
    <h3 id="bottomRight">{banner.bottomRight}</h3>

    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={bg} />
</main>
