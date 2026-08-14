"use client";

import { motion } from "framer-motion";

interface SplashProps {
  onLoadingComplete: () => void;
}

export default function SplashScreen({ onLoadingComplete }: SplashProps
  
) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      onAnimationComplete={onLoadingComplete}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animación del Logo: Soto System Digital Solution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black text-white tracking-widest uppercase">
          Soto System <span className="text-orange-500">Digital Solution</span>
        </h1>
        <p className="text-blue-400 text-sm tracking-[0.5em] mt-2 italic">APIO B2B ENGINE</p>
      </motion.div>

      {/* Barra de progreso estilizada */}
      <div className="w-64 h-1 bg-neutral-900 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>
      <p className="text-neutral-500 text-[10px] mt-4 uppercase">Inicializando arquitectura...</p>
    </motion.div>
  );
}