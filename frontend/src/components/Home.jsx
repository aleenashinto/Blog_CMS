import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const canvasRef = useRef(null);

  // ─── CUSTOM CURSOR ───
  useEffect(() => {
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur) {
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
      }
    };

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      requestAnimationFrame(animRing);
    };

    document.addEventListener('mousemove', onMouseMove);
    animRing();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button');
    const onEnter = () => {
      if (cur) { cur.style.width = '20px';
        cur.style.height = '20px';
        cur.style.background = '#8b5cf6'; }
      if (ring) { ring.style.width = '60px';
        ring.style.height = '60px'; }
    };
    const onLeave = () => {
      if (cur) { cur.style.width = '8px';
        cur.style.height = '8px';
        cur.style.background = '#00e5c8'; }
      if (ring) { ring.style.width = '36px';
        ring.style.height = '36px'; }
    };

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // ─── SCROLL REVEAL ───
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);

  // ─── TECH TABS ───
  useEffect(() => {
    const techData = {
      frontend: {
        icon: 'fas fa-palette',
        title: 'Frontend Development',
        subtitle: 'UI, UX & Web Interfaces',
        pills: ['React.js', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GSAP', 'HTML5 / CSS3', 'Figma'],
        desc: 'We craft fast, accessible, and visually stunning interfaces using modern JavaScript frameworks. Every component is engineered for performance, SEO, and long-term maintainability.'
      },
      backend: {
        icon: 'fas fa-server',
        title: 'Backend Engineering',
        subtitle: 'APIs, Logic & Databases',
        pills: ['Python', 'Node.js', 'Django', 'FastAPI', 'GraphQL', 'REST APIs', 'Java / Spring', 'PHP / Laravel', '.NET Core', 'Redis'],
        desc: 'Robust server-side architecture handling millions of requests — from microservices to monoliths, we design systems that are secure, fast, and resilient under load.'
      },
      ai: {
        icon: 'fas fa-brain',
        title: 'AI & Machine Learning',
        subtitle: 'Models, Pipelines & LLMs',
        pills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI GPT-4', 'LangChain', 'Hugging Face', 'YOLO', 'Keras', 'MLflow', 'Vertex AI'],
        desc: 'From custom model training to LLM fine-tuning and production ML pipelines — we handle the full lifecycle of AI development with a focus on real-world accuracy and scale.'
      },
      mobile: {
        icon: 'fas fa-mobile',
        title: 'Mobile Development',
        subtitle: 'iOS, Android & Cross-Platform',
        pills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Firebase', 'SQLite', 'Push Notifications', 'App Store Optimization', 'Mobile Analytics'],
        desc: 'High-performance native and cross-platform mobile apps with polished UX, offline support, and deep device integrations — built to AppStore and PlayStore standards.'
      },
      cloud: {
        icon: 'fas fa-cloud',
        title: 'Cloud & Infrastructure',
        subtitle: 'DevOps, CI/CD & Orchestration',
        pills: ['AWS', 'Google Cloud', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'Nginx', 'Cloudflare', 'Prometheus'],
        desc: 'We architect cloud-native infrastructure designed for scale, reliability, and cost-efficiency — with automated deployments, monitoring, and disaster recovery built in from day one.'
      },
      data: {
        icon: 'fas fa-database',
        title: 'Data & Analytics',
        subtitle: 'Storage, Processing & Insights',
        pills: ['PostgreSQL', 'MongoDB', 'Elasticsearch', 'Apache Kafka', 'Spark', 'Airflow', 'BigQuery', 'Tableau', 'dbt', 'Snowflake'],
        desc: 'End-to-end data engineering — from ingestion pipelines and warehousing to BI dashboards and real-time analytics — turning raw data into strategic business intelligence.'
      }
    };

    const tabs = document.querySelectorAll('.tech-tab');

    function setPanel(key) {
      const d = techData[key];
      const panelIcon = document.getElementById('panel-icon');
      const panelTitle = document.getElementById('panel-title');
      const panelSubtitle = document.getElementById('panel-subtitle');
      const panelDesc = document.getElementById('panel-desc');
      const panelPills = document.getElementById('panel-pills');

      if (panelIcon) panelIcon.innerHTML = '<i className="' + d.icon + '"></i>';
      if (panelTitle) panelTitle.textContent = d.title;
      if (panelSubtitle) panelSubtitle.textContent = d.subtitle;
      if (panelDesc) panelDesc.textContent = d.desc;
      if (panelPills) panelPills.innerHTML = d.pills.map(p => `<span class="tech-pill">${p}</span>`).join('');
    }

    setPanel('frontend');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        setPanel(tab.dataset.panel);
      });
    });

    return () => {
      tabs.forEach(tab => {
        tab.removeEventListener('click', () => {});
      });
    };
  }, []);

  // ─── ABOUT CANVAS (Neural Network) ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animationId = null;

    function initCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width || 400;
      canvas.height = rect.height || 300;
      nodes = [];
      const count = 40;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2.5 + 1
        });
      }
    }

    function drawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,229,200,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        // Draw nodes
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,200,0.6)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(drawCanvas);
    }

    initCanvas();
    drawCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ─── COUNTER ANIMATION ───
  useEffect(() => {
    function animateCounter(el, target, suffix = '') {
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.innerHTML = Math.floor(start) + '<span>' + suffix + '</span>';
        if (start >= target) clearInterval(timer);
      }, 16);
    }

    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const nums = e.target.querySelectorAll('.stat-num');
          const data = [{ v: 120, s: '+' }, { v: 98, s: '%' }, { v: 6, s: '+' }, { v: 30, s: '+' }];
          nums.forEach((el, i) => animateCounter(el, data[i].v, data[i].s));
          statsObs.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) statsObs.observe(statsEl);

    return () => statsObs.disconnect();
  }, []);

  return (
    <>
      {/* ─── STYLES ─── */}
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        :root{
          --ink:#0a0a0f;
          --ink-soft:#12121a;
          --surface:#16161e;
          --surface-2:#1e1e28;
          --border:rgba(255,255,255,0.07);
          --border-bright:rgba(255,255,255,0.15);
          --text-primary:#f0eff8;
          --text-secondary:#8a8aa0;
          --text-muted:#4a4a60;
          --cyan:#00e5c8;
          --cyan-dim:rgba(0,229,200,0.12);
          --cyan-glow:rgba(0,229,200,0.3);
          --violet:#8b5cf6;
          --violet-dim:rgba(139,92,246,0.12);
          --coral:#ff6b6b;
          --amber:#f59e0b;
          --white:#ffffff;
          --font-display:'Syne',sans-serif;
          --font-body:'DM Sans',sans-serif;
          --nav-h:72px;
        }
        html{scroll-behavior:smooth;}
        body{
          background:var(--ink);
          color:var(--text-primary);
          font-family:var(--font-body);
          font-size:16px;
          line-height:1.7;
          overflow-x:hidden;
        }
        .cursor{
          width:8px;height:8px;
          background:var(--cyan);
          border-radius:50%;
          position:fixed;
          top:0;left:0;
          pointer-events:none;
          z-index:9999;
          transform:translate(-50%,-50%);
          transition:width 0.3s,height 0.3s,background 0.3s;
          mix-blend-mode:screen;
        }
        .cursor-ring{
          width:36px;height:36px;
          border:1px solid rgba(0,229,200,0.4);
          border-radius:50%;
          position:fixed;
          top:0;left:0;
          pointer-events:none;
          z-index:9998;
          transform:translate(-50%,-50%);
          transition:transform 0.12s linear,width 0.3s,height 0.3s;
        }
        body:hover .cursor{opacity:1;}
        body::before{
          content:'';
          position:fixed;
          inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:0.022;
          pointer-events:none;
          z-index:0;
        }
        .grid-lines{
          position:fixed;
          inset:0;
          pointer-events:none;
          z-index:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:80px 80px;
        }
        nav{
          position:fixed;
          top:0;left:0;right:0;
          height:var(--nav-h);
          z-index:1000;
          display:flex;
          align-items:center;
          padding:0 60px;
          background:rgba(10,10,15,0.65);
          backdrop-filter:blur(20px) saturate(1.5);
          border-bottom:1px solid var(--border);
          transition:background 0.3s;
        }
        .nav-logo{
          font-family:var(--font-display);
          font-weight:800;
          font-size:1.3rem;
          color:var(--white);
          text-decoration:none;
          display:flex;
          align-items:center;
          gap:10px;
          letter-spacing:-0.02em;
        }
        .logo-mark{
          width:32px;height:32px;
          background:linear-gradient(135deg,var(--cyan),var(--violet));
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.75rem;
          font-weight:900;
          color:black;
        }
        .nav-links{
          display:flex;
          gap:36px;
          margin:0 auto;
          list-style:none;
        }
        .nav-links a{
          color:var(--text-secondary);
          text-decoration:none;
          font-size:0.875rem;
          font-weight:500;
          letter-spacing:0.02em;
          transition:color 0.2s;
          position:relative;
        }
        .nav-links a::after{
          content:'';
          position:absolute;
          bottom:-4px;left:0;
          width:0;height:1px;
          background:var(--cyan);
          transition:width 0.3s;
        }
        .nav-links a:hover{color:var(--white);}
        .nav-links a:hover::after{width:100%;}
        .nav-cta{
          background:transparent;
          border:1px solid var(--border-bright);
          color:var(--white);
          padding:9px 24px;
          border-radius:6px;
          font-family:var(--font-body);
          font-weight:500;
          font-size:0.875rem;
          cursor:pointer;
          text-decoration:none;
          transition:background 0.2s,border-color 0.2s,box-shadow 0.2s;
        }
        .nav-cta:hover{
          background:var(--cyan-dim);
          border-color:var(--cyan);
          box-shadow:0 0 20px var(--cyan-glow);
        }
        .hero{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding:calc(var(--nav-h) + 60px) 40px 80px;
          position:relative;
          overflow:hidden;
        }
        .hero-orb{
          position:absolute;
          border-radius:50%;
          filter:blur(120px);
          pointer-events:none;
        }
        .orb-1{
          width:700px;height:700px;
          background:radial-gradient(circle,rgba(0,229,200,0.12),transparent 70%);
          top:-200px;left:-200px;
          animation:drift1 18s ease-in-out infinite alternate;
        }
        .orb-2{
          width:600px;height:600px;
          background:radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%);
          bottom:-100px;right:-150px;
          animation:drift2 22s ease-in-out infinite alternate;
        }
        .orb-3{
          width:400px;height:400px;
          background:radial-gradient(circle,rgba(255,107,107,0.07),transparent 70%);
          top:40%;left:50%;
          transform:translate(-50%,-50%);
          animation:pulse-orb 8s ease-in-out infinite;
        }
        @keyframes drift1{from{transform:translate(0,0);}to{transform:translate(80px,60px);}}
        @keyframes drift2{from{transform:translate(0,0);}to{transform:translate(-60px,-80px);}}
        @keyframes pulse-orb{0%,100%{opacity:0.4;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.8;transform:translate(-50%,-50%) scale(1.15);}}
        .hero-tag{
          display:inline-flex;
          align-items:center;
          gap:8px;
          background:var(--surface);
          border:1px solid var(--border-bright);
          border-radius:100px;
          padding:6px 16px;
          font-size:0.78rem;
          color:var(--text-secondary);
          letter-spacing:0.06em;
          text-transform:uppercase;
          margin-bottom:36px;
          animation:fade-in-up 0.8s ease both;
        }
        .hero-tag-dot{
          width:6px;height:6px;
          background:var(--cyan);
          border-radius:50%;
          animation:blink 1.5s ease-in-out infinite;
        }
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .hero-title{
          font-family:var(--font-display);
          font-size:clamp(3rem,7vw,6rem);
          font-weight:800;
          line-height:1.05;
          letter-spacing:-0.04em;
          max-width:960px;
          margin:0 auto 28px;
          animation:fade-in-up 0.8s 0.1s ease both;
        }
        .hero-title .line-1{color:var(--white);}
        .hero-title .line-2{
          background:linear-gradient(90deg,var(--cyan) 0%,var(--violet) 50%,var(--coral) 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          background-size:200% auto;
          animation:gradient-flow 4s linear infinite,fade-in-up 0.8s 0.1s ease both;
        }
        @keyframes gradient-flow{0%{background-position:0% center;}100%{background-position:200% center;}}
        .hero-sub{
          max-width:620px;
          margin:0 auto 48px;
          color:var(--text-secondary);
          font-size:1.1rem;
          font-weight:300;
          line-height:1.8;
          animation:fade-in-up 0.8s 0.2s ease both;
        }
        .hero-actions{
          display:flex;
          gap:16px;
          justify-content:center;
          flex-wrap:wrap;
          animation:fade-in-up 0.8s 0.3s ease both;
        }
        .btn-primary{
          background:var(--cyan);
          color:black;
          font-family:var(--font-body);
          font-weight:600;
          font-size:0.9rem;
          padding:14px 32px;
          border:none;
          border-radius:8px;
          cursor:pointer;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
          gap:8px;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .btn-primary:hover{
          transform:translateY(-2px);
          box-shadow:0 12px 40px rgba(0,229,200,0.35);
        }
        .btn-secondary{
          background:transparent;
          color:var(--white);
          font-family:var(--font-body);
          font-weight:500;
          font-size:0.9rem;
          padding:14px 32px;
          border:1px solid var(--border-bright);
          border-radius:8px;
          cursor:pointer;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
          gap:8px;
          transition:background 0.2s,border-color 0.2s;
        }
        .btn-secondary:hover{
          background:var(--surface);
          border-color:rgba(255,255,255,0.25);
        }
        .scroll-indicator{
          position:absolute;
          bottom:36px;left:50%;
          transform:translateX(-50%);
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:8px;
          color:var(--text-muted);
          font-size:0.72rem;
          letter-spacing:0.1em;
          text-transform:uppercase;
          animation:fade-in-up 1s 0.8s ease both;
        }
        .scroll-line{
          width:1px;height:40px;
          background:linear-gradient(to bottom,var(--text-muted),transparent);
          animation:scroll-pulse 2s ease-in-out infinite;
        }
        @keyframes scroll-pulse{0%,100%{opacity:0.3;}50%{opacity:1;}}
        .hero-stats{
          display:flex;
          gap:0;
          margin-top:80px;
          border:1px solid var(--border);
          border-radius:12px;
          overflow:hidden;
          background:var(--surface);
          animation:fade-in-up 0.8s 0.4s ease both;
        }
        .stat{
          padding:24px 40px;
          border-right:1px solid var(--border);
          flex:1;
          text-align:center;
        }
        .stat:last-child{border-right:none;}
        .stat-num{
          font-family:var(--font-display);
          font-size:2rem;
          font-weight:700;
          color:var(--white);
          letter-spacing:-0.03em;
        }
        .stat-num span{color:var(--cyan);}
        .stat-label{
          font-size:0.78rem;
          color:var(--text-muted);
          letter-spacing:0.05em;
          text-transform:uppercase;
          margin-top:4px;
        }
        .marquee-section{
          border-top:1px solid var(--border);
          border-bottom:1px solid var(--border);
          padding:20px 0;
          overflow:hidden;
          position:relative;
          background:var(--surface);
        }
        .marquee-track{
          display:flex;
          gap:60px;
          width:max-content;
          animation:marquee 30s linear infinite;
        }
        .marquee-section:hover .marquee-track{animation-play-state:paused;}
        @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%)}}
        .marquee-item{
          display:flex;
          align-items:center;
          gap:12px;
          color:var(--text-muted);
          font-size:0.85rem;
          font-weight:500;
          white-space:nowrap;
        }
        .marquee-item i{color:var(--text-muted);font-size:1.1rem;}
        .marquee-dot{
          width:4px;height:4px;
          background:var(--text-muted);
          border-radius:50%;
        }
        section{
          position:relative;
          z-index:1;
        }
        .section-inner{
          max-width:1200px;
          margin:0 auto;
          padding:100px 60px;
        }
        .section-label{
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-size:0.72rem;
          font-weight:600;
          letter-spacing:0.12em;
          text-transform:uppercase;
          color:var(--cyan);
          margin-bottom:20px;
        }
        .section-label::before{
          content:'';
          width:20px;height:1px;
          background:var(--cyan);
        }
        .section-h{
          font-family:var(--font-display);
          font-size:clamp(2rem,4vw,3.2rem);
          font-weight:700;
          line-height:1.1;
          letter-spacing:-0.03em;
          color:var(--white);
          margin-bottom:20px;
        }
        .section-h em{
          font-style:normal;
          color:var(--cyan);
        }
        .section-p{
          color:var(--text-secondary);
          font-size:1.05rem;
          max-width:560px;
          font-weight:300;
        }
        .services-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1px;
          background:var(--border);
          border:1px solid var(--border);
          border-radius:16px;
          overflow:hidden;
          margin-top:60px;
        }
        .service-card{
          background:var(--ink);
          padding:40px 36px;
          transition:background 0.3s;
          cursor:default;
          position:relative;
          overflow:hidden;
        }
        .service-card::before{
          content:'';
          position:absolute;
          inset:0;
          background:var(--cyan-dim);
          opacity:0;
          transition:opacity 0.3s;
        }
        .service-card:hover{background:var(--ink-soft);}
        .service-card:hover::before{opacity:1;}
        .service-icon{
          width:48px;height:48px;
          border-radius:12px;
          background:var(--surface-2);
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:24px;
          font-size:1.2rem;
          color:var(--cyan);
          border:1px solid var(--border);
          position:relative;
          transition:border-color 0.3s,box-shadow 0.3s;
        }
        .service-card:hover .service-icon{
          border-color:var(--cyan);
          box-shadow:0 0 20px var(--cyan-glow);
        }
        .service-card h3{
          font-family:var(--font-display);
          font-size:1.1rem;
          font-weight:700;
          color:var(--white);
          margin-bottom:12px;
          letter-spacing:-0.02em;
        }
        .service-card p{
          font-size:0.875rem;
          color:var(--text-secondary);
          line-height:1.7;
          font-weight:300;
        }
        .service-arrow{
          position:absolute;
          top:36px;right:36px;
          color:var(--text-muted);
          font-size:0.75rem;
          opacity:0;
          transform:translate(-4px,4px);
          transition:opacity 0.3s,transform 0.3s;
        }
        .service-card:hover .service-arrow{opacity:1;transform:translate(0,0);}
        .tech-split{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:80px;
          align-items:start;
          margin-top:60px;
        }
        .tech-tabs{
          display:flex;
          flex-direction:column;
          gap:4px;
        }
        .tech-tab{
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:18px 24px;
          border-radius:10px;
          border:1px solid transparent;
          cursor:pointer;
          transition:all 0.2s;
          background:transparent;
          color:var(--text-secondary);
          font-family:var(--font-body);
          font-size:0.95rem;
          font-weight:500;
          width:100%;
          text-align:left;
        }
        .tech-tab:hover{
          background:var(--surface);
          color:var(--white);
          border-color:var(--border);
        }
        .tech-tab.active{
          background:var(--surface-2);
          color:var(--white);
          border-color:var(--border-bright);
        }
        .tech-tab-icon{
          width:36px;height:36px;
          border-radius:8px;
          background:var(--surface-2);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.85rem;
          margin-right:14px;
          flex-shrink:0;
        }
        .tech-tab.active .tech-tab-icon{
          background:var(--cyan-dim);
          color:var(--cyan);
        }
        .tech-tab-left{display:flex;align-items:center;}
        .tech-tab-arrow{font-size:0.7rem;color:var(--text-muted);}
        .tech-tab.active .tech-tab-arrow{color:var(--cyan);}
        .tech-panel{
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:16px;
          padding:32px;
          position:sticky;
          top:calc(var(--nav-h) + 24px);
        }
        .tech-panel-header{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:24px;
          padding-bottom:20px;
          border-bottom:1px solid var(--border);
        }
        .tech-panel-icon{
          width:44px;height:44px;
          border-radius:10px;
          background:var(--cyan-dim);
          border:1px solid rgba(0,229,200,0.2);
          display:flex;
          align-items:center;
          justify-content:center;
          color:var(--cyan);
          font-size:1.1rem;
        }
        .tech-panel-title{
          font-family:var(--font-display);
          font-size:1.15rem;
          font-weight:700;
          color:var(--white);
        }
        .tech-panel-subtitle{
          font-size:0.8rem;
          color:var(--text-secondary);
        }
        .tech-pills{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-bottom:24px;
        }
        .tech-pill{
          padding:6px 14px;
          background:var(--surface-2);
          border:1px solid var(--border);
          border-radius:6px;
          font-size:0.8rem;
          color:var(--text-secondary);
          font-weight:500;
          transition:border-color 0.2s,color 0.2s;
          cursor:default;
        }
        .tech-pill:hover{
          border-color:rgba(0,229,200,0.4);
          color:var(--cyan);
        }
        .tech-panel-desc{
          font-size:0.875rem;
          color:var(--text-secondary);
          line-height:1.7;
          font-weight:300;
        }
        .process-section{background:var(--surface);}
        .process-steps{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:0;
          margin-top:60px;
          position:relative;
        }
        .process-steps::before{
          content:'';
          position:absolute;
          top:36px;left:calc(12.5% + 24px);right:calc(12.5% + 24px);
          height:1px;
          background:linear-gradient(90deg,var(--cyan),var(--violet),var(--coral));
          opacity:0.4;
        }
        .process-step{
          padding:0 20px;
          text-align:center;
          position:relative;
        }
        .step-num{
          width:48px;height:48px;
          border-radius:50%;
          background:var(--ink);
          border:1px solid var(--border-bright);
          display:flex;
          align-items:center;
          justify-content:center;
          margin:0 auto 28px;
          font-family:var(--font-display);
          font-size:0.85rem;
          font-weight:700;
          color:var(--text-secondary);
          position:relative;
          z-index:1;
        }
        .step-num.cyan{border-color:var(--cyan);color:var(--cyan);}
        .step-num.violet{border-color:var(--violet);color:var(--violet);}
        .step-num.coral{border-color:var(--coral);color:var(--coral);}
        .step-num.amber{border-color:var(--amber);color:var(--amber);}
        .process-step h4{
          font-family:var(--font-display);
          font-size:1rem;
          font-weight:700;
          color:var(--white);
          margin-bottom:10px;
        }
        .process-step p{
          font-size:0.825rem;
          color:var(--text-secondary);
          line-height:1.6;
          font-weight:300;
        }
        .industries-grid{
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:12px;
          margin-top:60px;
        }
        .industry-card{
          aspect-ratio:1;
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:14px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:14px;
          cursor:default;
          transition:all 0.3s;
          position:relative;
          overflow:hidden;
          padding:24px;
          text-align:center;
        }
        .industry-card::after{
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(135deg,var(--cyan-dim),transparent);
          opacity:0;
          transition:opacity 0.3s;
        }
        .industry-card:hover{
          border-color:rgba(0,229,200,0.3);
          transform:translateY(-4px);
          box-shadow:0 20px 40px rgba(0,0,0,0.4);
        }
        .industry-card:hover::after{opacity:1;}
        .industry-icon{
          font-size:1.8rem;
          color:var(--text-muted);
          transition:color 0.3s;
          position:relative;
          z-index:1;
        }
        .industry-card:hover .industry-icon{color:var(--cyan);}
        .industry-name{
          font-size:0.78rem;
          font-weight:600;
          color:var(--text-secondary);
          letter-spacing:0.03em;
          position:relative;
          z-index:1;
        }
        .industry-card:hover .industry-name{color:var(--white);}
        .about-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:60px;
          align-items:center;
        }
        .about-visual{
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:20px;
          overflow:hidden;
          aspect-ratio:4/3;
          position:relative;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .about-canvas{
          width:100%;
          height:100%;
          position:absolute;
        }
        .mission-vision{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
          margin-top:40px;
        }
        .mv-card{
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:12px;
          padding:24px;
          transition:border-color 0.3s;
        }
        .mv-card:hover{border-color:var(--cyan);}
        .mv-icon{
          font-size:1.1rem;
          color:var(--cyan);
          margin-bottom:14px;
        }
        .mv-title{
          font-family:var(--font-display);
          font-size:1rem;
          font-weight:700;
          color:var(--white);
          margin-bottom:8px;
        }
        .mv-text{
          font-size:0.825rem;
          color:var(--text-secondary);
          line-height:1.6;
          font-weight:300;
        }
        .cta-section{
          position:relative;
          overflow:hidden;
        }
        .cta-inner{
          max-width:1200px;
          margin:0 auto;
          padding:80px 60px;
        }
        .cta-box{
          background:var(--surface);
          border:1px solid var(--border-bright);
          border-radius:24px;
          padding:80px 80px;
          text-align:center;
          position:relative;
          overflow:hidden;
        }
        .cta-box::before{
          content:'';
          position:absolute;
          top:-200px;left:50%;
          transform:translateX(-50%);
          width:600px;height:400px;
          background:radial-gradient(circle,rgba(0,229,200,0.08),transparent 70%);
          pointer-events:none;
        }
        .cta-h{
          font-family:var(--font-display);
          font-size:clamp(2.5rem,4vw,3.5rem);
          font-weight:800;
          line-height:1.1;
          letter-spacing:-0.04em;
          color:var(--white);
          margin-bottom:20px;
        }
        .cta-p{
          color:var(--text-secondary);
          font-size:1.05rem;
          max-width:520px;
          margin:0 auto 40px;
          font-weight:300;
        }
        .cta-actions{
          display:flex;
          gap:16px;
          justify-content:center;
          flex-wrap:wrap;
        }
        .cta-email{
          display:flex;
          align-items:center;
          gap:10px;
          background:var(--ink);
          border:1px solid var(--border-bright);
          border-radius:8px;
          padding:14px 20px;
          font-size:0.875rem;
          color:var(--cyan);
        }
        footer{
          border-top:1px solid var(--border);
          background:var(--ink);
        }
        .footer-inner{
          max-width:1200px;
          margin:0 auto;
          padding:60px 60px 40px;
        }
        .footer-top{
          display:grid;
          grid-template-columns:2fr 1fr 1fr 1fr;
          gap:60px;
          margin-bottom:60px;
        }
        .footer-brand{
          font-family:var(--font-display);
          font-size:1.3rem;
          font-weight:800;
          color:var(--white);
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:16px;
        }
        .footer-brand-text{
          font-size:0.875rem;
          color:var(--text-muted);
          line-height:1.7;
          font-weight:300;
          max-width:280px;
          margin-bottom:24px;
        }
        .footer-socials{
          display:flex;
          gap:12px;
        }
        .social-btn{
          width:36px;height:36px;
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:var(--text-muted);
          text-decoration:none;
          font-size:0.85rem;
          transition:all 0.2s;
        }
        .social-btn:hover{
          border-color:var(--cyan);
          color:var(--cyan);
        }
        .footer-col h5{
          font-family:var(--font-display);
          font-size:0.875rem;
          font-weight:700;
          color:var(--white);
          margin-bottom:20px;
          letter-spacing:0.01em;
        }
        .footer-links{
          list-style:none;
          display:flex;
          flex-direction:column;
          gap:10px;
        }
        .footer-links a{
          color:var(--text-muted);
          text-decoration:none;
          font-size:0.85rem;
          transition:color 0.2s;
          font-weight:300;
        }
        .footer-links a:hover{color:var(--cyan);}
        .footer-bottom{
          border-top:1px solid var(--border);
          padding-top:28px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        .footer-copy{
          font-size:0.8rem;
          color:var(--text-muted);
        }
        .footer-badge{
          display:flex;
          align-items:center;
          gap:8px;
          font-size:0.78rem;
          color:var(--text-muted);
        }
        .badge-dot{
          width:6px;height:6px;
          background:var(--cyan);
          border-radius:50%;
          animation:blink 2s ease-in-out infinite;
        }
        @keyframes fade-in-up{
          from{opacity:0;transform:translateY(24px);}
          to{opacity:1;transform:translateY(0);}
        }
        .reveal{
          opacity:0;
          transform:translateY(32px);
          transition:opacity 0.7s ease,transform 0.7s ease;
        }
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-delay-1{transition-delay:0.1s;}
        .reveal-delay-2{transition-delay:0.2s;}
        .reveal-delay-3{transition-delay:0.3s;}
        .reveal-delay-4{transition-delay:0.4s;}
        @media(max-width:900px){
          nav{padding:0 24px;}
          .nav-links{display:none;}
          .section-inner{padding:70px 24px;}
          .services-grid{grid-template-columns:1fr;}
          .tech-split{grid-template-columns:1fr;}
          .process-steps{grid-template-columns:1fr 1fr;gap:32px;}
          .process-steps::before{display:none;}
          .industries-grid{grid-template-columns:repeat(3,1fr);}
          .about-grid{grid-template-columns:1fr;}
          .footer-top{grid-template-columns:1fr 1fr;}
          .hero-stats{flex-direction:column;gap:0;}
          .stat{border-right:none;border-bottom:1px solid var(--border);}
          .cta-box{padding:48px 28px;}
          .hero-title{font-size:2.8rem;}
        }
      `}</style>

      {/* ─── CURSOR ─── */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>

      {/* ─── GRID LINES ─── */}
      <div className="grid-lines"></div>

     {/* ─── NAV ───
          <nav>
            <Link to="/" className="nav-logo">
              <div className="logo-mark">N∑</div>
              NexusAI
            </Link>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#services">Services</Link></li>
              <li><Link to="/#technology">Technology</Link></li>
              <li><Link to="/#process">Process</Link></li>
              <li><Link to="/#industries">Industries</Link></li>
              <li><Link to="/#about">About</Link></li>
              <li><Link to="/blogs" style={{ color: 'var(--cyan)' }}>Blogs</Link></li>
            </ul>
            <Link to="/login" className="nav-cta">Admin Login</Link>
          </nav> */}

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>
        <div className="hero-orb orb-3"></div>

        <div className="hero-tag">
          <span className="hero-tag-dot"></span>
          Calicut, Kerala — India's AI Frontier
        </div>

        <h1 className="hero-title">
          <div className="line-1">Where Intelligence</div>
          <div className="line-2">Meets Innovation</div>
        </h1>

        <p className="hero-sub">
          We build AI-powered software, scalable web platforms, and intelligent automation systems that transform how modern businesses operate and compete.
        </p>

        <div className="hero-actions">
          <a href="#services" className="btn-primary">
            Explore Solutions <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
          </a>
          <a href="#about" className="btn-secondary">
            <i className="fa-solid fa-play" style={{ fontSize: '0.65rem' }}></i> Watch Demo
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">120<span>+</span></div>
            <div className="stat-label">Projects Delivered</div>
          </div>
          <div className="stat">
            <div className="stat-num">98<span>%</span></div>
            <div className="stat-label">Client Satisfaction</div>
          </div>
          <div className="stat">
            <div className="stat-num">6<span>+</span></div>
            <div className="stat-label">Years of Expertise</div>
          </div>
          <div className="stat">
            <div className="stat-num">30<span>+</span></div>
            <div className="stat-label">AI Models Deployed</div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          Scroll
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="marquee-section">
        <div className="marquee-track" id="marquee">
          <div className="marquee-item"><i className="fab fa-python"></i> Python</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-react"></i> React.js</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-brain"></i> TensorFlow</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-aws"></i> AWS</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-fire"></i> PyTorch</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-node-js"></i> Node.js</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-database"></i> PostgreSQL</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-docker"></i> Docker</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-microchip"></i> OpenAI</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-google"></i> Google Cloud</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-microsoft"></i> Azure</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-flutter">Flutter</i></div>
          <div className="marquee-dot"></div>
          {/* Duplicate for seamless loop */}
          <div className="marquee-item"><i className="fab fa-python"></i> Python</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-react"></i> React.js</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-brain"></i> TensorFlow</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-aws"></i> AWS</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-fire"></i> PyTorch</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-node-js"></i> Node.js</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-database"></i> PostgreSQL</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-docker"></i> Docker</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fas fa-microchip"></i> OpenAI</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-google"></i> Google Cloud</div>
          <div className="marquee-dot"></div>
          <div className="marquee-item"><i className="fab fa-microsoft"></i> Azure</div>
          <div className="marquee-dot"></div>
        </div>
      </div>

      {/* ─── SERVICES ─── */}
      <section id="services">
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">What We Build</div>
            <h2 className="section-h">End-to-End <em>AI & Software</em><br />Development Services</h2>
            <p className="section-p">From machine learning models to enterprise platforms — we architect and deliver technology that drives measurable business outcomes.</p>
          </div>

          <div className="services-grid reveal reveal-delay-1">
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-brain"></i></div>
              <div className="service-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <h3>Machine Learning & AI</h3>
              <p>Custom ML models, predictive analytics, and AI integrations that extract signal from your data and automate complex decisions at scale.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-comments"></i></div>
              <div className="service-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <h3>AI Chatbot & NLP</h3>
              <p>Intelligent conversational agents powered by large language models — for customer support, internal ops, and automated knowledge retrieval.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-eye"></i></div>
              <div className="service-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <h3>Computer Vision</h3>
              <p>Real-time object detection, image classification, and visual inspection systems for healthcare, manufacturing, retail, and security sectors.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-layer-group"></i></div>
              <div className="service-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <h3>Enterprise Software</h3>
              <p>ERP, CRM, and SaaS platforms designed around your workflows — scalable, secure, and built to evolve with your business.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-mobile-screen"></i></div>
              <div className="service-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <h3>Mobile & Web Apps</h3>
              <p>Cross-platform iOS, Android, and web applications built with React Native and Flutter — high performance, pixel-perfect design.</p>
            </div>
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-cloud"></i></div>
              <div className="service-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <h3>Cloud & DevOps</h3>
              <p>Cloud migration, Kubernetes orchestration, CI/CD pipelines, and infrastructure automation across AWS, GCP, and Azure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGY ─── */}
      <section id="technology" style={{ background: 'var(--ink-soft)' }}>
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">Our Stack</div>
            <h2 className="section-h">Built with <em>Battle-Tested</em><br />Modern Technology</h2>
            <p className="section-p">We choose technologies based on your use case — not trends. Every stack decision is deliberate and production-proven.</p>
          </div>

          <div className="tech-split">
            <div className="tech-tabs reveal reveal-delay-1" id="tech-tabs">
              <button className="tech-tab active" data-panel="frontend">
                <div className="tech-tab-left">
                  <div className="tech-tab-icon"><i className="fas fa-palette"></i></div>
                  Frontend
                </div>
                <i className="fas fa-chevron-right tech-tab-arrow"></i>
              </button>
              <button className="tech-tab" data-panel="backend">
                <div className="tech-tab-left">
                  <div className="tech-tab-icon"><i className="fas fa-server"></i></div>
                  Backend
                </div>
                <i className="fas fa-chevron-right tech-tab-arrow"></i>
              </button>
              <button className="tech-tab" data-panel="ai">
                <div className="tech-tab-left">
                  <div className="tech-tab-icon"><i className="fas fa-brain"></i></div>
                  AI & ML
                </div>
                <i className="fas fa-chevron-right tech-tab-arrow"></i>
              </button>
              <button className="tech-tab" data-panel="mobile">
                <div className="tech-tab-left">
                  <div className="tech-tab-icon"><i className="fas fa-mobile"></i></div>
                  Mobile
                </div>
                <i className="fas fa-chevron-right tech-tab-arrow"></i>
              </button>
              <button className="tech-tab" data-panel="cloud">
                <div className="tech-tab-left">
                  <div className="tech-tab-icon"><i className="fas fa-cloud"></i></div>
                  Cloud & Infra
                </div>
                <i className="fas fa-chevron-right tech-tab-arrow"></i>
              </button>
              <button className="tech-tab" data-panel="data">
                <div className="tech-tab-left">
                  <div className="tech-tab-icon"><i className="fas fa-database"></i></div>
                  Data & Analytics
                </div>
                <i className="fas fa-chevron-right tech-tab-arrow"></i>
              </button>
            </div>

            <div className="tech-panel reveal reveal-delay-2" id="tech-panel">
              <div className="tech-panel-header">
                <div className="tech-panel-icon" id="panel-icon"><i className="fas fa-palette"></i></div>
                <div>
                  <div className="tech-panel-title" id="panel-title">Frontend Development</div>
                  <div className="tech-panel-subtitle" id="panel-subtitle">UI, UX & Web Interfaces</div>
                </div>
              </div>
              <div className="tech-pills" id="panel-pills"></div>
              <div className="tech-panel-desc" id="panel-desc"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section id="process" className="process-section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div className="section-label">How We Work</div>
            <h2 className="section-h">From Concept to <em>Production</em><br />in 4 Phases</h2>
          </div>

          <div className="process-steps">
            <div className="process-step reveal reveal-delay-1">
              <div className="step-num cyan">01</div>
              <h4>Discovery & Strategy</h4>
              <p>Deep-dive into your goals, users, and constraints. Define scope, architecture, and success metrics before a single line of code is written.</p>
            </div>
            <div className="process-step reveal reveal-delay-2">
              <div className="step-num violet">02</div>
              <h4>Design & Prototype</h4>
              <p>UX wireframes, system architecture, and interactive prototypes. We validate the solution with you before full development begins.</p>
            </div>
            <div className="process-step reveal reveal-delay-3">
              <div className="step-num coral">03</div>
              <h4>Build & Iterate</h4>
              <p>Agile sprints with weekly demos. Continuous integration ensures quality at every stage — not just at the end.</p>
            </div>
            <div className="process-step reveal reveal-delay-4">
              <div className="step-num amber">04</div>
              <h4>Deploy & Scale</h4>
              <p>Production deployment, monitoring, and ongoing support. We stay engaged as your product grows and evolves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section id="industries" style={{ background: 'var(--ink-soft)' }}>
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">Sectors We Serve</div>
            <h2 className="section-h">Deep Expertise Across<br /><em>Key Industries</em></h2>
          </div>

          <div className="industries-grid reveal reveal-delay-1">
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-heartbeat"></i></div>
              <div className="industry-name">Healthcare</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-coins"></i></div>
              <div className="industry-name">Fintech</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-graduation-cap"></i></div>
              <div className="industry-name">EdTech</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-shopping-bag"></i></div>
              <div className="industry-name">E-commerce</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-truck"></i></div>
              <div className="industry-name">Logistics</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-industry"></i></div>
              <div className="industry-name">Manufacturing</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-hotel"></i></div>
              <div className="industry-name">Hospitality</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-seedling"></i></div>
              <div className="industry-name">AgriTech</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-broadcast-tower"></i></div>
              <div className="industry-name">Media & SaaS</div>
            </div>
            <div className="industry-card">
              <div className="industry-icon"><i className="fas fa-city"></i></div>
              <div className="industry-name">Smart Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="reveal">
              <div className="section-label">Who We Are</div>
              <h2 className="section-h">Kerala's Premier<br /><em>AI-First</em> Studio</h2>
              <p className="section-p" style={{ marginBottom: '20px' }}>
                Founded in Calicut, NexusAI is a team of engineers, designers, and AI researchers building next-generation digital products for businesses across India and beyond.
              </p>
              <p className="section-p">
                We combine the precision of software engineering with the creativity of product design — all anchored by a deep understanding of AI's transformative potential.
              </p>
              <div className="mission-vision">
                <div className="mv-card">
                  <div className="mv-icon"><i className="fas fa-rocket"></i></div>
                  <div className="mv-title">Mission</div>
                  <div className="mv-text">Empower businesses with intelligent technology that is accessible, scalable, and grounded in real-world results.</div>
                </div>
                <div className="mv-card">
                  <div className="mv-icon"><i className="fas fa-compass"></i></div>
                  <div className="mv-title">Vision</div>
                  <div className="mv-text">To be the most trusted AI engineering partner for the next generation of ambitious companies in Kerala and India.</div>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="about-visual">
                <canvas className="about-canvas" ref={canvasRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="contact" className="cta-section" style={{ background: 'var(--ink-soft)' }}>
        <div className="cta-inner">
          <div className="cta-box reveal">
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '24px' }}>Start a Project</div>
            <h2 className="cta-h">Ready to Build<br />Something Exceptional?</h2>
            <p className="cta-p">Tell us what you're building. Our team will get back to you within 24 hours with a tailored approach and initial roadmap.</p>
            <div className="cta-actions">
              <a href="mailto:hello@nexusai.in" className="btn-primary">
                <i className="fas fa-envelope" style={{ fontSize: '0.8rem' }}></i> hello@nexusai.in
              </a>
              <div className="cta-email">
                <i className="fas fa-map-marker-alt" style={{ fontSize: '0.8rem' }}></i>
                Calicut, Kerala, India
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <div className="logo-mark">N∑</div>
                NexusAI
              </div>
              <div className="footer-brand-text">
                AI & software engineering studio based in Calicut, Kerala. Building intelligent digital products since 2019.
              </div>
              <div className="footer-socials">
                <a href="#" className="social-btn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-github"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h5>Services</h5>
              <ul className="footer-links">
                <li><a href="#">Machine Learning</a></li>
                <li><a href="#">AI Chatbots</a></li>
                <li><a href="#">Computer Vision</a></li>
                <li><a href="#">Web Development</a></li>
                <li><a href="#">Mobile Apps</a></li>
                <li><a href="#">Cloud & DevOps</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Team</a></li>
                <li><a href="#">Case Studies</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Locations</h5>
              <ul className="footer-links">
                <li><a href="#">Calicut (HQ)</a></li>
                <li><a href="#">Kochi</a></li>
                <li><a href="#">Trivandrum</a></li>
                <li><a href="#">Thrissur</a></li>
                <li><a href="#">Bangalore</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 NexusAI Technologies. All rights reserved.</div>
            <div className="footer-badge">
              <span className="badge-dot"></span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;