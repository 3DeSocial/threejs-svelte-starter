export async function GET({ url }) {
    // Extract the image URL from the request parameters
    const imageUrl = url.searchParams.get('url');

    // Fetch the image from the remote server
    const response = await fetch(imageUrl);

    // Get the image data
    const imageData = await response.arrayBuffer();

    // Return the image data with the correct headers
    return new Response(imageData, {
        headers: response.headers
    });
}
