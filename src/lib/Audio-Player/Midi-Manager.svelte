<script>
    import { writable } from 'svelte/store';
    export let blob = null;
    const downloadStatus = writable(null);
    let intervalId = null;

    const downloadFile = async () => {
        if (!blob) return;

        try {
            const response = await fetch(`/download?blobName=${encodeURIComponent(blob)}`);

            if (response.ok) {
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition 
                    ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
                    : 'downloaded-file.mid';
                
                const blobData = await response.blob();
                
                // Ensure the blob has content
                if (blobData.size > 0) {
                    const url = URL.createObjectURL(blobData);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);

                    downloadStatus.set('Downloaded');
                    clearInterval(intervalId);
                } else {
                    downloadStatus.set('Empty file downloaded');
                }
            } else {
                const errorText = await response.text();
                downloadStatus.set(`Download failed: ${errorText}`);
            }
        } catch (error) {
            // Reduce console logging
            downloadStatus.set('Error downloading file');
        }
    };

    const startCheckingForFile = () => {
        if (!blob) return;

        intervalId = setInterval(async () => {
            try {
                const response = await fetch(`/download?blobName=${encodeURIComponent(blob)}`);

                if (response.ok) {
                    const blobData = await response.blob();
                    if (blobData.size > 0) {
                        downloadFile();
                    } else {
                        downloadStatus.set('File not ready yet');
                    }
                } else {
                    downloadStatus.set('File not ready yet');
                }
            } catch (error) {
                downloadStatus.set('Error checking file');
            }
        }, 1000); // Check every 5 seconds
    };

    $: if (blob) {
        downloadStatus.set('Waiting for file...');
        startCheckingForFile();
    }
</script>

<div id="container">
    <p>{$downloadStatus}</p>
</div>

<style>
    #container {
        width: fit-content;
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
</style>
