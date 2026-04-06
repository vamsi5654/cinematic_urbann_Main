import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Trash2, X, LogOut, Plus, Video, Mail, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { VideoItem, ContactSubmission, ImageItem } from '../types/index';
import * as api from '../src/services/api';
import * as imageApi from '../src/services/imageApi';
import { uploadImageToR2, validateImageFile, deleteImageFromR2 } from '../src/services/r2Upload';
import styles from './Admin.module.css';

const categories = ['Kitchen', 'Living', 'Bedroom', 'Full Home', 'Bathroom', 'Office'];
const imageCategories = ['Kitchen', 'Living', 'Bedroom', 'Bathroom']; // Only 4 for images

export default function AdminVideo() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(!api.isAuthenticated());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'videos' | 'images' | 'contacts'>('videos');

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [uploadForm, setUploadForm] = useState({
    videoUrl: '',
    category: '',
    title: ''
  });

  const [imageUploadForm, setImageUploadForm] = useState({
    files: [] as File[],
    category: '',
    title: ''
  });

  useEffect(() => {
    if (api.isAuthenticated()) {
      loadVideos();
      loadContacts();
      loadImages();
    }
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedVideos = await api.getVideos();
      setVideos(fetchedVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedContacts = await api.getContactSubmissions();
      setContacts(fetchedContacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedImages = await imageApi.getImages();
      setImages(fetchedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.login(loginForm.username, loginForm.password);
      setShowLoginModal(false);
      loadVideos();
      loadContacts();
      loadImages();
    } catch (err) {
      alert('Login failed. Please check your credentials.\n\nMake sure you created an admin user in Supabase Auth dashboard.');
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    api.logout();
    setShowLoginModal(true);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.videoUrl || !uploadForm.category) {
      alert('Please provide both video URL and category');
      return;
    }

    try {
      setIsUploading(true);
      await api.createVideo({
        videoUrl: uploadForm.videoUrl,
        category: uploadForm.category,
        title: uploadForm.title || undefined
      });

      alert('Video added successfully!');
      setShowUploadModal(false);
      setUploadForm({ videoUrl: '', category: '', title: '' });
      loadVideos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await api.deleteVideo(videoId);
      setVideos(videos.filter(v => v.id !== videoId));
    } catch (err) {
      alert('Failed to delete video');
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUploadForm.files.length || !imageUploadForm.category) {
      alert('Please provide both image files and category');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const totalFiles = imageUploadForm.files.length;
      let successCount = 0;
      let failCount = 0;

      // Upload each file
      for (let i = 0; i < totalFiles; i++) {
        const file = imageUploadForm.files[i];
        
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          console.warn(`Skipping ${file.name}: ${validation.error}`);
          failCount++;
          continue;
        }

        try {
          // Upload image to R2
          const uploadResult = await uploadImageToR2(
            file,
            imageUploadForm.category,
            (progress) => {
              // Calculate overall progress
              const fileProgress = progress.percent / totalFiles;
              const previousProgress = (i / totalFiles) * 100;
              setUploadProgress(Math.round(previousProgress + fileProgress));
            }
          );

          if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Upload failed');
          }

          // Save metadata to database
          await imageApi.createImage({
            imageUrl: uploadResult.imageUrl,
            fileName: uploadResult.fileName,
            category: imageUploadForm.category as any,
            title: imageUploadForm.title || `Image ${i + 1}`,
            fileSize: uploadResult.fileSize,
          });

          successCount++;
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err);
          failCount++;
        }
      }

      setUploadProgress(100);

      // Show result
      if (successCount > 0 && failCount === 0) {
        alert(`✅ Successfully uploaded ${successCount} image(s)!`);
      } else if (successCount > 0 && failCount > 0) {
        alert(`⚠️ Uploaded ${successCount} image(s), ${failCount} failed.`);
      } else {
        alert(`❌ Failed to upload images. Please try again.`);
      }

      setShowImageUploadModal(false);
      setImageUploadForm({ files: [], category: '', title: '' });
      setUploadProgress(0);
      loadImages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add images');
      console.error('Image upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const image = images.find(img => img.id === imageId);
      if (image && image.fileName) {
        // Delete from R2
        await deleteImageFromR2(image.fileName);
      }
      
      // Delete from database
      await imageApi.deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      alert('Failed to delete image');
      console.error('Image delete error:', err);
    }
  };

  if (showLoginModal) {
    return (
      <div className={styles.loginContainer}>
        <motion.div
          className={styles.loginBox}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Login</Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Video Portfolio Management</h1>
          <div className={styles.headerActions}>
            {activeTab === 'videos' && (
              <Button
                variant="secondary"
                onClick={() => setShowUploadModal(true)}
                icon={<Plus size={20} />}
              >
                Add Video
              </Button>
            )}
            {activeTab === 'images' && (
              <Button
                variant="secondary"
                onClick={() => setShowImageUploadModal(true)}
                icon={<Plus size={20} />}
              >
                Add Image
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              icon={<LogOut size={20} />}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'videos' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <Video size={18} />
            Videos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'images' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <ImageIcon size={18} />
            Images
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'contacts' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
        </div>

        {activeTab === 'videos' && (
          <>
            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
              <div className={styles.loading}>Loading videos...</div>
            ) : (
              <div className={styles.videoGrid}>
                {videos.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Video size={48} />
                    <p>No videos yet</p>
                    <p className={styles.emptyStateSubtext}>Click "Add Video" to get started</p>
                  </div>
                ) : (
                  videos.map((video) => (
                    <div key={video.id} className={styles.videoCard}>
                      <div className={styles.videoPreview}>
                        <iframe
                          src={api.getYouTubeEmbedUrl(video.videoId, false)}
                          title={video.title || video.category}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className={styles.videoIframe}
                        />
                      </div>
                      <div className={styles.videoInfo}>
                        <div className={styles.categoryBadge}>{video.category}</div>
                        {video.title && <h3>{video.title}</h3>}
                        <p className={styles.videoId}>ID: {video.videoId}</p>
                        <p className={styles.videoDate}>
                          Added: {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(video.id)}
                        aria-label="Delete video"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <>
            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
              <div className={styles.loading}>Loading images...</div>
            ) : (
              <div className={styles.videoGrid}>
                {images.length === 0 ? (
                  <div className={styles.emptyState}>
                    <ImageIcon size={48} />
                    <p>No images yet</p>
                    <p className={styles.emptyStateSubtext}>Click "Add Image" to get started</p>
                  </div>
                ) : (
                  images.map((image) => (
                    <div key={image.id} className={styles.videoCard}>
                      <div className={styles.videoPreview}>
                        <ImageWithFallback
                          src={image.imageUrl}
                          alt={image.title || image.category}
                          className={styles.videoIframe}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      </div>
                      <div className={styles.videoInfo}>
                        <div className={styles.categoryBadge}>{image.category}</div>
                        {image.title && <h3>{image.title}</h3>}
                        <p className={styles.videoId}>Size: {(image.fileSize / 1024).toFixed(0)} KB</p>
                        <p className={styles.videoDate}>
                          Added: {new Date(image.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleImageDelete(image.id)}
                        aria-label="Delete image"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className={styles.contactsTab}>
            {loading ? (
              <div className={styles.loading}>Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className={styles.emptyState}>
                <Mail size={48} />
                <p>No contact submissions yet</p>
                <p className={styles.emptyStateSubtext}>Submissions from the contact form will appear here</p>
              </div>
            ) : (
              <div className={styles.contactsList}>
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`${styles.contactCard} ${contact.status === 'new' ? styles.unread : ''}`}
                  >
                    <div className={styles.contactHeader}>
                      <div>
                        <h3>{contact.name}</h3>
                        <p className={styles.contactEmail}>{contact.email}</p>
                      </div>
                      <span className={styles.badge}>{contact.status}</span>
                    </div>
                    <div className={styles.contactDetails}>
                      {contact.phone && (
                        <div className={styles.contactRow}>
                          <strong>Phone</strong>
                          <p>{contact.phone}</p>
                        </div>
                      )}
                      <div className={styles.contactRow}>
                        <strong>Message</strong>
                        <p>{contact.message}</p>
                      </div>
                    </div>
                    <div className={styles.contactFooter}>
                      Submitted: {new Date(contact.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
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
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h2>Add New Video</h2>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowUploadModal(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpload} className={styles.uploadForm}>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>YouTube Video URL *</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                      value={uploadForm.videoUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                      required
                    />
                    <small>Supported formats: youtube.com/watch?v=ID, youtu.be/ID, or direct video ID</small>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Project Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Modern Minimalist Kitchen"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    />
                  </div>

                  {/* Preview */}
                  {uploadForm.videoUrl && (
                    <div className={styles.formGroup}>
                      <label>Preview</label>
                      <div className={styles.videoPreviewContainer}>
                        {(() => {
                          const videoId = api.extractYouTubeVideoId(uploadForm.videoUrl);
                          if (videoId) {
                            return (
                              <iframe
                                src={api.getYouTubeEmbedUrl(videoId, false)}
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className={styles.videoPreviewIframe}
                              />
                            );
                          } else {
                            return <p className={styles.invalidUrl}>Invalid YouTube URL</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUploading || !uploadForm.videoUrl || !uploadForm.category}
                      icon={<Upload size={20} />}
                    >
                      {isUploading ? 'Adding...' : 'Add Video'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Upload Modal */}
        <AnimatePresence>
          {showImageUploadModal && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageUploadModal(false)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <h2>Add New Image</h2>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowImageUploadModal(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleImageUpload} className={styles.uploadForm}>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select
                      value={imageUploadForm.category}
                      onChange={(e) => setImageUploadForm({ ...imageUploadForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select a category</option>
                      {imageCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Image Files *</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        console.log('📁 Files selected:', files.length);
                        files.forEach((file, i) => {
                          console.log(`  ${i + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
                        });
                        setImageUploadForm({ ...imageUploadForm, files });
                      }}
                      required
                    />
                    <small>
                      {imageUploadForm.files.length > 0 
                        ? `${imageUploadForm.files.length} file(s) selected`
                        : 'Select one or more images (JPEG, PNG, WebP, GIF)'}<br />
                      <strong>Tip:</strong> Hold Ctrl (Windows) or Cmd (Mac) to select multiple files
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Project Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Modern Minimalist Kitchen"
                      value={imageUploadForm.title}
                      onChange={(e) => setImageUploadForm({ ...imageUploadForm, title: e.target.value })}
                    />
                  </div>

                  {/* Preview */}
                  {imageUploadForm.files.length > 0 && (
                    <div className={styles.formGroup}>
                      <label>Preview ({imageUploadForm.files.length} file{imageUploadForm.files.length > 1 ? 's' : ''})</label>
                      <div className={styles.imagePreviewContainer}>
                        <img
                          src={URL.createObjectURL(imageUploadForm.files[0])}
                          alt="Preview"
                          className={styles.imagePreview}
                        />
                        {imageUploadForm.files.length > 1 && (
                          <div style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>
                            +{imageUploadForm.files.length - 1} more image{imageUploadForm.files.length - 1 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && uploadProgress > 0 && (
                    <div className={styles.formGroup}>
                      <label>Upload Progress</label>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${uploadProgress}%`, 
                          height: '100%', 
                          backgroundColor: '#4CAF50',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <small style={{ marginTop: '4px', display: 'block' }}>{uploadProgress}% complete</small>
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowImageUploadModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUploading || !imageUploadForm.files.length || !imageUploadForm.category}
                      icon={<Upload size={20} />}
                    >
                      {isUploading ? 'Adding...' : 'Add Image'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}