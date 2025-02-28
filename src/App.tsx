import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";
import logoImage from './assets/global_header.png';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { saveToCosmosDB } from "./services/cosmosDB";

const App: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isSavingInCosmos, setIsSavingInCosmos ] =useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const cameraIdRef = useRef<string | null>(null);
  const companies = JSON.parse(import.meta.env.VITE_COMPANIES)

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

  useEffect(() => {
    console.log("---------------------------------");
    if (result && selectedCompany && !isSavingInCosmos) {
      setIsSavingInCosmos(true);
      console.log("------------------------------22222");
      const saveResult = async () => {
        try {
          await saveToCosmosDB(result, selectedCompany);
          console.log("Resultado guardado en Cosmos DB");
        } catch (error) {
          console.error("Error guardando el resultado en Cosmos DB:", error);
        }finally{
          setResult(null);
          setIsSavingInCosmos(true);
        }
      };

      saveResult();
    }
  }, [result, selectedCompany]);

  const startScanning = async () => {
    if (!scannerRef.current || !cameraIdRef.current || isScanning) return;

    setIsScanning(true);
    setResult(null);
    try {
      await scannerRef.current.start(
        cameraIdRef.current,
        { fps: 10, qrbox: { width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 } } as Html5QrcodeCameraScanConfig,
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
    <Container fluid className="fixed inset-0">
      {isSavingInCosmos?"Guardando":"No Guardando"} -- {result}
      {/* Contenedor de la cámara */}
      <Row className="d-flex align-items-center">
        <Col xs={12} className="text-center p-0" id="qr-camera" onClick={() => stopScanning()}></Col>
      </Row>
      {!isScanning && (
        <>
          <Row className="d-flex justify-center align-items-center">
            <Col xs={12} className="text-center">
              <img
                src={logoImage}
                alt="Logo"
                className="img-fluid"
                style={{ width: '50%', height: 'auto' }}
              />
            </Col>
            <Col xs={12} className="text-center">
              <Form.Select
                value={selectedCompany || ""}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="my-3"
              >
                <option value="" className="bg-white text-gray-800">Select a company</option>
                {companies.map((company: string) => (
                  <option key={company} value={company} className="bg-white text-gray-800">
                    {company}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} className="text-center">
              <Button
                onClick={() => {
                  if (isScanning) {
                    stopScanning();
                  } else {
                    startScanning();
                  }
                }}
                variant="primary"
                disabled = {isScanning || isSavingInCosmos || !selectedCompany}
              >
                Escanear
              </Button>
            </Col>
          </Row>

          {/* Resultado */}
          <Row>
            <Col xs={12} className="text-center">
              {isScanning ? "Escaneando..." : null}
              {result && <p className="mt-4 font-semibold text-green-600">Resultado: {result}</p>}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default App
