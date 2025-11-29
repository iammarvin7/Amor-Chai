"use client";
import { useEffect, useState, useRef } from "react";

const TiltImage = ({ src, alt, isActive }) => {
    const wrapperRef = useRef(null);
    const rafRef = useRef(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const box = wrapperRef.current;
        if (!box) return;

        let target = { rx: 0, ry: 0 };
        let state = { rx: 0, ry: 0 };

        const onMove = (e) => {
            const rect = box.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            target.ry = x * 15;
            target.rx = -y * 15;
        };

        const onLeave = () => {
            target = { rx: 0, ry: 0 };
        };

        const loop = () => {
            state.rx += (target.rx - state.rx) * 0.07;
            state.ry += (target.ry - state.ry) * 0.07;
            box.style.transform = `rotateX(${state.rx}deg) rotateY(${state.ry}deg)`;
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        box.addEventListener('mousemove', onMove, { passive: true });
        box.addEventListener('mouseleave', onLeave);
        
        return () => {
            cancelAnimationFrame(rafRef.current);
            box.removeEventListener('mousemove', onMove);
            box.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="absolute inset-0 h-full w-full rounded-xl overflow-hidden shadow-xl transition-opacity ease-in-out group"
            style={{
                opacity: isActive ? 1 : 0,
                transitionDuration: '2.8s',
                willChange: 'transform, opacity',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                draggable={false}
                loading="eager"
            />
            
            {/* Soapy bubble tooltip */}
            {isHovered && alt && (
                <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 rounded-full bg-white text-black text-sm font-bold whitespace-nowrap shadow-lg z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ pointerEvents: 'none' }}
                >
                    {alt}
                </div>
            )}
        </div>
    );
};


const CircularImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full flex justify-center" style={{ perspective: '1000px' }}>
        <div className="relative w-[15rem] sm:w-[18rem] md:w-[20rem] aspect-[4/5]">
            {images.map((img, index) => (
                <TiltImage
                    key={index}
                    src={img.src}
                    alt={img.alt}
                    isActive={index === currentIndex}
                />
            ))}
        </div>
    </div>
  );
};

export default CircularImageCarousel;
