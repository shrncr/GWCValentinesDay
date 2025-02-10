'use client'
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { SketchPicker } from "react-color";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function ValentineMaker() {
  const [message, setMessage] = useState("Happy Galentine's Day!");
  const [bgColor, setBgColor] = useState("#fbcfe8");
  const [penColor, setPenColor] = useState("#000000");
  const [image, setImage] = useState(null);
  const [emoji, setEmoji] = useState("❤️");
  const [emojiPositions, setEmojiPositions] = useState([]);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  const downloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "galentines-card.png";
      link.click();
    }
  };

  const shareViaSMS = async () => {
    const smsMessage = encodeURIComponent("Check out this Galentine's Day card I made!");
    const smsUrl = `sms:?&body=${smsMessage}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Galentine's Day Card",
          text: smsMessage,
        });
      } catch (error) {
        console.error("Error sharing via Web API:", error);
      }
    } else {
      window.location.href = smsUrl;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setEmojiPositions([...emojiPositions, { x: e.clientX - rect.left, y: e.clientY - rect.top, emoji }]);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-pink-100">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Galentine's Day Card Maker</h1>
      <div className="flex gap-4 mb-4">
        <input type="text" className="p-2 border rounded-md" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 border rounded-md" />
        <button className="bg-red-400 text-white px-4 py-2 rounded-lg" onClick={downloadCard}>Download</button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded-lg" onClick={shareViaSMS}>Share via SMS</button>
      </div>
      <SketchPicker color={penColor} onChangeComplete={(color) => setPenColor(color.hex)} />
      <select className="mt-2 p-2 border rounded-md" value={emoji} onChange={(e) => setEmoji(e.target.value)}>
        <option value="❤️">❤️</option>
        <option value="🌸">🌸</option>
        <option value="💖">💖</option>
        <option value="✨">✨</option>
      </select>
      <div ref={cardRef} id="card" onClick={handleEmojiClick} className="relative w-80 h-60 flex flex-col items-center justify-center rounded-lg shadow-lg p-4" style={{ backgroundColor: bgColor }}>
        {image && <img src={image} alt="Uploaded" className="absolute w-full h-full object-cover rounded-lg" />}
        <p className="text-lg text-center font-semibold text-red-700 z-10">{message}</p>
        {emojiPositions.map((pos, index) => (
          <span key={index} className="absolute text-2xl" style={{ left: pos.x, top: pos.y }}>{pos.emoji}</span>
        ))}
        <ReactSketchCanvas ref={canvasRef} strokeWidth={4} strokeColor={penColor} className="absolute inset-0 w-full h-full z-20" />
      </div>
    </div>
  );
}
