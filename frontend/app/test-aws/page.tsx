"use client";

import React, { useState } from "react";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import PrimaryButton from "../../components/website/shared/PrimaryButton";
import { useCreateTestAwMutation } from "../../hooks/useTestAwsHooks";

export default function TestAwsPage() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [gallaryFiles, setGallaryFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videosFiles, setVideosFiles] = useState<File[]>([]);

  const [lastResponse, setLastResponse] = useState<any | null>(null);
  const createMutation = useCreateTestAwMutation();

  const handleGallaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGallaryFiles(Array.from(e.target.files));
    }
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideosFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    gallaryFiles.forEach((file) => {
      formData.append("gallary", file);
    });

    if (videoFile) {
      formData.append("video", videoFile);
    }

    videosFiles.forEach((file) => {
      formData.append("videos", file);
    });

    createMutation.mutate(formData, {
      onSuccess: (res) => {
        setLastResponse(res);
      },
    });
  };

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-bg pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <span className="inline-block bg-accent-bg border border-border px-3 py-1 rounded-full text-xs font-semibold text-text-brand uppercase tracking-wider mb-3">
              Multipart File Upload Test
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text-primary">
              AWS &amp; Media Upload Form
            </h1>
            <p className="font-sans text-sm text-text-muted mt-2 max-w-xl mx-auto">
              Select image and video files directly from your system. Uploads as <code className="text-text-brand bg-surface px-1.5 py-0.5 rounded">multipart/form-data</code> to <code className="text-text-brand bg-surface px-1.5 py-0.5 rounded">TestAwsController</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-7 bg-surface border border-border rounded-card p-6 sm:p-8 shadow-card">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Field 1: Name */}
                <div>
                  <label htmlFor="name" className="block font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Name / Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter item name"
                    className="w-full bg-bg border border-border rounded-button px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Field 2: Single Image File */}
                <div>
                  <label htmlFor="image" className="block font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Main Image File (<code className="text-text-brand">image</code>) <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-bg border border-border rounded-button p-2 text-xs text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-text hover:file:bg-primary-hover cursor-pointer"
                  />
                  {imageFile && (
                    <span className="inline-block mt-1 text-[11px] text-text-brand font-medium">
                      Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>

                {/* Field 3: Gallery Image Files (Multiple) */}
                <div>
                  <label htmlFor="gallary" className="block font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Gallery Images (<code className="text-text-brand">gallary</code> - Multiple Files)
                  </label>
                  <input
                    id="gallary"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGallaryChange}
                    className="w-full bg-bg border border-border rounded-button p-2 text-xs text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-text hover:file:bg-primary-hover cursor-pointer"
                  />
                  {gallaryFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {gallaryFiles.map((file, i) => (
                        <span key={i} className="bg-bg border border-border text-[10px] text-text-secondary px-2.5 py-1 rounded-badge">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field 4: Single Video File */}
                <div>
                  <label htmlFor="video" className="block font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Single Video File (<code className="text-text-brand">video</code>)
                  </label>
                  <input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full bg-bg border border-border rounded-button p-2 text-xs text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-text hover:file:bg-primary-hover cursor-pointer"
                  />
                  {videoFile && (
                    <span className="inline-block mt-1 text-[11px] text-text-brand font-medium">
                      Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>

                {/* Field 5: Multiple Video Files */}
                <div>
                  <label htmlFor="videos" className="block font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Multiple Videos List (<code className="text-text-brand">videos</code> - Multiple Files)
                  </label>
                  <input
                    id="videos"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideosChange}
                    className="w-full bg-bg border border-border rounded-button p-2 text-xs text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-text hover:file:bg-primary-hover cursor-pointer"
                  />
                  {videosFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {videosFiles.map((file, i) => (
                        <span key={i} className="bg-bg border border-border text-[10px] text-text-secondary px-2.5 py-1 rounded-badge">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-divider">
                  <PrimaryButton
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full py-3.5 flex justify-center items-center text-sm tracking-wide"
                  >
                    {createMutation.isPending ? "Uploading & Catching Files..." : "Upload to TestAwsController"}
                  </PrimaryButton>
                </div>
              </form>
            </div>

            {/* Response Display Section */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-surface border border-border rounded-card p-6 shadow-card h-full flex flex-col">
                <div className="flex items-center justify-between border-b border-divider pb-3 mb-4">
                  <h3 className="font-heading font-bold text-base text-text-primary">
                    Caught Files Metadata
                  </h3>
                  <span className="text-[10px] font-mono bg-bg border border-border px-2 py-0.5 rounded text-text-brand">
                    Backend Response
                  </span>
                </div>

                {createMutation.isPending ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-text-muted py-12 gap-3">
                    <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full" />
                    <span className="font-sans text-xs">Uploading multipart files...</span>
                  </div>
                ) : lastResponse ? (
                  <div className="flex-1 flex flex-col">
                    <div className="bg-bg border border-border rounded-button p-4 overflow-x-auto font-mono text-xs text-text-brand leading-relaxed mb-4 flex-1">
                      <pre>{JSON.stringify(lastResponse, null, 2)}</pre>
                    </div>
                    <div className="p-3 bg-accent-bg border border-border rounded-button text-xs text-text-secondary">
                      🎉 Files caught &amp; saved to <code className="text-text-brand">./uploads/test-aws</code> on backend server.
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-text-muted py-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3 opacity-40">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="font-sans text-xs max-w-xs leading-relaxed">
                      Select your image &amp; video files, then click submit to test Multer catching files in <code className="text-text-brand">TestAwsController</code>.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <WebsiteFooter />
    </>
  );
}
