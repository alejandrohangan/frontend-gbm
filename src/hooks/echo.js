// src/hooks/useEcho.js
import { useState, useEffect } from "react";
import { createEchoInstance } from "../app/echo";

const useEcho = () => {
  const [echoInstance, setEchoInstance] = useState(null);

  useEffect(() => {
    // Crear la instancia de Echo
    const echo = createEchoInstance();
    setEchoInstance(echo);

    // Limpieza cuando el componente se desmonta
    return () => {
      if (echo) {
        echo.disconnect();
      }
    };
  }, []);

  return echoInstance;
};

export default useEcho;