import { useState, useRef, useEffect } from 'react';
import { ParticleBackground } from './ParticleBackground';

interface TarotAppProps {
  onStart?: () => void;
  onSpreadSelect?: (spread: 'one' | 'three' | 'seven') => void;
}

export const TarotApp: React.FC<TarotAppProps> = ({ onStart, onSpreadSelect }) => {
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'spread'>('intro');
  const [buttonPressed, setButtonPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Play magical sound
  const playMagicalSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    // Create multiple oscillators for rich magical sound
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.3);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05 + index * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 1.5);
    });
    
    // Add some shimmer with high frequency tones
    for (let i = 0; i < 5; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(2000 + Math.random() * 1000, now + i * 0.1);
      
      gainNode.gain.setValueAtTime(0, now + i * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.03, now + i * 0.1 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(now + i * 0.1);
      oscillator.stop(now + i * 0.1 + 0.5);
    }
  };

  const handleButtonClick = () => {
    setButtonPressed(true);
    playMagicalSound();
    
    // Trigger particle explosion from button
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Custom particle effect
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1000';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          size: number;
          opacity: number;
          color: string;
        }> = [];
        
        for (let i = 0; i < 50; i++) {
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15 - 5,
            size: Math.random() * 6 + 2,
            opacity: 1,
            color: ['#ffd700', '#9370db', '#ffffff'][Math.floor(Math.random() * 3)],
          });
        }
        
        let animationFrame = 0;
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3; // gravity
            p.opacity -= 0.02;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba');
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 20;
            ctx.fill();
          });
          
          animationFrame++;
          if (animationFrame < 50 && particles.some(p => p.opacity > 0)) {
            requestAnimationFrame(animate);
          } else {
            document.body.removeChild(canvas);
          }
        };
        
        animate();
      }
    }
    
    setTimeout(() => {
      setButtonPressed(false);
      setCurrentScreen('spread');
      onStart?.();
    }, 800);
  };

  const handleSpreadSelect = (spread: 'one' | 'three' | 'seven') => {
    playMagicalSound();
    onSpreadSelect?.(spread);
  };

  if (currentScreen === 'spread') {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        <ParticleBackground intensity="high" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-tarot-gold mb-2 text-center animate-pulse-slow">
            Выберите расклад
          </h1>
          <p className="text-purple-200 text-sm md:text-base mb-8 text-center opacity-80">
            Пусть карты откроют вам свою мудрость
          </p>
          
          {/* Crystal Ball */}
          <div className="relative mb-12 animate-float">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-400 via-purple-600 to-indigo-900 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30"></div>
              <div className="absolute top-4 left-6 w-8 h-8 bg-white rounded-full opacity-40 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-300 to-transparent opacity-20"></div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20 blur-xl animate-pulse"></div>
          </div>
          
          {/* Spread Options */}
          <div className="w-full space-y-4">
            {/* One Card */}
            <button
              onClick={() => handleSpreadSelect('one')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-indigo-900/50 
                         border border-tarot-gold/30 rounded-xl p-4 md:p-5 
                         hover:border-tarot-gold/60 hover:from-purple-800/60 hover:to-indigo-800/60
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tarot-gold/10 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-tarot-gold/20 to-tarot-gold/5 
                                 border border-tarot-gold/30 flex items-center justify-center">
                    <span className="text-2xl">🎴</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-tarot-gold font-semibold text-lg">Одна карта</h3>
                    <p className="text-purple-200 text-xs md:text-sm">Быстрый ответ на вопрос</p>
                  </div>
                </div>
                <span className="text-tarot-gold/60 group-hover:text-tarot-gold transition-colors">→</span>
              </div>
            </button>
            
            {/* Three Cards */}
            <button
              onClick={() => handleSpreadSelect('three')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-indigo-900/50 
                         border border-tarot-gold/30 rounded-xl p-4 md:p-5 
                         hover:border-tarot-gold/60 hover:from-purple-800/60 hover:to-indigo-800/60
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tarot-gold/10 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-tarot-gold/20 to-tarot-gold/5 
                                 border border-tarot-gold/30 flex items-center justify-center">
                    <span className="text-2xl">🔮</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-tarot-gold font-semibold text-lg">Три карты</h3>
                    <p className="text-purple-200 text-xs md:text-sm">Прошлое, настоящее, будущее</p>
                  </div>
                </div>
                <span className="text-tarot-gold/60 group-hover:text-tarot-gold transition-colors">→</span>
              </div>
            </button>
            
            {/* Seven Cards */}
            <button
              onClick={() => handleSpreadSelect('seven')}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-indigo-900/50 
                         border border-tarot-gold/30 rounded-xl p-4 md:p-5 
                         hover:border-tarot-gold/60 hover:from-purple-800/60 hover:to-indigo-800/60
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tarot-gold/10 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-tarot-gold/20 to-tarot-gold/5 
                                 border border-tarot-gold/30 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-tarot-gold font-semibold text-lg">Семь карт</h3>
                    <p className="text-purple-200 text-xs md:text-sm">Полный расклад на ситуацию</p>
                  </div>
                </div>
                <span className="text-tarot-gold/60 group-hover:text-tarot-gold transition-colors">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Intro Screen
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <ParticleBackground intensity="medium" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-tarot-gold mb-4 text-center animate-pulse-slow">
          Таро Прорицатель
        </h1>
        <p className="text-purple-200 text-sm md:text-base mb-12 text-center opacity-80">
          Откройте завесу тайны с помощью древних карт
        </p>
        
        {/* Magical Crystal Ball */}
        <div className="relative mb-12 animate-float">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-30 blur-2xl animate-pulse"></div>
          
          {/* Crystal ball container */}
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            {/* Main sphere */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-300 via-purple-500 to-indigo-900 
                          shadow-2xl relative overflow-hidden">
              
              {/* Inner glow */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-400/30 via-transparent to-indigo-300/30"></div>
              
              {/* Reflection highlights */}
              <div className="absolute top-6 left-8 w-12 h-12 bg-white rounded-full opacity-30 blur-md"></div>
              <div className="absolute top-8 left-10 w-6 h-6 bg-white rounded-full opacity-50 blur-sm"></div>
              
              {/* Mystical swirls */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/10 to-transparent 
                            animate-pulse"></div>
              
              {/* Sparkles inside */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-80 animate-ping"></div>
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-tarot-gold rounded-full opacity-60 animate-ping delay-300"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-200 rounded-full opacity-70 animate-ping delay-500"></div>
            </div>
            
            {/* Stand/base */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 
                          bg-gradient-to-b from-purple-800 to-purple-950 rounded-b-full 
                          border-t-2 border-tarot-gold/30 shadow-lg"></div>
          </div>
        </div>
        
        {/* Magic Button */}
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className={`group relative overflow-hidden px-8 py-4 md:px-12 md:py-5 
                     bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700
                     border-2 border-tarot-gold/50 rounded-full
                     hover:border-tarot-gold hover:from-purple-600 hover:via-indigo-600 hover:to-purple-600
                     transform transition-all duration-300 
                     ${buttonPressed ? 'scale-95' : 'hover:scale-105 active:scale-95'}
                     shadow-lg hover:shadow-xl hover:shadow-tarot-gold/30`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tarot-gold/20 to-transparent 
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-0 bg-tarot-gold/10 blur-md group-hover:bg-tarot-gold/20 transition-colors"></div>
          
          {/* Button content */}
          <span className="relative flex items-center space-x-3 text-tarot-gold font-semibold text-lg md:text-xl">
            <span className="text-2xl">🔮</span>
            <span>Узнать, что показывают карты</span>
            <span className="text-2xl">✨</span>
          </span>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-tarot-gold/60 
                        group-hover:border-tarot-gold transition-colors"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-tarot-gold/60 
                        group-hover:border-tarot-gold transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-tarot-gold/60 
                        group-hover:border-tarot-gold transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-tarot-gold/60 
                        group-hover:border-tarot-gold transition-colors"></div>
        </button>
        
        {/* Hint text */}
        <p className="mt-8 text-purple-300 text-xs text-center opacity-60">
          Прикоснитесь к магии и узнайте свою судьбу
        </p>
      </div>
    </div>
  );
};

export default TarotApp;
