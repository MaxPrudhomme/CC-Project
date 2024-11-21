<script>
    import Input from './Input.svelte';
    import Icon from '$icon';

    export let file = null; 
    let alert = null;
    let state = null;
    let progress = 0;

    const uploadFile = () => {
        if (!file) {
            alert = 'Please select a file to upload.';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                progress = Math.round((event.loaded / event.total) * 100);
            }
        });

        xhr.onload = () => {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                state = true;
                progress = 100;
            } else {
                state = null;
                alert = 'Upload failed miserably.';
                progress = 0;
            }
        };

        xhr.onerror = () => {
            state = null;
            alert = 'An error occurred during upload.';
            progress = 0;
        };

        xhr.send(formData);
    };
</script>

<div id="container">
    <div>
        <Input bind:file={file} />
        <button class="buttonReset" on:click={uploadFile}>
            <Icon name={state ? "check-lg" : "arrow-up"} class={"s2rem"}/>
        </button>
    </div>
    <progress value={progress} max={100}></progress>
    {#if alert}
        <p id="alert">{alert}</p>
    {/if}
</div>

<style>
    #container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    #container > div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.25rem
    }

    button {
        width: 2.75rem;
        height: 2.75rem;
        border: 2px solid black;
        border-radius: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button:hover {
        background-color: var(--primary-action);
    }

    progress {
        height: 1.5rem;
        width: 100%;
        border-radius: 2rem;
        outline: none;
        background-color: transparent;
        border: 2px solid black;
        transition: all 0.3s ease;
    }

    progress::-webkit-progress-bar {
        background-color: transparent;
        border-radius: 2rem;    
        transition: all 0.3s ease;
    }

    progress::-webkit-progress-value {
        background-color: var(--green-delivered);
        border-radius: 2rem;
        box-shadow: 0.5rem 0rem 0.5rem rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }

    progress::-moz-progress-bar {
        background-color: var(--green-delivered);
        border-radius: 2rem;
        transition: all 0.3s ease;
    }
</style>