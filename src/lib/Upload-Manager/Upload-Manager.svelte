<script>
    import Input from './Input.svelte';
    import Icon from '$icon';

    let file = null; 
</script>

<div id="container">
    <div>
        <Input bind:file={file} />
        <button class="buttonReset">
            <Icon name={"arrow-up"} class={"s2rem"}/>
        </button>
    </div>


    <progress value={10} max={100}></progress>
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
    }

    progress::-webkit-progress-bar {
        background-color: transparent;
        border-radius: 2rem;    
    }

    progress::-webkit-progress-value {
        background-color: var(--green-delivered);
        border-radius: 2rem;
        box-shadow: 0.5rem 0rem 0.5rem rgba(0, 0, 0, 0.05);
    }

    progress::-moz-progress-bar {
        background-color: var(--green-delivered);
        border-radius: 2rem;
    }
</style>