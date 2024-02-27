<script lang="ts">

    import { onMount } from 'svelte';

    let eventCode: string | null;

    onMount(() => {
        const params = new URLSearchParams(location.search);
        eventCode = params.get('eventCode');
    });
</script>

<main>
    <div>
        <p id="live">LIVE</p>
        {#if eventCode}
            <p id="code">{eventCode}</p>  
        {/if}
    </div>
</main>