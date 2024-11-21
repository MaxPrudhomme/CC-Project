import { BlobServiceClient } from '@azure/storage-blob';
import mime from 'mime-types';
import dotenv from 'dotenv';

dotenv.config();

const sasToken = process.env.AZURE_SAS_TOKEN;
const accountName = "ccprojectsa";
const containerName = "file-input";

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`
);

export async function POST({ request }) {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
        return new Response(
            JSON.stringify({ error: 'No file uploaded.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const allowedTypes = [
            'audio/mpeg',       // MP3
            'audio/wav',        // WAV
            'audio/ogg',        // OGG
            'audio/flac',       // FLAC
            'audio/aac',        // AAC
            'audio/x-wav',      // WAV (alternative)
            'audio/mp4',        // MP4 Audio (AAC encoded)
            'audio/x-aiff',     // AIFF (Apple's format)
            'audio/aiff',       // AIFF
            'audio/x-caf',      // CAF (Apple container format)
            'audio/x-m4a',      // M4A (audio in MP4 container)
            'audio/x-flac',     // FLAC (alternative)
        ];
        
        const fileType = mime.lookup(file.name);

        if (!allowedTypes.includes(fileType)) {
            return new Response(
                JSON.stringify({ error: 'Unsupported file type. Please upload an audio file.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobName = `${Date.now()}-${file.name}`;
        const blobClient = containerClient.getBlockBlobClient(blobName);

        // Convert the file to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the file to Azure Blob Storage
        await blobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: fileType },
        });

        return new Response(
            JSON.stringify({ message: 'File uploaded successfully!' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Upload failed:', error);

        return new Response(
            JSON.stringify({ error: 'Failed to upload file to Azure Blob Storage.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
