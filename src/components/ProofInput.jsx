import { useState } from "react";
import { Upload, Link as LinkIcon, Code, FileText, Image as ImageIcon, Video, AlertCircle, Check } from "lucide-react";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "../services/cloudinary.service";
import GitHubCommitSelector from "./GitHubCommitSelector";

export default function ProofInput({ proof, value, onChange, error, githubCommits, githubLoading }) {
    const [uploading, setUploading] = useState(false);

    const renderInput = () => {
        switch (proof.type) {
            case 'github_commit':
            case 'github_commit_range':
                return (
                    <GitHubCommitSelector
                        commits={githubCommits}
                        loading={githubLoading}
                        rangeMode={proof.type === 'github_commit_range'}
                        value={value}
                        onChange={onChange}
                    />
                );

            case 'image':
                return (
                    <ImageUploadInput
                        maxFiles={proof.maxFiles || 1}
                        value={value}
                        onChange={onChange}
                        uploading={uploading}
                        setUploading={setUploading}
                    />
                );

            case 'video':
                return (
                    <VideoInput
                        maxDuration={proof.maxDuration}
                        value={value}
                        onChange={onChange}
                    />
                );

            case 'url':
                return (
                    <URLInput
                        value={value}
                        onChange={onChange}
                        mustBeAccessible={proof.mustBeAccessible}
                    />
                );

            case 'code_snippet':
                return (
                    <CodeSnippetInput
                        value={value}
                        onChange={onChange}
                        maxLines={proof.maxLines}
                    />
                );

            case 'reflection':
                return (
                    <ReflectionInput
                        value={value}
                        onChange={onChange}
                        minWords={proof.minWords}
                        maxWords={proof.maxWords}
                    />
                );

            case 'document':
                return (
                    <DocumentUploadInput
                        acceptedFormats={proof.acceptedFormats}
                        value={value}
                        onChange={onChange}
                        uploading={uploading}
                        setUploading={setUploading}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#606060] focus:outline-none focus:border-[#FF6B35] transition-colors"
                    />
                );
        }
    };

    return (
        <div className="space-y-3">
            {/* Label and Description */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-white">
                        {proof.label}
                        {proof.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {proof.autoFetch && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                            Auto-fetched
                        </span>
                    )}
                </div>
                <p className="text-xs text-[#A0A0A0]">
                    {proof.description}
                </p>
                {proof.why && (
                    <p className="text-xs text-[#606060] mt-1 italic">
                        Why: {proof.why}
                    </p>
                )}
            </div>

            {/* Input */}
            {renderInput()}

            {/* Error */}
            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {error}
                </p>
            )}
        </div>
    );
}

