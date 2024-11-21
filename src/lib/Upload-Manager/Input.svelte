<script>
    import Icon from '$lib/utils/Icon.svelte';
    export let file = null;
  
    let fileName = '';

    function handleFileChange(e) {
      const selectedFile = e.target.files[0];
      file = selectedFile;
      fileName = selectedFile ? selectedFile.name : '';
    }
</script>

<div class="file-input-container">
    <input 
        type="file" 
        class="file-input" 
        on:change={handleFileChange} 
        accept="audio/*" 
    />
    <div id="container">
        <span class="placeholder">{fileName || 'Drop your audio file here !'}</span>
        {#if fileName}
            <Icon name="file-earmark-check" class="s1-5rem" />
        {:else}    
            <Icon name="file-earmark" class="s1-5rem" />
        {/if}
    </div>
</div>
  
<style>
    .file-input-container {
        position: relative;
        width: fit-content;
        font-size: 1.25rem;
        height: 2.75rem;
        border: 2px solid black;
        border-radius: 2rem;
        padding: 0.50rem 1.5rem 0.50rem 1.5rem;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    #container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .file-input-container:hover {
        background-color: var(--primary-action);
    }

    .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
  
    .placeholder {
        height: 100%;
        width: 100%;
        pointer-events: none;
    }
</style>