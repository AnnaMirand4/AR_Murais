import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }, // Câmera traseira
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error.message);
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  useEffect(() => {
    enableCamera(); // Ativa a câmera automaticamente ao montar o componente

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
    </div>
  );
};

export default Camera;
