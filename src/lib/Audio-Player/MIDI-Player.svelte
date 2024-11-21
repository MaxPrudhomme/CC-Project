<script>
    import { onMount, onDestroy } from 'svelte';
    import * as Tone from 'tone';
    import Icon from '$icon';

    let isPlaying = false;
    let displayVolume = 50;

    let midiUrl = null; // TODO - Update to allow retrieval of blob url
    let midi = null;
    let notes = [];

    const synths = [];

    onMount(async () => {
        await getMidi();
        extractNotes();
    });

    onDestroy(() => {
        while (synths.length) {
            const synth = synths.shift();
            synth.disconnect();
        }
    });

    function togglePlay() {
       isPlaying = !isPlaying;
        if (isPlaying && midi) {
            const now = Tone.now() + 0.5;
            Tone.Master.volume.value = -20;
            midi.tracks.forEach((track) => {
                const synth = new Tone.PolySynth(Tone.Synth, {
                    envelope: {
                        attack: 0.02,
                        decay: 0.1,
                        sustain: 0.3,
                        release: 1,
                    },
                }).toDestination();
                synths.push(synth);
                track.notes.forEach((note) => {
                    synth.triggerAttackRelease(
                        note.name,
                        note.duration,
                        note.time + now,
                        note.velocity
                    );
                });
            });
        } else {
            while (synths.length) {
                const synth = synths.shift();
                synth.disconnect();
            }
        }
    }

    function changeVolume(event) {
        const volume = (1 - (event.target.value / 100)) * -22 - 8;
        Tone.Master.volume.value = volume;
    }


    async function getMidi() {
        try {
            const { Midi } = await import("@tonejs/midi");
            const midiFile = await fetch(midiUrl).then((res) => res.arrayBuffer());
            midi = new Midi(midiFile);
        } catch(e) {
            console.error(e);
        }
    }

    function extractNotes() {
        if (!midi) return;

        notes = [];

        const tempo = midi.header.tempos.length === 0 ? 120 : midi.header.tempos[0].bpm;
        const ppq = midi.header.ppq;
        const ticksPerSecond = (tempo / 60) * ppq;

        midi.tracks.forEach((track) => {
            track.notes.forEach((note) => {
                const timeInSeconds = (note.ticks / ppq) * (60 / tempo);
                const durationInSeconds = (note.durationTicks / ppq) * (60 / tempo);

                notes.push({
                    ...note,
                    time: timeInSeconds,
                    duration: durationInSeconds,
                });
            });
        });
    }
    
    // TODO (OPT) - Add scaling
</script>

<div id="container">
    {#if midiUrl}
        <div id="visualization">
            {#each notes as note}
                <div 
                    class="note" 
                    style="
                        width: {note.duration * 1}rem; 
                        left: {note.time * 1}rem; 
                        height: 0.5rem; 
                        top: {(110 - note.midi - 21) * 5 }px;">
                    <span class="note-label">{note.name}</span>
                </div>
            {/each}
        </div>
    {:else}
        <p>No MIDI file has been sent yet.</p>
    {/if}

    <div id="controls">
        <button class="buttonReset" on:click={togglePlay}>
            <Icon name={isPlaying ? 'pause' : 'play-fill'} class="s3rem" />
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
        height: 20rem;
        margin: 0 auto;
        padding: 1rem 2rem;
        border: 2px solid black;
        border-radius: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
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

    #visualization {
        overflow-y: hidden;
        overflow-x: auto;
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        position: relative;
        gap: 2px;
    }

    .note {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
    }

    .note-label {
        padding: 0 2px;
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