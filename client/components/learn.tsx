import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import './styles/learn.css';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyAoySlDGPutWh9nnzMoKd07xhp3pxCYLYU';

interface LearnItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export function Learn() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<LearnItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<LearnItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSearchResultsModalOpen, setIsSearchResultsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery + ' recipe')}&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.items && data.items.length > 0) {
        setVideos(data.items);
        setIsSearchResultsModalOpen(true);
      } else {
        console.log('No videos found in the API response');
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    }
  };

  const handleVideoClick = (video: LearnItem) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
    setIsSearchResultsModalOpen(false);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handleCloseSearchResultsModal = () => {
    setIsSearchResultsModalOpen(false);
  };

  return (
    <div className="learn-container">
      <h2>Video Tutorials</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for cooking tutorials..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <Dialog open={isSearchResultsModalOpen} onOpenChange={handleCloseSearchResultsModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-100 to-yellow-50">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-orange-800">Search Results</DialogTitle>
          </DialogHeader>
          <div className="video-list">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video.id.videoId} className="video-item" onClick={() => handleVideoClick(video)}>
                  <h3>{video.snippet.title}</h3>
                  <Image 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title} 
                    width={320} 
                    height={180} 
                    unoptimized
                  />
                </div>
              ))
            ) : (
              <p>No videos found. Please try a different search.</p>
            )}
          </div>
          <Button onClick={handleCloseSearchResultsModal} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white">Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isVideoModalOpen} onOpenChange={handleCloseVideoModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-100 to-yellow-50">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-orange-800">{selectedVideo?.snippet.title}</DialogTitle>
          </DialogHeader>
          <div>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${selectedVideo?.id.videoId}`}
              title={selectedVideo?.snippet.title}
              frameBorder="0"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
          <Button onClick={handleCloseVideoModal} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white">Close</Button>
        </DialogContent>
      </Dialog>

      <h2>Submit Your Own Video</h2>
      <form onSubmit={(e) => e.preventDefault()} className="video-form">
        <input
          type="text"
          placeholder="Enter your video URL"
          required
          className="video-input"
        />
        <button type="submit" className="add-video-button">Add Video</button>
      </form>

      <h2>Cooking Tips</h2>
      {/* Add your cooking tips content here */}
    </div>
  );
}
