"use client"
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Play, Pause, Volume2, Heart, Plus, MoreHorizontal, SkipBack, SkipForward } from 'lucide-react';

interface Song {
  title: string;
  artists: string;
  duration: number;
  albumArt: string;
  audioUrl?: string; // Adding this for actual playback
}

interface SpotifyCardProps {
  songs: Song[];
  onPlayStateChange?: (isPlaying: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export function SpotifyCard({ songs, onPlayStateChange, onVolumeChange, className }: SpotifyCardProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  
  // Sync state with parent
  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  useEffect(() => {
    onVolumeChange?.(isMuted ? 0 : volume);
  }, [volume, isMuted, onVolumeChange]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleVolumeChange(e);
    
    const onMouseMove = (e: MouseEvent) => handleVolumeChange(e);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  const handleVolumeChange = (e: MouseEvent | React.MouseEvent) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    let newVolume = ((e.clientX - rect.left) / rect.width) * 100;
    newVolume = Math.max(0, Math.min(100, newVolume));
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(volume === 0 ? 75 : volume);
    } else {
      setIsMuted(true);
    }
  };

  return (
    <div 
      className={`relative group flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 p-3 px-5 rounded-full transition-all duration-500 pointer-events-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? '0 0 20px rgba(255, 40, 0, 0.2), inset 0 0 10px rgba(255, 40, 0, 0.1)' 
          : '0 10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Red Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

      {/* Wave Animation */}
      <div className="flex items-end gap-1 h-4 w-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="w-1 bg-primary rounded-full transition-all duration-300"
            style={{
              height: isPlaying ? '100%' : '20%',
              animation: isPlaying ? `spotify-wave${i} 1.${i}s ease-in-out infinite` : 'none',
              opacity: isPlaying ? 0.8 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Play/Pause Button with Spotify Logo */}
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20 relative overflow-hidden group/btn"
      >
        <div className="relative z-10 transition-transform duration-300 group-hover/btn:scale-110">
          {isPlaying ? (
            <Pause size={20} fill="black" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          )}
        </div>
      </button>

      {/* Compact Volume Control */}
      <div className="flex items-center gap-3 overflow-hidden transition-all duration-500"
           style={{ width: isHovered ? '100px' : '0px', opacity: isHovered ? 1 : 0 }}>
        <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
          {isMuted || volume === 0 ? <Volume2 size={16} className="opacity-40" /> : <Volume2 size={16} />}
        </button>
        <div 
          ref={volumeBarRef}
          className="w-16 h-1 bg-white/10 rounded-full cursor-pointer relative"
          onMouseDown={handleVolumeMouseDown}
        >
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${isMuted ? 0 : volume}%` }} 
          />
        </div>
      </div>

      <style>{`
        @keyframes spotify-wave1 { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes spotify-wave2 { 0%, 100% { height: 6px; } 50% { height: 12px; } }
        @keyframes spotify-wave3 { 0%, 100% { height: 8px; } 50% { height: 18px; } }
        @keyframes spotify-wave4 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
        @keyframes spotify-wave5 { 0%, 100% { height: 4px; } 50% { height: 13px; } }
      `}</style>
    </div>
  );
}
