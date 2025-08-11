import { useRef, useState, useEffect } from 'react';

// --- TYPER ---
interface CameraSelfieProps {
  stationName: string;
  onClose: () => void; 
}

export const CameraSelfie = ({ stationName, onClose }: CameraSelfieProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error("Kunde inte komma åt kameran:", err);
        alert("Kunde inte komma åt kameran. Se till att du har gett tillåtelse.");
        onClose(); 
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); 

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.save();
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.restore(); 

      context.fillStyle = 'white';
      context.font = 'bold 48px Inter, sans-serif';
      context.textAlign = 'center';
      context.shadowColor = 'black';
      context.shadowBlur = 10;
      context.fillText(`Hälsningar från`, canvas.width / 2, canvas.height - 100);
      context.fillText(`${stationName}!`, canvas.width / 2, canvas.height - 50);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto flex flex-col items-center gap-4'>
      {/* Spegelvänd videoström */}
      <video ref={videoRef} autoPlay playsInline muted className='w-full rounded-lg shadow-lg transform -scale-x-100'></video>
      
      <div className='flex gap-4'>
        <button onClick={takePicture} className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700'>
          Ta bild!
        </button>
        <button onClick={onClose} className='px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600'>
          Stäng
        </button>
      </div>
      
      <p className='text-gray-600 mt-4'>Din bild kommer att visas här:</p>
      
      {/* Canvas där "vykortet" ritas */}
      <canvas ref={canvasRef} className='w-full rounded-lg shadow-lg bg-gray-800'></canvas>
    </div>
  );
};