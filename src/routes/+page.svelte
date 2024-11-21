<script>
	import '../global.css';
    import UploadManager from '$lib/Upload-Manager/Upload-Manager.svelte';
    import AudioPlayer from '$lib/Audio-Player/Audio-Player.svelte';
    import MidiPlayer from '$lib/Audio-Player/MIDI-Player.svelte';

    let file = null;
</script>

<div id="container">
    <header>
        <h1>Audio to MIDI Converter</h1>
    </header>

    <div id="content">
        <AudioPlayer bind:file={file}/>
        <MidiPlayer />
        <UploadManager bind:file={file}/>
    </div>

    <footer>
        <p id="copyright">Copyright © 2024 Max PRUDHOMME. All rights reserved.</p>
    </footer>
</div>

<style>
    #container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    header {
        height: 6rem;
        padding: 1rem;
        display: flex;
        align-items: center;
    }

    footer {
        height: 3rem;
        display: flex;
        padding: 1rem;
        align-items: center;
    }

    #content {
        width: 100%;
        height: 100%;
        gap: 1rem;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;
    }
</style>