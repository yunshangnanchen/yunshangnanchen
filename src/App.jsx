import React, { useState, useEffect, useRef } from 'react';
import { Github, Twitter, Mail, User, Briefcase, Users, MessageCircle, ExternalLink, Code, Heart, Trophy, Coffee, Camera, Gamepad2, GitBranch, Calendar, BookText, Music } from 'lucide-react';

// 自定义 Hook：用于检测元素是否进入视口（循环触发版）
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

    const placeholderImg = "https://images.unsplash.com/photo-1614850523296-e8c041de4398?q=80&w=500&auto=format&fit=crop";
    
    useEffect(() => {
        const faviconUrl = "https://avatars.githubusercontent.com/u/130617328?s=400&u=abb37f0e35d7272980f5fd47e8e455c0a8609286&v=4";
        
        // 清除现有的图标链接
        const existingIcons = document.querySelectorAll("link[rel*='icon']");
        existingIcons.forEach(icon => icon.remove());
        
        // 创建标准favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = faviconUrl;
        favicon.sizes = '32x32';
        
        // 创建Apple Touch Icon (iOS主屏幕图标)
        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.sizes = '180x180';
        appleIcon.href = faviconUrl;
        
        // 创建适用于Windows Tiles的元数据
        const msTileImage = document.createElement('meta');
        msTileImage.name = 'msapplication-TileImage';
        msTileImage.content = faviconUrl;
        
        const msTileColor = document.createElement('meta');
        msTileColor.name = 'msapplication-TileColor';
        msTileColor.content = '#38bdf8';
        
        // 创建主题颜色元数据
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#38bdf8';
        
        // 添加到head中
        const head = document.getElementsByTagName('head')[0];
        head.appendChild(favicon);
        head.appendChild(appleIcon);
        head.appendChild(msTileImage);
        head.appendChild(msTileColor);
        head.appendChild(themeColor);
    }, []);

  // 1. 粒子背景效果
  useEffect(() => {
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
    const particleCount = 500;
    
        for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 2 + Math.random() * 4, // 粒子大小范围
            speedY: 0.3 + Math.random() * 0.5, // 垂直移动速度
            amplitude: Math.random() * 1.2, // 横向摆动幅度
            phase: Math.random() * Math.PI * 2, // 初始相位
            opacity: 0.1 + Math.random() * 0.2 // 透明度范围
        });
        }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speedY;
        const currentX = p.x + Math.sin(p.phase + p.y * 0.01) * p.amplitude;
        
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
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
  }, []);

  // 2. 文字打字机效果
  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(textIndex));
        setTextIndex(textIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      // 延迟一点点开启渐变，增加仪式感
      const timer = setTimeout(() => setIsFinished(true), 200);
      return () => clearTimeout(timer);
    }
  }, [textIndex]);

  // 3. 像素风头像处理
  useEffect(() => {
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
            for (let p = 0; p < 10; p++) { 
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
    }, []);

    useEffect(() => {
        if (avatarColored) {
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
    }, [avatarColored]);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#080808] text-[#e5e5e5] font-mono selection:bg-sky-500/30 overflow-x-hidden scroll-smooth relative">
        <style>{`
            /* 渐变动画关键帧 - 用于文字的光泽扫过效果 */
            @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
            }

            /* 名字容器 - 用于包裹姓名元素，实现层叠效果 */
            .name-container {
            position: relative;
            display: inline-block;
            }

            /* 基础文字层 - 显示初始的白色文字 */
            .base-text {
            color: white;
            transition: opacity 1.5s ease; /* 透明度变化的平滑过渡 */
            }

            /* 渐变发光层 - 实现动态光泽效果的文字层 */
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
            animation: shimmer 4s linear infinite; /* 应用光泽扫过动画 */
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.4), 0 0 20px rgba(56, 189, 248, 0.2);
            opacity: 0;
            transition: opacity 2s ease; /* 透明度变化的平滑过渡 */
            pointer-events: none; /* 确保该层不会拦截鼠标事件 */
            }

            /* 当文字输入完成时，切换显示层 */
            .name-container.is-finished .base-text {
            opacity: 0; /* 隐藏基础文字层 */
            }
            .name-container.is-finished .shimmer-text {
            opacity: 1; /* 显示渐变发光层 */
            }

            /* 头像画布的基础样式 */
            .avatar-canvas {
            transition: filter 2.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-in;
            filter: grayscale(100%) brightness(0.8);
            opacity: 0.7;
            }
            /* 彩色头像状态 */
            .avatar-canvas.is-colored {
            filter: grayscale(0%) brightness(1.1);
            opacity: 1;
            }

            /* 淡入上升动画关键帧 - 用于页面元素的进入动画 */
            @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
            }
            /* 淡入上升动画类 */
            .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }

            /* 揭示容器 - 用于滚动触发动画的元素 */
            .reveal-container {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform, opacity; /* 提示浏览器这些属性将发生变化，优化性能 */
            }
            /* 活跃状态 - 元素进入视口时的样式 */
            .reveal-active {
            opacity: 1;
            transform: translateY(0);
            }

            /* 音乐条增长动画关键帧 - 用于音乐可视化效果 */
            @keyframes barGrow {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
            }
            /* 音乐条基础样式 */
            .music-bar {
            width: 3px;
            background-color: #38bdf8;
            animation: barGrow 1s ease-in-out infinite;
            }
            /* 为每个音乐条设置不同的动画延迟，创建交错效果 */
            .music-bar:nth-child(1) { animation-delay: 0.1s; }
            .music-bar:nth-child(2) { animation-delay: 0.3s; }
            .music-bar:nth-child(3) { animation-delay: 0.5s; }
            .music-bar:nth-child(4) { animation-delay: 0.2s; }
        `}</style>

      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="fixed bottom-6 left-6 z-50 group flex flex-col items-start">
        <div className="flex items-center gap-3 p-3 bg-[#0d0d0d]/90 backdrop-blur-md border border-[#222] shadow-[4px_4px_0px_rgba(56,189,248,0.1)] group-hover:opacity-0 transition-opacity">
          <Music size={20} className="text-sky-500 animate-pulse" />
          <div className="flex items-end gap-[2px] h-4">
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 opacity-0 scale-95 translate-y-10 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-left">
          <div className="relative p-1 bg-[#111] border border-[#222] shadow-[10px_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
                <iframe 
                frameBorder="no" 
                border="0" 
                marginWidth="0" 
                marginHeight="0" 
                width="330" 
                height="450" 
                src="//music.163.com/outchain/player?type=1&id=35229881&auto=1&height=430" 
                className="bg-[#111]"
                allow="autoplay; encrypted-media"
                ></iframe>
          </div>
        </div>
      </div>

      <section id="home" className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-stretch justify-center gap-12 lg:gap-20 md:pl-24">
          <div className="flex-shrink-0 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="relative p-1.5 border border-[#222] bg-[#0d0d0d] shadow-2xl overflow-hidden flex items-center justify-center group">
              <canvas ref={canvasRef} className={`avatar-canvas w-64 h-64 md:w-[320px] md:h-[320px] block ${avatarColored ? 'is-colored' : ''}`} style={{ imageRendering: 'pixelated' }} />
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,118,0.01))] bg-[length:100%_4px,4px_100%] opacity-20"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-1 text-center md:text-left space-y-8 md:space-y-0 min-h-[auto] md:min-h-[320px]">
            <div className="space-y-2">
              <div className="text-sky-500 text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 animate-fade-in-up" style={{ animationDelay: '400ms' }}>Kernel Status: Stable</div>
              <div className="text-slate-600 text-xs font-medium animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                user@hakadao:~$ <span className="text-white opacity-90 font-bold underline underline-offset-4 decoration-sky-500/20 tracking-widest">whoami</span>
              </div>
              
              {/* 名字区域，包含平滑过渡逻辑 */}
              <div className={`name-container text-4xl md:text-6xl font-black tracking-tighter leading-tight animate-fade-in-up ${isFinished ? 'is-finished' : ''}`} style={{ animationDelay: '600ms' }}>
                <span className="base-text">
                  {text}
                </span>
                <span className="shimmer-text">
                  {fullText}
                </span>
                <span className={`bg-sky-500 ml-1.5 inline-block w-6 h-1 md:h-1.5 align-baseline ${isFinished ? 'animate-pulse' : ''}`}></span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <div className="px-3 py-1 bg-sky-500/5 text-sky-400 border border-sky-500/20 text-[10px] font-bold tracking-widest uppercase italic flex items-center gap-2">
                  <span>[</span> Frontend Developer | Designer <span>]</span>
                </div>
              </div>
              <p className="text-lg md:text-2xl text-[#888] w-full leading-[1.3] font-extralight tracking-tight whitespace-nowrap animate-fade-in-up" style={{ animationDelay: '850ms' }}>
                "Now I am become a loser, the destroyer of myself."
              </p>
              <div className="inline-block py-1.5 px-4 bg-[#111] border-l-3 border-sky-500 text-[#555] text-sm md:text-base italic tracking-tight font-medium animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                // Looking for a new job and wanting to make more friends 👀
              </div>
            </div>

            <div className="space-y-6">
              <nav className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '1150ms' }}>
                <button onClick={() => scrollToSection('life')} className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 hover:bg-sky-500/5 transition-all group">
                  <Coffee size={16} className="text-[#333] group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Life</span>
                </button>
                <button onClick={() => scrollToSection('about')} className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 hover:bg-sky-500/5 transition-all group">
                  <User size={16} className="text-[#333] group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">About</span>
                </button>
                <button onClick={() => window.open('https://yunshangnanchen.github.io/yunshangnanchen-doc/#/', '_blank')} className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 hover:bg-sky-500/5 transition-all group">
                  <BookText size={16} className="text-[#333] group-hover:text-sky-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Document</span>
                </button>
                <button onClick={() => window.open('https://yunshangnanchen.github.io/Project-Files_yunshang/', '_blank')} className="flex items-center justify-center md:justify-start gap-2.5 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-sky-500/40 hover:bg-sky-500/5 transition-all group">
                  <img src="https://github.com/yunshangnanchen/Project-Files_yunshang/blob/main/public/logo.png?raw=true" alt="Project Files" className="w-4 h-4 object-contain grayscale group-hover:grayscale-0" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Projects</span>
                </button>
              </nav>
              <div className="flex justify-center md:justify-start space-x-10 text-[#1a1a1a] animate-fade-in-up" style={{ animationDelay: '1300ms' }}>
                <a href={githubProfile} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110"><Github size={22} /></a>
                <a href="mailto:example@mail.com" className="hover:text-white transition-all transform hover:scale-110"><Mail size={22} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="life" ref={lifeRef} className={`min-h-screen py-24 px-6 flex flex-col items-center justify-center relative z-10 reveal-container ${lifeVisible ? 'reveal-active' : ''}`}>
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-500 text-[10px] font-bold uppercase tracking-widest">Daily Routine</div>
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">The_Art_Of<br /><span className="text-sky-500">_Daily_Life</span></h2>
            <div className="space-y-6 text-[#888] text-sm md:text-base leading-relaxed">
              <p>在代码之外，我的生活是由无数个平凡但有趣的片段组成的。我热爱极简设计带来的纯粹感。</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0d0d0d] border border-[#222] group hover:border-sky-500/40 transition-colors">
                  <Camera size={18} className="text-sky-500 mb-3" />
                  <h4 className="text-white text-xs font-bold mb-1 uppercase tracking-tighter">Photography</h4>
                </div>
                <div className="p-4 bg-[#0d0d0d] border border-[#222] group hover:border-indigo-500/40 transition-colors">
                  <Gamepad2 size={18} className="text-indigo-500 mb-3" />
                  <h4 className="text-white text-xs font-bold mb-1 uppercase tracking-tighter">Gaming</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 order-1 md:order-2 aspect-square">
            {[...Array(7)].map((_, idx) => (
              <div key={idx} className={`${idx === 1 || idx === 2 ? 'col-span-2' : 'col-span-1'} bg-[#111] border border-[#222] overflow-hidden`}>
                <img src={placeholderImg} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" ref={aboutRef} className={`min-h-screen py-24 px-6 flex flex-col items-center justify-center bg-[#0d0d0d] relative z-10 reveal-container ${aboutVisible ? 'reveal-active' : ''}`}>
        <div className="max-w-4xl w-full space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-widest text-white uppercase italic underline decoration-sky-500 decoration-4 underline-offset-8">03. Profile</h2>
            <div className="h-[1px] flex-1 bg-[#222]"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 text-[#888] leading-relaxed">
            <div className="space-y-6">
              <p>你好！我是 <span className="text-sky-400 font-bold uppercase tracking-wider">NanChenJiaJia</span>，一名热衷于探索像素与代码之间界限的前端开发者。</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Three.js', 'Vite', 'Node', 'Canvas'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#080808] border border-[#222] text-[10px] hover:border-sky-500/50 transition-colors uppercase font-bold tracking-tighter">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-[#080808] border border-[#222] p-6 space-y-4">
              <h3 className="text-white text-[10px] font-bold flex items-center gap-2 uppercase tracking-[0.2em]"><GitBranch size={14} className="text-sky-500" /> GitHub_Contributions</h3>
              <div className="w-full overflow-hidden flex justify-center">
                <img src="https://ghchart.rshah.org/38bdf8/yunshangnanchen" alt="GitHub Contributions" className="w-full h-auto brightness-90 grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="works" ref={worksRef} className={`min-h-screen py-24 px-6 flex flex-col items-center justify-center relative z-10 reveal-container ${worksVisible ? 'reveal-active' : ''}`}>
        <div className="max-w-5xl w-full space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-widest text-white uppercase italic underline decoration-indigo-500 decoration-4 underline-offset-8">04. Works</h2>
            <div className="h-[1px] flex-1 bg-[#222]"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative bg-[#0d0d0d] border border-[#222] p-8 space-y-4 hover:border-sky-500/30 transition-all duration-500">
                <div className="absolute top-4 right-4 text-[#222] group-hover:text-sky-500 transition-colors cursor-pointer"><ExternalLink size={18} /></div>
                <div className="text-[10px] text-sky-500 font-bold uppercase tracking-[0.3em]">Project_ID: 0{i}</div>
                <h3 className="text-2xl font-black text-white group-hover:text-sky-400 transition-colors uppercase tracking-tighter italic">Personal_Experiment</h3>
                <p className="text-[#666] text-sm leading-relaxed">探索 WebGL 与 2D Canvas 的结合点，尝试将复古像素美学带入现代 Web 体验。</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        <footer className="py-20 border-t border-[#1a1a1a] bg-[#050505] relative z-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-10">
            <div className="flex gap-12 text-[#222]">
                <a href={githubProfile} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-all"><Github size={24} /></a>
                <a href="#" className="hover:text-sky-500 transition-all"><Twitter size={24} /></a>
                <a href="#" className="hover:text-sky-500 transition-all"><Mail size={24} /></a>
            </div>
            <div className="text-center space-y-2">
                <p className="text-[10px] text-[#444] uppercase tracking-[0.5em] font-black">NanChenJiaJia // {new Date().getFullYear()}</p>
            </div>
            </div>
        </footer>
        </div>
    );
};

export default App;