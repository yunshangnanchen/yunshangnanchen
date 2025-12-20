import React, { useState, useEffect, useRef } from 'react';
import { Github, Twitter, Mail, User, Briefcase, Users, MessageCircle, ExternalLink, Code, Heart, Trophy, Coffee, Camera, Gamepad2, GitBranch, Calendar, BookText, Music, Box } from 'lucide-react';

// 自定义 Hook：用于检测元素是否进入视口
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [threshold]);

  return [elementRef, isVisible];
};

const App = () => {
    // 状态控制
    const [isBooting, setIsBooting] = useState(true);
    const [progress, setProgress] = useState(0);
    const [bootStatus, setBootStatus] = useState("Initializing System...");
    const [text, setText] = useState('');
    const fullText = "NanChenJiaJia"; 
    const [textIndex, setTextIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [avatarColored, setAvatarColored] = useState(false);
    
    const canvasRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const avatarUrl = "https://avatars.githubusercontent.com/u/130617328?v=4";
    const githubProfile = "https://github.com/yunshangnanchen";
    
    const [lifeRef, lifeVisible] = useScrollReveal(0.1);
    const [aboutRef, aboutVisible] = useScrollReveal(0.1);
    const [worksRef, worksVisible] = useScrollReveal(0.1);

    const lifeImages = [
      "public/illust_75126666_20250513_134648.jpg",
      "public/illust_77734148_20250513_134640.jpg",
      "public/illust_82937235_20250513_134631.jpg",
      "public/illust_86588827_20250513_134618.jpg",
      "public/illust_114478204_20250513_134535.png",
      "public/illust_99302008_20250513_134551.jpg",
      "public/illust_121154966_20250513_113005.png"
    ];

    // 1. 进度条加载逻辑
    useEffect(() => {
      const statusSteps = [
        "Loading Kernel...",
        "Mounting File Systems...",
        "Initializing Pixel Engine...",
        "Fetching Assets...",
        "Ready."
      ];
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsBooting(false), 500);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 15) + 2;
          const statusIdx = Math.min(Math.floor((next / 100) * statusSteps.length), statusSteps.length - 1);
          setBootStatus(statusSteps[statusIdx]);
          return Math.min(next, 100);
        });
      }, 150);

      return () => clearInterval(interval);
    }, []);
    
    // 设置 Favicon
    useEffect(() => {
        const faviconUrl = "https://avatars.githubusercontent.com/u/130617328?v=4";
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
    }, []);

  // 粒子背景
  useEffect(() => {
    if (isBooting) return;
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    const particles = [];
    for (let i = 0; i < 1000; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 1 + Math.random() * 4,
            speedY: 0.2 + Math.random() * 0.4,
            amplitude: Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
            opacity: 0.05 + Math.random() * 0.15
        });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speedY;
        const currentX = p.x + Math.sin(p.phase + p.y * 0.01) * p.amplitude;
        if (p.y < -10) p.y = canvas.height + 10;
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fillRect(currentX, p.y, p.size, p.size);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBooting]);

  // 文字打字机
  useEffect(() => {
    if (isBooting) return;
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(textIndex));
        setTextIndex(textIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setIsFinished(true), 200);
    }
  }, [textIndex, isBooting]);

  // 像素头像
  useEffect(() => {
    if (isBooting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = avatarUrl;
    img.onload = () => {
        const size = 320; 
        const pixelSize = 8; 
        canvas.width = size;
        canvas.height = size;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = size / pixelSize;
        tempCanvas.height = size / pixelSize;
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
        let currentPixel = 0;
        const totalPixels = tempCanvas.width * tempCanvas.height;
        const drawBlackWhite = () => {
            if (currentPixel < totalPixels) {
                for (let p = 0; p < 15; p++) {
                    if (currentPixel < totalPixels) {
                        const x = currentPixel % tempCanvas.width;
                        const y = Math.floor(currentPixel / tempCanvas.width);
                        const i = currentPixel * 4;
                        const gray = (imageData[i] * 0.3 + imageData[i+1] * 0.59 + imageData[i+2] * 0.11);
                        ctx.fillStyle = `rgba(${gray},${gray},${gray},${imageData[i+3]/255})`;
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                        currentPixel++;
                    }
                }
                requestAnimationFrame(drawBlackWhite);
            } else {
                setAvatarColored(true);
            }
        };
        drawBlackWhite();
    };
  }, [isBooting]);

    useEffect(() => {
        if (avatarColored && !isBooting) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = avatarUrl;
            img.onload = () => {
                const size = 320;
                const pixelSize = 8;
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = size / pixelSize;
                tempCanvas.height = size / pixelSize;
                tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
                const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
                for (let i = 0; i < imageData.length; i += 4) {
                    const pixelIdx = i / 4;
                    const x = pixelIdx % tempCanvas.width;
                    const y = Math.floor(pixelIdx / tempCanvas.width);
                    ctx.fillStyle = `rgba(${imageData[i]},${imageData[i+1]},${imageData[i+2]},${imageData[i+3]/255})`;
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            };
        }
    }, [avatarColored, isBooting]);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#080808] text-[#e5e5e5] font-mono selection:bg-sky-500/30 overflow-x-hidden scroll-smooth relative min-h-screen">
        
        {/* 进度条启动遮罩层 */}
        {isBooting && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 font-mono">
            <div className="w-full max-w-md space-y-4 text-center">
              <div className="text-sky-500 text-[10px] tracking-[0.3em] uppercase animate-pulse">{bootStatus}</div>
              <div className="relative h-1 w-full bg-[#111] overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-sky-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-[#333] text-[9px] uppercase tracking-widest">{progress}% COMPLETION</div>
            </div>
          </div>
        )}

        <style>{`
            @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
            }
            .name-container {
            position: relative;
            display: inline-block;
            }
            .base-text {
            color: white;
            transition: opacity 1.5s ease;
            }
            .shimmer-text {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #fff 0%, #38bdf8 25%, #818cf8 50%, #38bdf8 75%, #fff 100%);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            animation: shimmer 4s linear infinite;
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.4), 0 0 20px rgba(56, 189, 248, 0.2);
            opacity: 0;
            transition: opacity 2s ease;
            pointer-events: none;
            }
            .name-container.is-finished .base-text {
            opacity: 0;
            }
            .name-container.is-finished .shimmer-text {
            opacity: 1;
            }
            .avatar-canvas {
            transition: filter 2.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-in;
            filter: grayscale(100%) brightness(0.8);
            opacity: 0.7;
            }
            .avatar-canvas.is-colored {
            filter: grayscale(0%) brightness(1.1);
            opacity: 1;
            }
            @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }
            .reveal-container {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform, opacity;
            }
            .reveal-active {
            opacity: 1;
            transform: translateY(0);
            }
            @keyframes barGrow {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
            }
            .music-bar {
            width: 3px;
            background-color: #38bdf8;
            animation: barGrow 1s ease-in-out infinite;
            }
            .music-bar:nth-child(1) { animation-delay: 0.1s; }
            .music-bar:nth-child(2) { animation-delay: 0.3s; }
            .music-bar:nth-child(3) { animation-delay: 0.5s; }
            .music-bar:nth-child(4) { animation-delay: 0.2s; }
        `}</style>

      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* 音乐播放器 */}
      <div className="fixed bottom-6 left-6 z-50 group flex flex-col items-start">
        <div className="flex items-center gap-3 p-3 bg-[#0d0d0d]/90 backdrop-blur-md border border-[#222] group-hover:opacity-0 transition-opacity">
          <Music size={20} className="text-sky-500 animate-pulse" />
          <div className="flex items-end gap-[2px] h-4">
            {[1,2,3,4].map(i => <div key={i} className="music-bar" style={{animationDelay: `${i*0.2}s`}}></div>)}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 opacity-0 scale-95 translate-y-10 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 origin-bottom-left">
          <div className="relative p-1 bg-[#111] border border-[#222] shadow-2xl">
            <iframe frameBorder="no" border="0" width="330" height="450" src="//music.163.com/outchain/player?type=1&id=35229881&auto=1&height=430"></iframe>
          </div>
        </div>
      </div>

      <section id="home" className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-stretch justify-center gap-12 lg:gap-20 md:pl-24">
          <div className="flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative p-1.5 border border-[#222] bg-[#0d0d0d] shadow-2xl overflow-hidden group">
              <canvas ref={canvasRef} className={`avatar-canvas w-64 h-64 md:w-[320px] md:h-[320px] block ${avatarColored ? 'is-colored' : ''}`} style={{ imageRendering: 'pixelated' }} />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-1 text-center md:text-left space-y-8 min-h-[320px]">
            <div className="space-y-2">
              <div className="text-sky-500 text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 animate-fade-in-up">Kernel Status: Stable</div>
              <div className="text-slate-600 text-xs font-medium animate-fade-in-up">
                user@hakadao:~$ <span className="text-white opacity-90 font-bold underline decoration-sky-500/20">whoami</span>
              </div>
              <div className={`name-container text-4xl md:text-6xl font-black tracking-tighter animate-fade-in-up ${isFinished ? 'is-finished' : ''}`}>
                <span className="base-text">{text}</span>
                <span className="shimmer-text">{fullText}</span>
                <span className={`bg-sky-500 ml-1.5 inline-block w-6 h-1 md:h-1.5 ${isFinished ? 'animate-pulse' : ''}`}></span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5 animate-fade-in-up">
                <div className="px-3 py-1 bg-sky-500/5 text-sky-400 border border-sky-500/20 text-[10px] font-bold tracking-widest uppercase italic">[ Frontend Developer | Designer ]</div>
              </div>
              <p className="text-lg md:text-xl text-[#888] w-full leading-[1.3] font-extralight animate-fade-in-up">"Drawing the sword, I choose to break the dream I once lived in."</p>
              <div className="inline-block py-1.5 px-4 bg-[#111] border-l-3 border-sky-500 text-[#555] text-sm animate-fade-in-up">// My dream is to become an independent illustrator who can write code.</div>
            </div>

            <div className="space-y-6">
              <nav className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 animate-fade-in-up">
                <button onClick={() => scrollToSection('life')} className="flex items-center justify-center gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 transition-all group">
                  <Coffee size={16} className="group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Life</span>
                </button>
                <button onClick={() => scrollToSection('about')} className="flex items-center justify-center gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 transition-all group">
                  <User size={16} className="group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">About</span>
                </button>
                <button onClick={() => scrollToSection('works')} className="flex items-center justify-center gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 transition-all group">
                  <Box size={16} className="group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Works</span>
                </button>
                <button onClick={() => window.open('https://yunshangnanchen.github.io/Project-Files_yunshang/', '_blank')} className="flex items-center justify-center gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 transition-all group">
                  <ExternalLink size={16} className="group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Link</span>
                </button>
              </nav>
              <div className="flex justify-center md:justify-start space-x-10 text-[#1a1a1a] animate-fade-in-up">
                <a href={githubProfile} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all"><Github size={22} /></a>
                <a href="mailto:DYBAGE@out.com" className="hover:text-white transition-all"><Mail size={22} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="life" ref={lifeRef} className={`min-h-screen py-24 px-6 flex flex-col items-center justify-center relative z-10 reveal-container ${lifeVisible ? 'reveal-active' : ''}`}>
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-500 text-[10px] font-bold uppercase cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open('https://www.pixiv.net/users/2131660', '_blank')}>作者：Pixiv-荻pote</div>
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">The_Art_Of<br /><span className="text-sky-500">_Daily_Life</span></h2>
            <div className="space-y-6 text-[#888] text-sm leading-relaxed">
              <p>我的梦想是成为一个会写代码的独立插画师。生活之外我时常沉迷幻想，幻想我经历过的每一件小事。尽管这让我很烦恼但我选择将幻想串联起来编织属于我自己的 Dream World.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0d0d0d] border border-[#222] group hover:border-sky-500/40">
                  <Camera size={18} className="text-sky-500 mb-3" />
                  <h4 className="text-white text-xs font-bold mb-1 uppercase">Photography</h4>
                </div>
                <div className="p-4 bg-[#0d0d0d] border border-[#222] group hover:border-indigo-500/40">
                  <Gamepad2 size={18} className="text-indigo-500 mb-3" />
                  <h4 className="text-white text-xs font-bold mb-1 uppercase">Gaming</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 order-1 md:order-2 aspect-square">
            {lifeImages.map((src, idx) => (
              <div key={idx} className={`${idx === 1 || idx === 2 ? 'col-span-2' : 'col-span-1'} bg-[#111] border border-[#222] overflow-hidden group relative`}>
                <img src={src} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" ref={aboutRef} className={`min-h-screen py-24 px-6 flex flex-col items-center justify-center bg-[#0d0d0d] relative z-10 reveal-container ${aboutVisible ? 'reveal-active' : ''}`}>
        <div className="max-w-4xl w-full space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-white uppercase italic underline decoration-sky-500 decoration-4 underline-offset-8">03. Profile</h2>
            <div className="h-[1px] flex-1 bg-[#222]"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 text-[#888] leading-relaxed">
            <div className="space-y-6">
              <p>你好！我是 <span className="text-sky-400 font-bold uppercase">NanChenJiaJia</span>，一名热衷于探索像素与代码之间界限的前端开发者。</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Three.js', 'Vite', 'Node', 'Canvas'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#080808] border border-[#222] text-[10px] hover:border-sky-500/50 transition-colors uppercase font-bold">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#080808] border border-[#222] p-6 space-y-4">
              <h3 className="text-white text-[10px] font-bold flex items-center gap-2 uppercase tracking-[0.2em]"><GitBranch size={14} className="text-sky-500" /> GitHub_Contributions</h3>
              <img src="https://ghchart.rshah.org/38bdf8/yunshangnanchen" alt="GitHub Contributions" className="w-full h-auto brightness-90 grayscale opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* 第四部分：Works */}
      <section id="works" ref={worksRef} className={`min-h-screen py-24 px-6 flex flex-col items-center justify-center relative z-10 reveal-container ${worksVisible ? 'reveal-active' : ''}`}>
        <div className="max-w-6xl w-full space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
              04.<br /><span className="text-sky-500">Works</span>
            </h2>
            <p className="text-[#555] text-xs font-bold uppercase tracking-widest max-w-xs text-right md:text-left">
              // Selected personal experiments and digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { id: "01", title: "Project_Alpha", desc: "探索 WebGL 与 2D Canvas 的结合点，尝试将复古像素美学带入现代 Web 体验。", link: "https://example.com/project-alpha" },
              { id: "02", title: "Project_Beta", desc: "探索 WebGL 与 2D Canvas 的结合点，尝试将复古像素美学带入现代 Web 体验。", link: "https://example.com/project-beta" },
              { id: "03", title: "Project_Gamma", desc: "探索 WebGL 与 2D Canvas 的结合点，尝试将复古像素美学带入现代 Web 体验。", link: "https://example.com/project-gamma" },
              { id: "04", title: "Project_Delta", desc: "探索 WebGL 与 2D Canvas 的结合点，尝试将复古像素美学带入现代 Web 体验。", link: "https://example.com/project-delta" }
            ].map(work => (
              <div 
                key={work.id} 
                className="work-card group bg-[#0d0d0d] border border-[#1a1a1a] hover:border-sky-500/40 p-8 flex flex-col justify-between space-y-8 relative overflow-hidden cursor-pointer"
                onClick={() => window.open(work.link, '_blank')}
              >
                <div className="absolute top-0 right-0 p-4 text-[40px] font-black text-white opacity-[0.02] pointer-events-none uppercase">{work.id}</div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-sky-500"></div>
                    <span className="text-sky-500 text-[10px] font-bold tracking-widest uppercase italic">Project_ID: {work.id}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-sky-400 transition-colors uppercase tracking-tight">{work.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed font-light">{work.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                    <span className="text-[10px] text-[#444] font-bold uppercase tracking-widest group-hover:text-sky-500 transition-colors">Personal_Experiment</span>
                    <ExternalLink size={14} className="text-[#333] group-hover:text-sky-500 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-[#1a1a1a] bg-[#050505] relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-10">
          <div className="flex justify-center gap-12 text-[#222]">
            <a href={githubProfile} target="_blank" className="hover:text-sky-500 transition-all"><Github size={24} /></a>
            <a href="#" className="hover:text-sky-500 transition-all"><Twitter size={24} /></a>
            <a href="mailto:DYBAGE@out.com" className="hover:text-sky-500 transition-all"><Mail size={24} /></a>
          </div>
          <p className="text-[10px] text-[#444] uppercase tracking-[0.5em] font-black">NanChenJiaJia // {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
    );
};

export default App;