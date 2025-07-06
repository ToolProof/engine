export const transportRegistry = {
    fetchContentFromPath: async (path) => {
        const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${path}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from GitHub: ${response.statusText} (URL: ${url})`);
        }
        return await response.text();
    }
};
