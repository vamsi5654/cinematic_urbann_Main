import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { VideoItem, ImageItem } from '../types';
import * as api from '../src/services/api';
import * as imageApi from '../src/services/imageApi';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import styles from './Gallery.module.css';

const categories = ['All', 'Kitchen', 'Living', 'Bedroom', 'Full Home', 'Bathroom', 'Office'];

export default function GalleryVideo() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectedCategory === 'All' || selectedCategory === 'Full Home' || selectedCategory === 'Office') {
        // Load only videos for "All", "Full Home", and "Office" tabs
        const fetchedVideos = await api.getVideos({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        });
        setVideos(fetchedVideos);
        setImages([]);
      } else {
        // Load only images for Kitchen, Living, Bedroom, Bathroom tabs
        const fetchedImages = await imageApi.getImages(selectedCategory);
        setImages(fetchedImages);
        setVideos([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine what type of content to show
  const showVideos = selectedCategory === 'All' || selectedCategory === 'Full Home' || selectedCategory === 'Office';
  const showImages = selectedCategory === 'Kitchen' || selectedCategory === 'Living' || 
                     selectedCategory === 'Bedroom' || selectedCategory === 'Bathroom';

  return (
    <div className={styles.gallery}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={styles.title}>Portfolio</h1>
          <p className={styles.subtitle}>
            Explore our curated collection of interior design projects
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className={styles.filterContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.categoryButtons}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.active : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Loading content...</p>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && showVideos && (
          <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {videos.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No videos found for this category.</p>
                <p className={styles.emptyStateSubtext}>
                  Check back later or select a different category.
                </p>
              </div>
            ) : (
              videos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))
            )}
          </motion.div>
        )}

        {/* Images Grid */}
        {!loading && !error && showImages && (
          <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {images.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No images found for this category.</p>
                <p className={styles.emptyStateSubtext}>
                  Check back later or select a different category.
                </p>
              </div>
            ) : (
              images.map((image, index) => (
                <ImageCard key={image.id} image={image} index={index} />
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface VideoCardProps {
  video: VideoItem;
  index: number;
}

function VideoCard({ video, index }: VideoCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Intersection Observer for autoplay when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          
          // Control video playback based on visibility
          if (iframeRef.current) {
            if (entry.isIntersecting) {
              // Play video when visible
              iframeRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
              );
            } else {
              // Pause video when not visible
              iframeRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                '*'
              );
            }
          }
        });
      },
      {
        threshold: 0.5, // Video is considered visible when 50% is in viewport
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Generate YouTube embed URL with autoplay
  const embedUrl = api.getYouTubeEmbedUrl(video.videoId, isVisible);

  return (
    <motion.div
      ref={cardRef}
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.videoContainer}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={video.title || `${video.category} Design`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.videoIframe}
        />
        
        {/* Play Icon Overlay */}
        <motion.div
          className={styles.playOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Play className={styles.playIcon} size={48} />
        </motion.div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.categoryLabel}>{video.category}</div>
        {video.title && <h3 className={styles.cardTitle}>{video.title}</h3>}
      </div>
    </motion.div>
  );
}

interface ImageCardProps {
  image: ImageItem;
  index: number;
}

function ImageCard({ image, index }: ImageCardProps) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.imageContainer}>
        <ImageWithFallback
          src={image.imageUrl}
          alt={image.title || `${image.category} Design`}
          className={styles.image}
        />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.categoryLabel}>{image.category}</div>
        {image.title && <h3 className={styles.cardTitle}>{image.title}</h3>}
      </div>
    </motion.div>
  );
}