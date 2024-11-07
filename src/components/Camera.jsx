import React, { useRef, useEffect, useState } from 'react';
import *as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';


const Camera = () => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detections, setDetections] = useState([]);


  const habilitarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }, // Câmera traseira
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      detectarObjetos();
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error.message);
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const detectarObjetos = async () => {
    const model = await cocoSsd.load();
    const video = videoRef.current

    const detectar = async () => {
      const predictions = await model.detect(video)
      setDetections(predictions);
      requestAnimationFrame(detectar)
    }
    detectar()
  }

  useEffect(() => {
    habilitarCamera(); // Ativa a câmera automaticamente ao montar o componente

    // Cleanup do stream ao desmontar o componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Acesse sua câmera para ter acesso às animações!</h2>
      {cameraActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%' }}
        />
      ) : (
        <p>Carregando câmera...</p>
      )}

      <div>
        {detections.map((detection, index) => (
        <p key={index}>
          {detection.class}: {Math.round(detection.score * 100)}%
        </p>
      ))}
      </div>
    </div>
  );
}

export default Camera;
