import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadFile = async (fileBuffer, fileName) => {
    try {
        const response = await imagekit.upload({
            file: fileBuffer, // required
            fileName: fileName, // required
            folder: "/powerfolio_uploads" // Optional: organize uploads
        });
        return response.url;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw new Error('Image upload failed');
    }
};

export default imagekit;