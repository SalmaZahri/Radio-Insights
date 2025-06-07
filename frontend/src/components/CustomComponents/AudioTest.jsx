import React, { useState } from 'react';
import WaveSurferPlayer from './WaveSurferPlayer';
import { Button } from "@/components/ui/button";

export default function AudioTest() {
  const [selectedAudio, setSelectedAudio] = useState(null);
  
  // List of available audio files
  const audioFiles = [
    "001a231d.wav.mp3",
    "001a26a1.wav.mp3",
    "001a26c6.wav.mp3",
    "001a26fc.wav.mp3",
    "001a2b91.wav.mp3",
    "001a38fc.wav.mp3",
    "001a6d65.wav.mp3",
    "001a9d68.wav.mp3",
    "001a9d8f.wav.mp3",
    "0042a078.wav.mp3",
    "0042f4a5.wav.mp3",
    "0A4AF06C.wav.mp3",
    "0AA83AD1.wav.mp3"
  ];
  
  const handleSelectAudio = (filename) => {
    const audioUrl = `http://localhost:5000/uploads/${filename}`;
    console.log("Selected audio URL:", audioUrl);
    setSelectedAudio(audioUrl);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Audio Test Component</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {audioFiles.map((filename) => (
          <Button
            key={filename}
            variant={selectedAudio && selectedAudio.includes(filename) ? "default" : "outline"}
            onClick={() => handleSelectAudio(filename)}
            className="text-sm"
          >
            {filename}
          </Button>
        ))}
      </div>
      
      {selectedAudio ? (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-medium mb-4">Playing: {selectedAudio.split('/').pop()}</h2>
          <WaveSurferPlayer audioUrl={selectedAudio} />
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">Select an audio file to play</p>
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-medium mb-2">Debug Information</h2>
        <p className="text-sm text-gray-600">Current audio URL: {selectedAudio || "None"}</p>
        <p className="text-sm text-gray-600">Backend URL: http://localhost:5000</p>
        <p className="text-sm text-gray-600">Frontend URL: http://localhost:5173</p>
      </div>
    </div>
  );
}
