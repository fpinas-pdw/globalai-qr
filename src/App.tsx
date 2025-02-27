import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

  const App: React.FC = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const cameraIdRef = useRef<string | null>(null);
  
    useEffect(() => {
      const initScanner = async () => {
        try {
          if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("qr-camera");
          }
  
          const cameras = await Html5Qrcode.getCameras();
          if (cameras.length > 0) {
            // Seleccionar la cámara trasera si está disponible
            const backCamera = cameras.find((camera) =>
              camera.label.toLowerCase().includes("back")
            );
  
            cameraIdRef.current = backCamera ? backCamera.id : cameras[cameras.length - 1].id; // Si no hay "back", usa la última
          }
        } catch (error) {
          console.error("Error iniciando la cámara:", error);
        }
      };
  
      initScanner();
  
      return () => {
        stopScanning();
      };
    }, []);
  
    const startScanning = async () => {
      if (!scannerRef.current || !cameraIdRef.current || isScanning) return;
  
      setIsScanning(true);
      setResult(null);
      try {
        await scannerRef.current.start(
          cameraIdRef.current,
          { fps: 10, qrbox: { width: 250, height: 250 } } as Html5QrcodeCameraScanConfig,
          async (decodedText) => {
            if (!/^\d+$/.test(decodedText)) {
              console.warn("El texto decodificado no es un número:", decodedText);
              return;
            }
            setResult(decodedText);
            await stopScanning();
          },
          undefined
        );
      } catch (error) {
        console.error("Error iniciando el escáner:", error);
        setIsScanning(false);
      }
    };
  
    const stopScanning = async () => {
      console.log("Deteniendo el escáner...");
      // if (!scannerRef.current || !isScanning) return;
      setIsScanning(false);
      try {
        await scannerRef.current?.stop();
      } catch (error) {
        console.warn("El escáner ya estaba detenido:", error);
      }
    };
  
    return (
      <div className="flex flex-col items-center p-4">
        <h2 className="text-lg font-bold mb-2">Escanea un Código QR-</h2>
  
        {/* Contenedor de la cámara */}
        <div id="qr-camera" className="w-64 h-64 border-2 border-gray-400 mb-4"></div>
  
        {/* Botón de escaneo */}
        <button
          onClick={() => {
            if (isScanning) {
              stopScanning();
            } else {
              startScanning();
            }
          }}
          className={`px-4 py-2 rounded-lg text-white font-bold ${
            isScanning ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {isScanning ? "Cancelar..." : "Escanear"}
        </button>
  
        {/* Resultado */}
        {isScanning?"Escaneando...":null}
        {result && <p className="mt-4 font-semibold text-green-600">Resultado: {result}</p>}
      </div>
    );
  };

export default App
