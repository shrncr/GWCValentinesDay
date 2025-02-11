'use client'
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { SketchPicker } from "react-color";
import { ReactSketchCanvas } from "react-sketch-canvas";
export default function ValentineMaker() {
  const [penColor, setPenColor] = useState("#000000");
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  const downloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const imageUrl = canvas.toDataURL("image/png");
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        try {
          const blob = await (await fetch(imageUrl)).blob();
          const file = new File([blob], "galentines-card.png", { type: "image/png" });
          await navigator.share({ files: [file], title: "Galentine's Day Card" });
          return;
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "galentines-card.png";
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.open(imageUrl, "_blank");
      } else {
        link.click();
      }
    }
  };

  const shareViaSMS = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const imageUrl = canvas.toDataURL("image/png");
      try {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], "galentines-card.png", { type: "image/png" });
        const shareData = {
          title: "Galentine's Day Card",
          text: "Here's a card I made for you! 💖",
          files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          alert("Your device does not support image sharing via text.");
        }
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-pink-100">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Galentine's Day Card Maker</h1>
      
      <div className="flex gap-4 mb-4 ">
        <button className="bg-red-400 text-white px-4 py-2 rounded-lg" onClick={downloadCard}>Download</button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded-lg" onClick={shareViaSMS}>Share via SMS</button>
      </div>
      
      <SketchPicker color={penColor} className="" onChangeComplete={(color) => setPenColor(color.hex)} />
      
      {/* Card Container */}
      <div
        ref={cardRef}
        id="card"
        className="relative w-80 h-60 flex flex-col items-center justify-center rounded-lg shadow-lg p-4 z-0"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Canvas for Sketching */}
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={4}
          strokeColor={penColor}
          className="absolute inset-0 w-full h-full z-20"
        />
      </div>
    </div>
  );
}
