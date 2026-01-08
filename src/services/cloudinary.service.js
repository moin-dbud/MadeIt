/**
 * Cloudinary Upload Service
 * FREE tier - for milestone proof uploads (images, videos, documents)
 * Uses unsigned uploads via upload preset
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/**
 * Validate file before upload
 */
export const validateFile = (file, type = 'image') => {
    const errors = [];

    // Check file size
    let maxSize;
    let allowedTypes;

    switch (type) {
        case 'image':
            maxSize = MAX_IMAGE_SIZE;
            allowedTypes = ALLOWED_IMAGE_TYPES;
            break;
        case 'video':
            maxSize = MAX_VIDEO_SIZE;
            allowedTypes = ALLOWED_VIDEO_TYPES;
            break;
        case 'document':
            maxSize = MAX_DOCUMENT_SIZE;
            allowedTypes = ALLOWED_DOCUMENT_TYPES;
            break;
        default:
            maxSize = MAX_IMAGE_SIZE;
            allowedTypes = ALLOWED_IMAGE_TYPES;
    }

    if (file.size > maxSize) {
        errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Upload file to Cloudinary
 * Returns secure URL for storage in Firestore
 */
export const uploadToCloudinary = async (file, options = {}) => {
    const {
        folder = 'milestone-proofs',
        resourceType = 'auto', // auto, image, video, raw
        onProgress = null
    } = options;

    // Validate file
    const fileType = file.type.startsWith('image/') ? 'image' :
        file.type.startsWith('video/') ? 'video' : 'document';

    const validation = validateFile(file, fileType);
    if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);

    try {
        // Upload with progress tracking
        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(Math.round(percentComplete));
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed due to network error'));
            });

            xhr.open('POST', CLOUDINARY_UPLOAD_URL);
            xhr.send(formData);
        });

        // Return only necessary data for Firestore
        return {
            fileUrl: response.secure_url,
            fileType: response.resource_type,
            format: response.format,
            size: response.bytes,
            width: response.width,
            height: response.height,
            uploadedAt: new Date().toISOString(),
            publicId: response.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleToCloudinary = async (files, options = {}) => {
    const { onProgress = null } = options;

    const uploadPromises = files.map((file, index) => {
        return uploadToCloudinary(file, {
            ...options,
            onProgress: onProgress ? (percent) => {
                // Calculate overall progress
                const overallProgress = ((index * 100) + percent) / files.length;
                onProgress(Math.round(overallProgress));
            } : null
        });
    });

    return Promise.all(uploadPromises);
};

/**
 * Delete file from Cloudinary (optional - for cleanup)
 * Note: Requires backend implementation with API secret
 */
export const deleteFromCloudinary = async (publicId) => {
    // This would need to be implemented on the backend
    // as it requires the API secret which should NOT be exposed on frontend
    console.warn('Delete operation requires backend implementation');
    throw new Error('Delete operation not implemented on frontend');
};

export default {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    validateFile,
    deleteFromCloudinary
};
