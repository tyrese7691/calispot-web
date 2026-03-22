import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

const SC = {
  spotDetail: "/screenshots/screen-spot-detail.png",
  map:        "/screenshots/screen-map.png",
  events:     "/screenshots/screen-events.png",
  people:     "/screenshots/screen-people.png",
  video:      "/screenshots/app-demo.mov",
};
const APP_STORE = "https://apps.apple.com/gb/app/calispot-calisthenics-parks/id6747050360";
const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Mono:wght@400;500&display=swap";

const AppleIcon = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

function Phone({ src, alt = "App screenshot", width = 248, tilt = 0, extraStyle = {} }) {
  const h  = Math.round(width * 2.169);
  const r  = Math.round(width * 0.168);
  const iw = Math.round(width * 0.292);
  const ih = Math.round(width * 0.073);
  const it = Math.round(width * 0.031);
  return (
    <div style={{ width, height: h, position: "relative", flexShrink: 0, transform: `rotate(${tilt}deg)`, ...extraStyle }}>
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(160deg,#2e2e2e,#0a0a0a)",borderRadius:r,border:"1.5px solid rgba(255,255,255,.11)",overflow:"hidden",boxShadow:"0 0 0 1px rgba(0,0,0,.85),0 50px 100px rgba(0,0,0,.95),0 0 70px rgba(245,200,66,.06)" }}>
        <div style={{ position:"absolute",top:it,left:"50%",transform:"translateX(-50%)",width:iw,height:ih,background:"#000",borderRadius:ih,zIndex:10,pointerEvents:"none" }} />
        {src
          ? <img src={src} alt={alt} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",display:"block" }} />
          : <div style={{ position:"absolute",inset:0,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.1)",fontSize:"2rem" }}>📱</div>
        }
      </div>
    </div>
  );
}

export default function Home() {
  const rNav = useRef(null);
  const rSs  = useRef(null);
  const rSph = useRef(null);
  const rP   = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const rPb  = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const rDs  = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const rLbl = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const rCc  = useRef(null);

  useEffect(() => {
    // Scroll reveal
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll(".rv").forEach(el => io.observe(el));

    const cl = (v,a,b) => Math.max(a, Math.min(b, v));
    const lr = (a,b,t) => a + (b-a)*t;
    const pg = (s,a,b) => cl((s-a)/(b-a), 0, 1);
    const e3 = t => 1-Math.pow(1-t,3);

    let sy = 0;
    window.addEventListener("scroll", () => { sy = window.scrollY; }, { passive:true });

    // CTA entrance
    const cc = rCc.current;
    cc.style.transform = "translateY(52px)"; cc.style.opacity = "0";
    const ccio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          cc.style.transition = "transform .95s cubic-bezier(.16,1,.3,1),opacity .95s ease,box-shadow .95s ease";
          cc.style.transform  = "translateY(0)"; cc.style.opacity = "1";
          cc.style.boxShadow  = "0 48px 120px rgba(245,200,66,.22)";
        }
      });
    }, { threshold:.12 });
    ccio.observe(cc);

    let raf;
    const panels = rP.map(r => r.current);
    const pbs    = rPb.map(r => r.current);
    const dscrs  = rDs.map(r => r.current);
    const lbls   = rLbl.map(r => r.current);

    function tick() {
      const vh = window.innerHeight;
      rNav.current.classList.toggle("sc", sy > 60);

      // Story section
      const ssT = rSs.current.offsetTop;
      const sdp = pg(sy, ssT, ssT + rSs.current.offsetHeight - vh);
      for (let i = 0; i < 4; i++) {
        const pp = pg(sdp, i/4, (i+1)/4);
        let op = 1;
        if (pp < 0.18) op = pp/0.18;
        else if (pp > 0.82) op = 1-(pp-0.82)/0.18;
        panels[i].style.opacity   = op.toFixed(3);
        panels[i].style.transform = `translateY(${lr(28,-28,e3(pp))}px)`;
        pbs[i].style.height       = (cl(pp/0.85,0,1)*100)+"%";
        // Label fades + slides in sync with progress bar
        lbls[i].style.opacity   = op.toFixed(3);
        lbls[i].style.transform = `translateX(${(1 - op) * -8}px)`;
        if (pp > 0.12 && pp < 0.92) {
          dscrs[i].style.opacity = "1";
          dscrs.forEach((d,j) => { if (j!==i) d.style.opacity="0"; });
        }
      }
      rSph.current.style.transform = `translateY(${Math.sin(sdp*Math.PI*3)*7}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ccio.disconnect();
    };
  }, []);

  return (
    <>
<Head>

  <title>CaliSpot</title>


  <meta
    name="description"
    content="Every outdoor calisthenics park in London, mapped and rated. Real photos. Live check-ins. Zero ads."
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
  <link href={FONTS} rel="stylesheet" />
<link rel="icon" href="/images/calilogobg.png" />
</Head>


      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --y:#F5C842;--g:#3DFF8F;--bg:#0d0d0d;--card:#141414;
          --w:rgba(255,255,255,.92);--wm:rgba(255,255,255,.44);
          --wd:rgba(255,255,255,.12);--bd:rgba(255,255,255,.07);
          --font:'Bricolage Grotesque',sans-serif;
          --mono:'DM Mono',monospace;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--w);font-family:var(--font);overflow-x:hidden}

        /* NAV */
        nav{position:fixed;top:0;left:0;right:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:68px;transition:background .4s,border-color .4s;border-bottom:1px solid transparent}
        nav.sc{background:rgba(13,13,13,.95);backdrop-filter:blur(24px);border-color:var(--bd)}
        .nl{display:flex;align-items:center;gap:10px;text-decoration:none}
        .nl-logo{width:50px;height:50px;border-radius:50%;overflow:hidden;background:#fff;flex-shrink:0}
        .nl-logo img{width:100%;height:100%;object-fit:cover;display:block}
        .nl-name{font-size:2rem;font-weight:800;letter-spacing:-.02em;color:var(--w)}
        .nbtn{display:inline-flex;align-items:center;gap:6px;background:var(--y);color:#0d0d0d;font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:.6rem 1.4rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .nbtn:hover{transform:scale(1.05);box-shadow:0 0 32px rgba(245,200,66,.55)}

        /* HERO — static full-height, text centred, marquee pinned to bottom */
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 48px 0;position:relative;overflow:hidden}
        .hbg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 48%,rgba(245,200,66,.06) 0%,transparent 70%);pointer-events:none}
        .hgrd{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.024) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.024) 1px,transparent 1px);background-size:88px 88px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,#000 10%,transparent 75%)}
        .htx{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center}
        .heyb{font-family:var(--mono);font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--y);margin-bottom:1.6rem;opacity:0;transform:translateY(14px);animation:fu .6s .1s ease forwards}
        .hh1{font-size:clamp(4.5rem,12vw,13rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:#fff;opacity:0;transform:translateY(22px);animation:fu .8s .22s ease forwards}
        .hh1 .yr{color:var(--y);position:relative}
        .hh1 .yr::after{content:'';position:absolute;left:0;right:0;bottom:.1em;height:.06em;background:var(--y);border-radius:2px}
        .hsub{margin-top:1.8rem;font-size:clamp(.95rem,1.8vw,1.15rem);font-weight:400;line-height:1.7;color:var(--wm);max-width:440px;opacity:0;transform:translateY(12px);animation:fu .7s .38s ease forwards}
        .hact{display:flex;gap:.9rem;margin-top:2.4rem;opacity:0;transform:translateY(10px);animation:fu .7s .52s ease forwards}
        .bpri{display:inline-flex;align-items:center;gap:7px;background:var(--y);color:#0d0d0d;font-size:.8rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:.95rem 2rem;border-radius:50px;text-decoration:none;transition:transform .2s,box-shadow .2s}
        .bpri:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(245,200,66,.45)}
        .bgho{display:inline-flex;align-items:center;color:var(--wm);font-size:.8rem;font-weight:500;padding:.95rem 1.5rem;border-radius:50px;text-decoration:none;border:1px solid var(--bd);transition:color .2s,border-color .2s}
        .bgho:hover{color:var(--w);border-color:var(--wd)}

        /* MARQUEE — pinned to bottom of hero */
        .mq{width:100%;overflow:hidden;padding:24px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);position:absolute;bottom:0;left:0;right:0}
        .mqt{display:flex;width:max-content;animation:mq 24s linear infinite}
        .mqt span{font-family:var(--mono);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.09);padding-right:2.5rem;white-space:nowrap}
        .mqt span em{font-style:normal;color:rgba(245,200,66,.38)}

        /* VIDEO — smaller centred phone frame */
        .vid-outer{padding:80px 48px 100px;max-width:340px;margin:0 auto}
        .vid-eyb{font-family:var(--mono);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:28px;text-align:center}
        .vid-frame{position:relative;border-radius:38px;overflow:hidden;background:#000;aspect-ratio:922/2000;box-shadow:0 0 0 1px var(--bd),0 40px 80px rgba(0,0,0,.9),0 0 80px rgba(245,200,66,.1)}
        .vid-frame video{width:100%;height:100%;object-fit:cover;display:block}
        .vid-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.2) 0%,transparent 18%,transparent 72%,rgba(0,0,0,.6) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:22px;pointer-events:none}
        .vid-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(61,255,143,.1);border:1px solid rgba(61,255,143,.3);border-radius:50px;padding:3px 9px;width:fit-content;margin-bottom:7px;font-family:var(--mono);font-size:.48rem;letter-spacing:.1em;color:var(--g)}
        .vdot{width:5px;height:5px;border-radius:50%;background:var(--g);animation:bl 1.4s ease infinite}
        .vid-cap{font-size:.9rem;font-weight:800;letter-spacing:-.02em;color:#fff}

        /* STORY */
        #ss{position:relative;height:500vh}
        #sst{position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .sph{position:relative;z-index:4;will-change:transform}
        .spn{position:absolute;z-index:5;max-width:340px;will-change:transform,opacity}
        .spn.lt{left:calc(50% - 490px)}
        .spn.rt{right:calc(50% - 490px);text-align:right}
        .pst{font-family:var(--mono);font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:1rem;display:flex;align-items:center;gap:.6rem}
        .pst::before{content:'';width:24px;height:1px;background:var(--y);flex-shrink:0}
        .spn.rt .pst{flex-direction:row-reverse}
        .ph2{font-size:clamp(2.6rem,4.5vw,4.2rem);font-weight:900;line-height:.92;letter-spacing:-.04em;color:#fff}
        .pp{margin-top:1.1rem;font-size:.9rem;font-weight:400;line-height:1.75;color:var(--wm)}
        .spbr{position:absolute;left:48px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:6}
        .spbt{width:2px;height:48px;background:var(--bd);border-radius:1px;overflow:hidden}
        .spbf{width:100%;background:var(--y);border-radius:1px;height:0%}
        .spbl{position:absolute;left:calc(48px + 14px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:6}
        .spbl-item{height:48px;display:flex;align-items:center;will-change:transform,opacity;transition:none}
        .spbl-item span{font-family:var(--mono);font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);white-space:nowrap;line-height:1}
        .dscr{position:absolute;inset:0;transition:opacity .55s ease}

        /* FEATURES */
        .fsec{padding:160px 48px;max-width:1200px;margin:0 auto}
        .sey{font-family:var(--mono);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--y);margin-bottom:1.2rem}
        .stit{font-size:clamp(3.2rem,7vw,8rem);font-weight:900;line-height:.88;letter-spacing:-.04em}
        .stit .gl{color:var(--g)}
        .fg{margin-top:80px;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:28px;overflow:hidden}
        .fc{background:var(--bg);padding:3rem 2.5rem;position:relative;overflow:hidden;transition:background .25s}
        .fc::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--y),var(--g));transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
        .fc:hover{background:var(--card)}
        .fc:hover::after{transform:scaleX(1)}
        .fn{font-size:4rem;font-weight:900;color:rgba(245,200,66,.05);line-height:1;margin-bottom:1.2rem}
        .fi{font-size:1.5rem;margin-bottom:1rem}
        .ft{font-size:1.05rem;font-weight:800;letter-spacing:-.025em;color:#fff;margin-bottom:.6rem}
        .fd{font-size:.84rem;font-weight:400;color:var(--wm);line-height:1.7}

        /* STATS */
        .str{padding:120px 48px;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);display:flex;justify-content:center;flex-wrap:wrap}
        .sti{flex:1;min-width:200px;text-align:center;padding:0 40px;position:relative}
        .sti+.sti::before{content:'';position:absolute;left:0;top:15%;bottom:15%;width:1px;background:var(--bd)}
        .stv{font-size:clamp(5rem,13vw,11rem);font-weight:900;line-height:.9;letter-spacing:-.04em;color:var(--y)}
        .stl{font-family:var(--mono);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--wm);margin-top:.7rem}

        /* VALUES */
        .vsec{padding:0 48px 160px;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .vl{list-style:none;margin-top:2.2rem;display:flex;flex-direction:column;gap:1.1rem}
        .vl li{display:flex;align-items:flex-start;gap:.9rem;font-size:.92rem;font-weight:400;color:rgba(255,255,255,.55);line-height:1.6}
        .vck{width:20px;height:20px;min-width:20px;border-radius:50%;background:rgba(61,255,143,.07);border:1px solid rgba(61,255,143,.22);display:flex;align-items:center;justify-content:center;font-size:.58rem;color:var(--g);margin-top:1px;flex-shrink:0}
        .vbig{text-align:center}
        .vnum{font-size:clamp(7rem,16vw,15rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:var(--y);display:block}
        .vnum2{font-size:clamp(4rem,9vw,9rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:var(--g);margin-top:1.5rem;display:block}
        .vnl{font-family:var(--mono);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--wm);margin-top:.5rem;display:block}

        /* CTA */
        .csec{padding:0 48px 100px;max-width:1200px;margin:0 auto}
        .cc{position:relative;overflow:hidden;background:var(--y);border-radius:36px;padding:90px 60px;text-align:center;will-change:transform}
        .cc::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 15% 40%,rgba(255,255,255,.16) 0%,transparent 45%),radial-gradient(circle at 85% 70%,rgba(255,255,255,.08) 0%,transparent 40%)}
        .cc-bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:clamp(10rem,28vw,26rem);font-weight:900;letter-spacing:-.05em;line-height:1;color:rgba(0,0,0,.05);white-space:nowrap;pointer-events:none;user-select:none}
        .ch2{font-size:clamp(3rem,8vw,8rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:#0d0d0d;position:relative}
        .cp{margin:1.4rem auto 2.8rem;font-size:1rem;font-weight:400;color:rgba(0,0,0,.5);max-width:400px;line-height:1.7;position:relative}
        .cb{display:inline-flex;align-items:center;gap:.6rem;background:#0d0d0d;color:var(--y);font-size:.8rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:1.1rem 2.4rem;border-radius:50px;text-decoration:none;position:relative;transition:transform .2s,box-shadow .2s}
        .cb:hover{transform:translateY(-3px);box-shadow:0 18px 50px rgba(0,0,0,.3)}

        /* FOOTER */
        footer{border-top:1px solid var(--bd);padding:40px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem}
        .flk{display:flex;gap:2rem;flex-wrap:wrap}
        .flk a{font-family:var(--mono);font-size:.65rem;color:rgba(255,255,255,.2);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
        .flk a:hover{color:var(--wm)}
        .fcp{font-family:var(--mono);font-size:.58rem;color:rgba(255,255,255,.12)}

        /* REVEAL */
        .rv{opacity:0;transform:translateY(36px);transition:opacity .9s ease,transform .9s ease}
        .rv.in{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}

        @keyframes fu{to{opacity:1;transform:translateY(0)}}
        @keyframes bl{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        @media(max-width:1080px){
          .spn,.spbl{display:none}
          .fg{grid-template-columns:1fr 1fr}
          .vsec{grid-template-columns:1fr}
          nav,.fsec,.csec,.str,.vsec,.vid-outer{padding-left:24px;padding-right:24px}
          footer{padding:32px 24px}
          .hero{padding-left:24px;padding-right:24px}
        }
        @media(max-width:640px){
          .fg{grid-template-columns:1fr}
          .hact{flex-direction:column;align-items:center}
          .cc{padding:60px 28px}
          .sti+.sti::before{display:none}
        }
      `}</style>

      {/* NAV */}
      <nav ref={rNav}>
        <a href="/" className="nl">
          <div className="nl-logo"><img src="/images/calilogobg.png" alt="CaliSpot" /></div>
          <span className="nl-name">CaliSpot</span>
        </a>
        <a href={APP_STORE} className="nbtn" target="_blank" rel="noreferrer">
          Download on iOS
        </a>
      </nav>

      {/* HERO — text + buttons, marquee pinned to bottom edge */}
      <div className="hero">
        <div className="hbg" />
        <div className="hgrd" />
        <div className="htx">
          <p className="heyb">The Calisthenics Community App</p>
          <h1 className="hh1">TRAIN <span className="yr">ANYWHERE</span></h1>
          <p className="hsub">Every outdoor calisthenics park in London, mapped and rated. Real photos. Live check-ins. Zero ads.</p>
          <div className="hact">
            <a href={APP_STORE} className="bpri" target="_blank" rel="noreferrer">Download on iOS</a>
          </div>
        </div>
        <div className="mq">
          <div className="mqt">
            {[0,1].map(k => (
              <span key={k}>FIND SPOTS <em>◆</em> TRAIN OUTSIDE <em>◆</em> NO ADS <em>◆</em> LIVE CHECK-INS <em>◆</em> GPS DIRECTIONS <em>◆</em> REAL PHOTOS <em>◆</em> FREE FOREVER <em>◆</em> EQUIPMENT RATINGS <em>◆</em> COMMUNITY EVENTS <em>◆</em>&nbsp;&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO — smaller phone frame, centred as main stage */}
      <div className="vid-outer rv">
        <p className="vid-eyb">See it in action</p>
        <div className="vid-frame">
          <video src={SC.video} autoPlay muted loop playsInline />
          <div className="vid-overlay">
            <div className="vid-badge"><div className="vdot" />LIVE DEMO</div>
            <div className="vid-cap">CaliSpot in action</div>
          </div>
        </div>
      </div>

      {/* SCROLL STORY */}
      <div id="ss" ref={rSs}>
        <div id="sst">
          <div className="spbr">
            {[0,1,2,3].map(i => <div className="spbt" key={i}><div className="spbf" ref={rPb[i]} /></div>)}
          </div>
          <div className="spbl">
            {[
              "Find parks",
              "See who's training",
              "Log sessions",
              "Join community events",
            ].map((txt, i) => (
              <div className="spbl-item" key={i} ref={rLbl[i]} style={{ opacity: i === 0 ? 1 : 0 }}>
                <span>{txt}</span>
              </div>
            ))}
          </div>
          <div className="spn lt" ref={rP[0]}>
            <p className="pst">01 — Discover</p>
            <h2 className="ph2">Your park<br />is out there.</h2>
            <p className="pp">Every park across London sorted by GPS distance. Equipment ratings, real photos - everything before you arrive.</p>
          </div>
          <div className="spn rt" ref={rP[1]} style={{ opacity:0 }}>
            <p className="pst">02 — Connect</p>
            <h2 className="ph2">Find your<br />people.</h2>
            <p className="pp">Connect with locals and personal trainers.</p>
          </div>
          <div className="spn lt" ref={rP[2]} style={{ opacity:0 }}>
            <p className="pst">03 — Train</p>
            <h2 className="ph2">Log every<br />session.</h2>
            <p className="pp">One tap to check in. Build streaks, track history, keep momentum going week after week.</p>
          </div>
          <div className="spn rt" ref={rP[3]} style={{ opacity:0 }}>
            <p className="pst">04 — Events</p>
            <h2 className="ph2">Train with<br />the community.</h2>
            <p className="pp">Outdoor sessions, personal trainers, and community events - all happening at parks near you.</p>
          </div>
          <div className="sph" ref={rSph}>
            <div style={{ position:"relative",width:258,height:559,flexShrink:0 }}>
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(160deg,#2c2c2c,#0a0a0a)",borderRadius:44,border:"1.5px solid rgba(255,255,255,.11)",overflow:"hidden",boxShadow:"0 0 0 1px rgba(0,0,0,.85),0 56px 110px rgba(0,0,0,.95),0 0 80px rgba(245,200,66,.07)" }}>
                <div style={{ position:"absolute",top:9,left:"50%",transform:"translateX(-50%)",width:76,height:20,background:"#000",borderRadius:10,zIndex:10 }} />
                <div className="dscr" ref={rDs[0]} style={{ opacity:1 }}>
                  <img src={SC.map} alt="Map" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top" }} />
                </div>
                <div className="dscr" ref={rDs[1]} style={{ opacity:0 }}>
                  <img src={SC.people} alt="People" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top" }} />
                </div>
                <div className="dscr" ref={rDs[2]} style={{ opacity:0 }}>
                  <img src={SC.spotDetail} alt="Spot" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top" }} />
                </div>
                <div className="dscr" ref={rDs[3]} style={{ opacity:0 }}>
                  <img src={SC.events} alt="Events" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="fsec">
        <p className="sey rv">Built for the community</p>
        <h2 className="stit rv d1">Everything<br />you need.<br /><span className="gl">Nothing</span> else.</h2>
        <div className="fg">
          {[
            ["📍","Closest Spots First","Parks sorted by live GPS. Find your nearest park in seconds."],
            ["📸","Real Photos","Know exactly what to expect. Every spot photographed by athletes who train there."],
            ["🟢","Live Check-ins","See who's training right now. Find the energy or the quiet session you need."],
            ["⭐","Equipment Ratings","Quality and variety scored per park. Know before you go."],
            ["🔥","Streak Tracking","Log sessions, build streaks, own your consistency."],
            ["🗓","Events & Trainers","Community sessions and personal trainers at your nearest spots."],
          ].map(([num,icon,title,desc],i) => (
            <div className={`fc rv ${i%3===1?"d1":i%3===2?"d2":""}`} key={num}>
              <div className="fn">{num}</div>
              <div className="fi">{icon}</div>
              <div className="ft">{title}</div>
              <p className="fd">{desc}</p>
            </div>
          ))}
        </div>
      </div>

     {/* VALUES */}
      <div className="vsec">
        <div className="rv">
          <p className="sey">Built different</p>
          <h2 className="stit" style={{ fontSize:"clamp(2.8rem,5.5vw,6rem)" }}>Simple<br />by design.</h2>
          <ul className="vl">
            {["Open and go instantly.","Zero ads.","Every spot hand-curated by real London athletes.","Lightweight on every device.","Free to download. Free to use. Always."].map(t => (
              <li key={t}><div className="vck">✓</div>{t}</li>
            ))}
          </ul>
        </div>
        <div className="vbig rv d2">
          <span className="vnum">5.0</span>
          <span className="vnl">App Store Rating</span>
          <span className="vnum2">0 ads</span>
          <span className="vnl">in the app. ever.</span>
        </div>
      </div>

      {/* CTA */}
      <div className="csec rv">
        <div className="cc" ref={rCc}>
          <h2 className="ch2">Your next<br />session<br />starts here.</h2>
          <p className="cp">Find your spot in seconds.</p>
          <a href={APP_STORE} className="cb" target="_blank" rel="noreferrer">Download on iOS</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="flk">
          <Link href="/privacy">Privacy Policy</Link>
          <a href="mailto:8mindltd@gmail.com">Contact</a>
          <a href={APP_STORE} target="_blank" rel="noreferrer">App Store</a>
          <a href="https://www.instagram.com/calispot.xyz/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@calispot.xyz" target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="fcp">© 2026 Tyrese Bewry · 8MIND LTD</div>
      </footer>
    </>
  );
}
