import React, { useState, useRef, useEffect } from "react";

const FloatingLogo = () => {
  const logoRef = useRef(null);

  // Load saved position or default
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("logoPosition");
    return saved ? JSON.parse(saved) : { x: 100, y: 100 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem("logoPosition", JSON.stringify(position));
  }, [position]);

  // Mouse events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events (mobile support)
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];

    setPosition({
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Attach global listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  });

  return (
    <div
      ref={logoRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        opacity: 0.9,
        transition: isDragging ? "none" : "opacity 0.3s ease",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "50%",
        padding: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        border: "0.5px solid rgba(231, 76, 60, 0.3)",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        if (!isDragging) e.currentTarget.style.opacity = "0.7";
      }}
    >
      <img
        src="/UrbanLogo_Main.jpeg"
        alt="Logo"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default FloatingLogo;