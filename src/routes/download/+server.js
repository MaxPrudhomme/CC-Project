import { BlobServiceClient } from '@azure/storage-blob';
import { error } from '@sveltejs/kit';

const sasToken = process.env.AZURE_DOWNLOAD_TOKEN;
const accountName = "ccprojectsa";
const containerName = "file-output";

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`
);

export async function GET({ url }) {
    const blobName = url.searchParams.get('blobName');

    if (!blobName) {
        throw error(400, 'Missing blobName parameter');
    }

    try {
        // Remove the file extension and append '_basic_pitch.mid'
        const fileNameWithoutExtension = blobName.replace(/\.[^/.]+$/, '');
        const modifiedBlobName = `${fileNameWithoutExtension}_basic_pitch.mid`;

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(modifiedBlobName);

        // Download the blob directly without explicit exists check
        const downloadBlockBlobResponse = await blobClient.download();
        
        return new Response(downloadBlockBlobResponse.readableStreamBody, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${modifiedBlobName}"`,
            },
        });

    } catch (err) {
        // Only log unexpected errors, not 404
        if (err.statusCode !== 404) {
            console.error('Unexpected error downloading file:', err);
        }
        
        // Always throw a 404 if blob is not found
        throw error(404, 'File not found');
    }
}