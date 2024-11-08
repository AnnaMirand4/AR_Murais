import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Lottie from "react-lottie";
import animationData from "../assets/peixe.json";

const Camera = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [objectDetected, setObjectDetected] = useState(false);

  // Carrega o modelo do Teachable Machine ao montar o componente
  useEffect(() => {
    const loadModel = async () => {
      const modelURL = '/model/model.json';
      try {
        const loadedModel = await tf.loadLayersModel(modelURL);
        setModel(loadedModel);
      } catch (error) {
        console.error("Erro ao carregar o modelo:", error);
      }
    };
    loadModel();
  }, []);

  // Ativa a câmera
  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
      }
    };
    enableCamera();
  }, []);

  // Detecta a imagem específica continuamente usando o modelo do Teachable Machine
  useEffect(() => {
    if (model && videoRef.current) {
      const detectImage = async () => {
        tf.engine().startScope();

        const video = videoRef.current;
        const inputTensor = tf.browser.fromPixels(video)
          .resizeBilinear([224, 224])
          .expandDims(0);

        const predictions = model.predict(inputTensor);
        const predictionData = predictions.dataSync();
        
        // Ajuste o limiar para detecção e verifique o valor da previsão
        const isDetected = predictionData[0] > 0.9;
        
        setObjectDetected(isDetected);

        tf.dispose([inputTensor, predictions]);

        tf.engine().endScope();
      };

      const interval = setInterval(detectImage, 500);
      return () => clearInterval(interval);
    }
  }, [model]);

  useEffect(() => {
    console.log("Objeto detectado:", objectDetected); // Verifique se o estado está mudando
  }, [objectDetected]);

  // Configurações para a animação Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "100%", height: "100%" }}
      />
      {/* Exibe a animação Lottie se a imagem específica for detectada */}
      {objectDetected && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      )}
    </div>
  );
};

export default Camera;
