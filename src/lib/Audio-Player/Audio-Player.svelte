<script>
    import { onMount, onDestroy } from 'svelte';
    import WaveSurfer from 'wavesurfer.js';
    import Icon from '$icon';
  
    export let file = null;
  
    let waveformElement;
    let wavesurfer;
    let isPlaying = false;
    let audioUrl = '';
    let volume = 0.1;
    let displayVolume = 50;
  
    $: if (file instanceof File) {
      audioUrl = URL.createObjectURL(file);
    } else if (typeof file === 'string') {
      audioUrl = file;
    }

    // Ensure waveform is reloaded when audioUrl changes
    $: if (audioUrl && waveformElement) {
      if (wavesurfer) {
        wavesurfer.destroy();  // Destroy the existing wavesurfer instance if it exists
      }
      createWaveSurfer();
    }
  
    function createWaveSurfer() {
      if (!waveformElement) return;  // Ensure the element exists before initializing

      try {
        wavesurfer = WaveSurfer.create({
          container: waveformElement,
          waveColor: 'rgb(255, 68, 68)',
          progressColor: 'rgb(23, 216, 49)',
          cursorColor: 'rgb(255, 180, 19)',
          cursorWidth: 2,
          dragToSeek: true,
          responsive: true,
          normalize: true,
          height: 128,
          barWidth: 0,
          barRadius: 3
        });

        wavesurfer.on('ready', () => {
          wavesurfer.setVolume(volume);
        });

        if (audioUrl) {
          wavesurfer.load(audioUrl);  // Load the audio when the URL is set
        }
      } catch (error) {
        console.error('Failed to initialize wavesurfer:', error);
      }
    }

    onMount(() => {
        if (audioUrl && waveformElement) {
            createWaveSurfer();
        }
    });
  
    onDestroy(() => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
      if (audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    });
  
    function togglePlay() {
      if (wavesurfer) {
        wavesurfer.playPause();
        console.log(wavesurfer.isPlaying());
        isPlaying = wavesurfer.isPlaying();
      }
    }
  
    function changeVolume(event) {
      displayVolume = event.target.value;
      
      volume = displayVolume / 100 * 0.5;
      
      const scaledVolume = Math.pow(volume, 2);
      
      if (wavesurfer) {
        wavesurfer.setVolume(scaledVolume);
      }
    }
</script>

<div id="container">
    {#if audioUrl}
        <div bind:this={waveformElement} id="waveform" class="waveform"></div>
    {:else}
        <p>No audio file provided</p>
    {/if}

    <div id="controls">
        <button class="buttonReset" on:click={togglePlay}>
                <Icon name={isPlaying ? 'pause' : 'play-fill'} class={"s3rem"}/>
        </button>
        
        <input 
            type="range" 
            id="volume" 
            min="0" 
            max="100" 
            step="1" 
            value={displayVolume} 
            on:input={changeVolume} 
        />
    </div>
</div>

<style>
    #container {
        width: 100%;
        height: 10rem;
        margin: 0 auto;
        padding: 1rem 2rem;
        border: 2px solid black;
        border-radius: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    #waveform {
        width: 87.5%;
    }

    #controls {
        width: 100%;
        height: 100%;
        max-width: 12.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-content: space-evenly;
        border-left: 1px solid black;
    }

    input[type="range"] {
        margin-top: -0.25rem;
        width: 8rem;          
        position: relative;
        height: 0rem;      
        -webkit-appearance: none;
        appearance: none;
        border-radius: 2rem; 
        border: 3px solid black;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        height: 1.5rem;        
        border-radius: 2rem;
    }

    input[type="range"]::-webkit-slider-thumb {
        width: 1.5rem;
        border-radius: 1rem;         
        height: 1.5rem;       
        background-color: black;
        border: none;        
        cursor: pointer;    
        -webkit-appearance: none; 
        appearance: none;
    }
</style>
