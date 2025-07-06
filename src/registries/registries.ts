
export const transportRegistry = {
    fetchContentFromPath: async (path: string) => {
        const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${path}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from: (URL: ${url})`);
        }
        return await response.text();
    }
};