import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// List of available audio files
const availableAudioFiles = [
  "001a231d.wav.mp3", "001a26a1.wav.mp3", "001a26c6.wav.mp3", 
  "001a26fc.wav.mp3", "001a2b91.wav.mp3", "001a38fc.wav.mp3", 
  "001a6d65.wav.mp3", "001a9d68.wav.mp3", "001a9d8f.wav.mp3", 
  "0042a078.wav.mp3", "0042f4a5.wav.mp3", "0A4AF06C.wav.mp3", 
  "0AA83AD1.wav.mp3"
];

export default function WaveSurferPlayer({ audioUrl }) {
  // Extract the filename from the URL
  const getFilenameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
  };
  
  // Find a matching audio file from the available files
  const findMatchingAudioFile = (url) => {
    if (!url) return null;
    
    const filename = getFilenameFromUrl(url);
    console.log("Looking for audio file:", filename);
    
    // Check if the filename is in the available files list
    if (availableAudioFiles.includes(filename)) {
      console.log("Found exact match:", filename);
      return filename;
    }
    
    // If not found, try to find a partial match
    for (const availableFile of availableAudioFiles) {
      if (filename && availableFile.toLowerCase().includes(filename.toLowerCase())) {
        console.log("Found partial match:", availableFile, "for", filename);
        return availableFile;
      }
    }
    
    // If still not found, return null
    console.log("No match found for:", filename);
    return null;
  };
  
  // Get the full URL for the audio file
  const getFullAudioUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL, extract the filename and check if it exists
    let filename;
    if (url.startsWith('http')) {
      filename = getFilenameFromUrl(url);
    } else {
      filename = url;
    }
    
    // Find a matching audio file
    const matchingFile = findMatchingAudioFile(filename);
    if (!matchingFile) {
      console.log("No matching audio file found, using default");
      return `http://localhost:5000/uploads/${availableAudioFiles[0]}`;
    }
    
    // Construct the full URL
    return `http://localhost:5000/uploads/${matchingFile}`;
  };
  
  const fullAudioUrl = getFullAudioUrl(audioUrl);
  console.log("Full audio URL:", fullAudioUrl);
  
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Also create a standard HTML5 audio element for fallback
  const audioElementRef = useRef(null);

  // Format time in seconds to MM:SS format
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Create a standard HTML5 audio element for fallback
  useEffect(() => {
    if (fullAudioUrl && audioElementRef.current) {
      audioElementRef.current.src = fullAudioUrl;
    }
  }, [fullAudioUrl]);
  
  useEffect(() => {
    let isComponentMounted = true;
    
    const initWaveSurfer = async () => {
      if (!waveformRef.current || !isComponentMounted) return;
      
      setLoading(true);
      setError(null);
      setAudioLoaded(false);
      setLoadingProgress(0);
      
      // Destroy previous instance if it exists
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.destroy();
        } catch (err) {
          console.log("Error destroying previous wavesurfer instance:", err);
        }
      }

      console.log("Creating WaveSurfer instance");
      
      try {
        // Create new WaveSurfer instance with simpler options
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#4F46E5",
          progressColor: "#6366F1",
          height: 80,
          responsive: true,
          barWidth: 2,
          cursorWidth: 1,
          normalize: true,
          backend: 'WebAudio'
        });
        
        console.log("WaveSurfer instance created successfully");
      } catch (err) {
        console.error("Error creating WaveSurfer instance:", err);
        if (isComponentMounted) {
          setError("Erreur lors de la création du lecteur audio");
          setLoading(false);
        }
        return;
      }

      // Set initial volume
      if (wavesurferRef.current) {
        wavesurferRef.current.setVolume(volume);
      }

      // Load audio file if URL is provided
      if (fullAudioUrl && wavesurferRef.current && isComponentMounted) {
        console.log("Loading audio from URL:", fullAudioUrl);
        
        // Show loading progress
        wavesurferRef.current.on('loading', (percent) => {
          if (isComponentMounted) {
            setLoadingProgress(percent);
            console.log(`Loading audio: ${percent}%`);
          }
        });
        
        // Add a timeout to detect if loading takes too long (likely a 404)
        const timeoutId = setTimeout(() => {
          if (isComponentMounted && loading && !audioLoaded) {
            console.log("Audio loading timeout reached");
            setLoading(false);
            setError("Le fichier audio n'a pas pu être chargé. Il est possible qu'il n'existe pas.");
            if (wavesurferRef.current) {
              try {
                wavesurferRef.current.empty();
              } catch (err) {
                console.log("Error emptying wavesurfer:", err);
              }
            }
          }
        }, 10000); // 10 seconds timeout
        
        // Add event listeners
        if (wavesurferRef.current) {
          // Clear timeout if audio loads successfully
          wavesurferRef.current.once('ready', () => {
            clearTimeout(timeoutId);
            if (isComponentMounted) {
              setAudioLoaded(true);
              setLoading(false);
              setDuration(formatTime(wavesurferRef.current.getDuration()));
              console.log("Audio loaded successfully");
            }
          });
          
          // Clear timeout if there's an error
          wavesurferRef.current.once('error', (err) => {
            clearTimeout(timeoutId);
            console.error('WaveSurfer error:', err);
            if (isComponentMounted) {
              setLoading(false);
              setError("Erreur lors du chargement du fichier audio");
            }
          });
          
          wavesurferRef.current.on('play', () => {
            if (isComponentMounted) {
              setIsPlaying(true);
            }
          });

          wavesurferRef.current.on('pause', () => {
            if (isComponentMounted) {
              setIsPlaying(false);
            }
          });

          wavesurferRef.current.on('audioprocess', () => {
            if (isComponentMounted && wavesurferRef.current) {
              setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
            }
          });

          wavesurferRef.current.on('seek', () => {
            if (isComponentMounted && wavesurferRef.current) {
              setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
            }
          });
          
          // Load the audio
          try {
            wavesurferRef.current.load(fullAudioUrl);
          } catch (err) {
            console.error("Error loading audio:", err);
            if (isComponentMounted) {
              setLoading(false);
              setError("Erreur lors du chargement du fichier audio");
            }
          }
        }
      } else {
        if (isComponentMounted) {
          setLoading(false);
          setError("Aucun fichier audio disponible pour cette radio");
          console.log("No audio URL provided");
        }
      }
    };
    
    initWaveSurfer();
  }, [fullAudioUrl, volume]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.playPause();
      } catch (err) {
        console.error("Error toggling play/pause:", err);
      }
    }
  };

  const handleStop = () => {
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.stop();
      } catch (err) {
        console.error("Error stopping playback:", err);
      }
    }
  };

  const handleForward = () => {
    if (wavesurferRef.current) {
      try {
        const currentTime = wavesurferRef.current.getCurrentTime();
        const duration = wavesurferRef.current.getDuration();
        const newTime = Math.min(currentTime + 10, duration);
        wavesurferRef.current.seekTo(newTime / duration);
      } catch (err) {
        console.error("Error seeking forward:", err);
      }
    }
  };

  const handleBackward = () => {
    if (wavesurferRef.current) {
      try {
        const currentTime = wavesurferRef.current.getCurrentTime();
        const duration = wavesurferRef.current.getDuration();
        const newTime = Math.max(currentTime - 10, 0);
        wavesurferRef.current.seekTo(newTime / duration);
      } catch (err) {
        console.error("Error seeking backward:", err);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurferRef.current) {
      try {
        wavesurferRef.current.setVolume(newVolume);
      } catch (err) {
        console.error("Error setting volume:", err);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-lg font-medium">Lecteur Audio</h3>
        {loading && (
          <div className="text-sm text-gray-500">
            <p>Chargement de l'audio... {loadingProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      
      <div ref={waveformRef} className="w-full rounded-lg border p-2 bg-gray-50 min-h-[80px]" />
      
      <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
          {currentTime} / {duration}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <Button 
            onClick={handleBackward} 
            variant="outline" 
            size="sm"
            disabled={loading || error}
            title="Reculer de 10 secondes"
          >
            -10s
          </Button>
          
          <Button 
            onClick={handlePlayPause} 
            variant="default" 
            size="sm"
            disabled={loading || error}
          >
            {isPlaying ? 'Pause' : 'Lecture'}
          </Button>
          
          <Button 
            onClick={handleStop} 
            variant="outline" 
            size="sm"
            disabled={loading || error}
            title="Arrêter"
          >
            Stop
          </Button>
          
          <Button 
            onClick={handleForward} 
            variant="outline" 
            size="sm"
            disabled={loading || error}
            title="Avancer de 10 secondes"
          >
            +10s
          </Button>
          
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm hidden sm:inline">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-24"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />
          </div>
        </div>
      </div>
      
      {audioLoaded && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Fichier audio chargé avec succès</p>
          <p className="text-xs">URL: {audioUrl}</p>
        </div>
      )}
      
      {/* Hidden audio element for fallback */}
      <audio ref={audioElementRef} style={{ display: 'none' }} />
    </div>
  );
}
