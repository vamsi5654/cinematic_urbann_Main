import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Trash2, X, LogOut, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ImageUpload } from '../types/index';
import * as api from '../src/services/api';
import styles from './Admin.module.css';

// Group images by customer number
interface CustomerGroup {
  customerNumber: string;
  category: string;
  images: ImageUpload[];
}

export default function AdminSimple() {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [customers, setCustomers] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(!api.isAuthenticated());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [uploadForm, setUploadForm] = useState({
    customerNumber: '',
    category: '',
    videoUrl: ''
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load images on mount
  useEffect(() => {
    if (api.isAuthenticated()) {
      loadImages();
    }
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedImages = await api.getImages({ status: 'all' });
      setImages(fetchedImages);
      
      // Group by customer number
      const grouped = groupByCustomer(fetchedImages);
      setCustomers(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupByCustomer = (images: ImageUpload[]): CustomerGroup[] => {
    const groups = new Map<string, CustomerGroup>();
    
    images.forEach(img => {
      if (!groups.has(img.customerNumber)) {
        groups.set(img.customerNumber, {
          customerNumber: img.customerNumber,
          category: img.category,
          images: []
        });
      }
      groups.get(img.customerNumber)!.images.push(img);
    });
    
    return Array.from(groups.values()).sort((a, b) => 
      b.images[0].uploadedAt.getTime() - a.images[0].uploadedAt.getTime()
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.login(loginForm.username, loginForm.password);
      setShowLoginModal(false);
      loadImages();
    } catch (err) {
      alert('Login failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleLogout = () => {
    api.logout();
    setShowLoginModal(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.customerNumber || !uploadForm.category) {
      alert('Customer Number and Category are required');
      return;
    }

    if (selectedImages.length === 0 && !uploadForm.videoUrl && !selectedVideoFile) {
      alert('Please upload at least one image or provide a video URL');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await api.uploadCustomerMedia({
        customerNumber: uploadForm.customerNumber,
        category: uploadForm.category as any,
        images: selectedImages,
        videoUrl: uploadForm.videoUrl || undefined,
        videoFile: selectedVideoFile || undefined
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset form and reload images
      setTimeout(() => {
        setUploadForm({
          customerNumber: '',
          category: '',
          videoUrl: ''
        });
        setSelectedImages([]);
        setSelectedVideoFile(null);
        setUploadProgress(0);
        setShowUploadModal(false);
        setIsUploading(false);
        loadImages();
      }, 500);

    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteCustomer = async (customerNumber: string) => {
    if (!confirm(`Are you sure you want to delete customer ${customerNumber} and all their media?`)) {
      return;
    }

    try {
      await api.deleteCustomer(customerNumber);
      loadImages();
    } catch (err) {
      alert('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      setSelectedImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedVideoFile(file);
    }
  };

  const handleRemoveVideo = () => {
    setSelectedVideoFile(null);
  };

  // Login Modal
  if (showLoginModal) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginModal}>
          <div className={styles.loginCard}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="primary">Login</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div>
          <h1>Customer Media Management</h1>
          <p>Upload and manage customer projects</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Plus size={20} /> Upload Media
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </Button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading customers...</div>
      ) : (
        <div className={styles.customerGrid}>
          {customers.map((customer) => (
            <div key={customer.customerNumber} className={styles.customerCard}>
              <div className={styles.customerHeader}>
                <div>
                  <h3>Customer #{customer.customerNumber}</h3>
                  <p className={styles.category}>{customer.category}</p>
                </div>
                <button
                  onClick={() => handleDeleteCustomer(customer.customerNumber)}
                  className={styles.deleteButton}
                  title="Delete customer"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className={styles.mediaGrid}>
                {customer.images.map((mediaItem) => (
                  <div key={mediaItem.id} className={styles.mediaItem}>
                    {mediaItem.videoUrl ? (
                      <div className={styles.videoPlaceholder}>
                        <span>🎥 Video</span>
                        <a href={mediaItem.videoUrl} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={mediaItem.imageUrl}
                        alt={`Customer ${customer.customerNumber}`}
                        className={styles.mediaImage}
                      />
                    )}
                    <div className={styles.mediaType}>
                      {mediaItem.videoUrl ? 'video' : 'image'}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.customerFooter}>
                <span>{customer.images.length} media items</span>
                <span>{new Date(customer.images[0].uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {customers.length === 0 && (
            <div className={styles.emptyState}>
              <p>No customers yet. Click "Upload Media" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isUploading && setShowUploadModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Upload Customer Media</h2>
                <button
                  onClick={() => !isUploading && setShowUploadModal(false)}
                  className={styles.closeButton}
                  disabled={isUploading}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} className={styles.uploadForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="customerNumber">Customer Number <span style={{color: 'var(--accent)'}}>*</span></label>
                  <input
                    id="customerNumber"
                    type="text"
                    value={uploadForm.customerNumber}
                    onChange={(e) => setUploadForm({ ...uploadForm, customerNumber: e.target.value })}
                    disabled={isUploading}
                    required
                    placeholder="Enter customer number"
                  />
                  <p style={{ marginTop: '4px', fontSize: '12px', opacity: 0.6 }}>
                    If customer exists, media will be added to existing record
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category <span style={{color: 'var(--accent)'}}>*</span></label>
                  <select
                    id="category"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    disabled={isUploading}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Living">Living</option>
                    <option value="Full Home">Full Home</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Office">Office</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="images">Upload Images</label>
                  <div
                    className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload size={48} />
                    <p>Drag and drop images here or</p>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      disabled={isUploading}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="images" className={styles.browseButton}>
                      Browse Files
                    </label>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className={styles.selectedImages}>
                      <p style={{ marginBottom: '8px', fontWeight: 500 }}>
                        Selected: {selectedImages.length} image(s)
                      </p>
                      <div className={styles.imagePreviewGrid}>
                        {selectedImages.map((file, index) => (
                          <div key={index} className={styles.imagePreview}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className={styles.removeImageButton}
                              disabled={isUploading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="videoUrl">Video URL (optional)</label>
                  <input
                    id="videoUrl"
                    type="url"
                    value={uploadForm.videoUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                    disabled={isUploading}
                    placeholder="https://example.com/video.mp4"
                  />
                  <p style={{ marginTop: '4px', fontSize: '12px', opacity: 0.6 }}>
                    Provide a direct URL to a video file (will display in gallery)
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="videoFile">Upload Video File (optional)</label>
                  <input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="videoFile" className={styles.browseButton}>
                    Browse Files
                  </label>

                  {selectedVideoFile && (
                    <div className={styles.selectedVideo}>
                      <p style={{ marginBottom: '8px', fontWeight: 500 }}>
                        Selected: {selectedVideoFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className={styles.removeVideoButton}
                        disabled={isUploading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <div className={styles.modalActions}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}