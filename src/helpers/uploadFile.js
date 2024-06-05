

const uploadFile = async (file) => {
    const Baseurl = `${process.env.REACT_APP_BACKEND_URL}/api/upload`
    try {
        // Get secure URL from our server
        const response = await fetch(Baseurl);
        const { url } = await response.json();
        console.log(url);

        // Post the file directly to the S3 bucket
        const result = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type // Use the file's MIME type
            },
            body: file
        });

        if (result.ok) {
            // Successfully uploaded to S3
            const uploadedFileURL = url.split('?')[0];
            let uploadResult = {"url": uploadedFileURL};
           return uploadResult;
        } else {
            throw new Error('Failed to upload to S3');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export default uploadFile