// Image Upload Component
function ImageUploadInput({ maxFiles, value, onChange, uploading, setUploading }) {
    const [previews, setPreviews] = useState(value?.urls || []);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > maxFiles) {
            alert(`Maximum ${maxFiles} file(s) allowed`);
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Upload to Cloudinary
            const uploadResults = await uploadMultipleToCloudinary(files, {
                folder: 'milestone-proofs/images',
                resourceType: 'image',
                onProgress: (percent) => {
                    setUploadProgress(percent);
                }
            });

            // Extract URLs from upload results
            const urls = uploadResults.map(result => result.fileUrl);

            setPreviews(urls);
            onChange({
                urls,
                files: uploadResults.map(r => ({
                    url: r.fileUrl,
                    type: r.fileType,
                    size: r.size,
                    uploadedAt: r.uploadedAt
                }))
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            alert(error.message || "Failed to upload images. Please try again.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div>
            <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-lg p-6 hover:border-[#FF6B35] transition-colors">
                    <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                            <>
                                <div className="w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-[#FF6B35]">
                                    Uploading... {uploadProgress}%
                                </p>
                                <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mt-2">
                                    <div
                                        className="h-full bg-[#FF6B35] transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <ImageIcon size={24} className="text-[#A0A0A0]" />
                                <p className="text-sm text-[#A0A0A0]">
                                    Click to upload {maxFiles > 1 ? `(max ${maxFiles} files)` : ''}
                                </p>
                                <p className="text-xs text-[#606060]">
                                    Max 5MB per image • JPG, PNG, WebP
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple={maxFiles > 1}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {previews.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-[rgba(255,255,255,0.1)]"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Video Input Component
function VideoInput({ maxDuration, value, onChange }) {
    return (
        <div className="space-y-2">
            <input
                type="url"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter video URL (YouTube, Loom, etc.)"
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#606060] focus:outline-none focus:border-[#FF6B35] transition-colors"
            />
            {maxDuration && (
                <p className="text-xs text-[#606060]">
                    Maximum duration: {maxDuration} seconds
                </p>
            )}
        </div>
    );
}

// URL Input Component
function URLInput({ value, onChange, mustBeAccessible }) {
    return (
        <div className="space-y-2">
            <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]" />
                <input
                    type="url"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#606060] focus:outline-none focus:border-[#FF6B35] transition-colors"
                />
            </div>
            {mustBeAccessible && (
                <p className="text-xs text-[#606060]">
                    URL must be publicly accessible
                </p>
            )}
        </div>
    );
}

// Code Snippet Input Component
function CodeSnippetInput({ value, onChange, maxLines }) {
    const lineCount = value ? value.split('\n').length : 0;

    return (
        <div className="space-y-2">
            <div className="relative">
                <Code size={16} className="absolute left-3 top-3 text-[#606060]" />
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste your code here..."
                    rows={10}
                    className="w-full pl-10 pr-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#606060] focus:outline-none focus:border-[#FF6B35] transition-colors font-mono text-sm"
                />
            </div>
            <div className="flex justify-between text-xs text-[#606060]">
                <span>Lines: {lineCount}</span>
                {maxLines && (
                    <span className={lineCount > maxLines ? 'text-red-400' : ''}>
                        Max: {maxLines} lines
                    </span>
                )}
            </div>
        </div>
    );
}

// Reflection Input Component
function ReflectionInput({ value, onChange, minWords, maxWords }) {
    const wordCount = value ? value.trim().split(/\s+/).filter(w => w.length > 0).length : 0;

    return (
        <div className="space-y-2">
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your reflection here..."
                rows={8}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#606060] focus:outline-none focus:border-[#FF6B35] transition-colors resize-none"
            />
            <div className="flex justify-between text-xs">
                <span className={
                    wordCount < minWords ? 'text-red-400' :
                        wordCount > maxWords ? 'text-red-400' :
                            'text-[#606060]'
                }>
                    Words: {wordCount}
                </span>
                <span className="text-[#606060]">
                    {minWords && maxWords ? `${minWords}-${maxWords} words` :
                        minWords ? `Min: ${minWords} words` :
                            maxWords ? `Max: ${maxWords} words` : ''}
                </span>
            </div>
        </div>
    );
}

// Document Upload Component
function DocumentUploadInput({ acceptedFormats, value, onChange, uploading, setUploading }) {
    const [fileName, setFileName] = useState(value?.fileName || '');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();
        if (acceptedFormats && !acceptedFormats.includes(extension)) {
            alert(`Only ${acceptedFormats.join(', ')} files are allowed`);
            return;
        }

        setUploading(true);
        try {
            // Upload to Cloudinary
            const uploadResult = await uploadToCloudinary(file, {
                folder: 'milestone-proofs/documents',
                resourceType: 'raw' // For PDFs and other documents
            });

            setFileName(file.name);
            onChange({
                url: uploadResult.fileUrl,
                fileName: file.name,
                size: uploadResult.size,
                uploadedAt: uploadResult.uploadedAt
            });
        } catch (error) {
            console.error("Error uploading document:", error);
            alert(error.message || "Failed to upload document. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-lg p-6 hover:border-[#FF6B35] transition-colors">
                    <div className="flex flex-col items-center gap-2">
                        <FileText size={24} className="text-[#A0A0A0]" />
                        <p className="text-sm text-[#A0A0A0]">
                            Click to upload document
                        </p>
                        {acceptedFormats && (
                            <p className="text-xs text-[#606060]">
                                Accepted: {acceptedFormats.join(', ')}
                            </p>
                        )}
                    </div>
                </div>
                <input
                    type="file"
                    accept={acceptedFormats ? acceptedFormats.map(f => `.${f}`).join(',') : '*'}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>

            {fileName && (
                <div className="mt-3 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg flex items-center gap-2">
                    <Check size={16} className="text-green-400" />
                    <span className="text-sm text-white">{fileName}</span>
                </div>
            )}
        </div>
    );
}
