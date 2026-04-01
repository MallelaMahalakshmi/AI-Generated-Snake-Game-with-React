import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'SYS.AUDIO.01',
    artist: 'CYBER_MIND_V1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
  },
  {
    id: 2,
    title: 'SYS.AUDIO.02',
    artist: 'NEURAL_NET_ERR',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: 3,
    title: 'SYS.AUDIO.03',
    artist: 'GHOST_PROTOCOL',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44',
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setProgress(0); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setProgress(0); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnded = () => handleNext();

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#f0f] p-6 shadow-[-8px_8px_0px_#0ff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4 mb-6 border-b-2 border-[#0ff] pb-4">
        <div className="w-16 h-16 bg-[#0ff] border-2 border-[#f0f] flex items-center justify-center relative overflow-hidden">
          <span className="text-black text-3xl font-black">♪</span>
          {isPlaying && (
            <div className="absolute inset-0 bg-black/50 animate-pulse mix-blend-difference" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 
            className="text-[#f0f] font-bold text-3xl truncate glitch-text"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </h3>
          <p className="text-[#0ff] text-xl truncate mt-1 bg-black inline-block px-1">
            {currentTrack.artist}
          </p>
        </div>
        <div className="flex items-end gap-1 h-8 w-12">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-2 bg-[#f0f] ${isPlaying ? 'animate-pulse' : 'h-1'}`}
              style={{ 
                height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '10%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div 
          className="h-4 w-full bg-black border-2 border-[#0ff] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-[#f0f] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0ff]">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#f0f] hover:bg-[#0ff] px-2 border border-transparent hover:border-[#f0f] text-xl">
            {isMuted || volume === 0 ? 'VOL:MUTE' : 'VOL:LVL'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 accent-[#f0f] h-2 bg-black border border-[#0ff] appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-[#0ff] hover:text-black hover:bg-[#0ff] border-2 border-[#0ff] px-3 py-1 text-xl"
          >
            &lt;&lt;
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-16 h-12 bg-[#f0f] border-2 border-[#0ff] flex items-center justify-center text-black hover:bg-[#0ff] hover:border-[#f0f] text-2xl font-black"
          >
            {isPlaying ? '||' : '>'}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-[#0ff] hover:text-black hover:bg-[#0ff] border-2 border-[#0ff] px-3 py-1 text-xl"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t-2 border-[#f0f]">
        <div className="space-y-2">
          {TRACKS.map((track, idx) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`flex items-center justify-between p-2 cursor-pointer border-2 ${
                idx === currentTrackIndex 
                  ? 'bg-[#0ff] border-[#f0f] text-black' 
                  : 'bg-black border-transparent text-[#0ff] hover:border-[#0ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">[{idx + 1}]</span>
                <span className="text-xl">{track.title}</span>
              </div>
              <span className="text-lg">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
