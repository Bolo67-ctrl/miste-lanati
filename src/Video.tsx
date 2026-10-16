import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const WaveMark: React.FC<{size?: number}> = ({size = 92}) => (
  <div style={{width:size,height:size,border:"1px solid rgba(138,242,225,.8)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 45px rgba(55,216,207,.22)",background:"rgba(1,20,32,.24)"}}>
    <svg width={size*.64} height={size*.64} viewBox="0 0 60 60" fill="none">
      <path d="M5 35 C14 19, 22 19, 30 35 S46 51,55 35" stroke="#8AF2E1" strokeWidth="3" strokeLinecap="round"/>
      <path d="M5 24 C14 8, 22 8, 30 24 S46 40,55 24" stroke="white" strokeOpacity=".85" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

export const OceanMystery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = frame / 600;
  const drift = Math.sin(frame / 35) * 18;
  const glow = interpolate(frame, [0, 70, 600], [.18, .5, .2], clamp);
  const elapsed = Math.floor(frame / fps);

  const scene = frame < 165 ? "welcome" : frame < 390 ? "mission" : "invite";
  const sceneStart = scene === "welcome" ? 0 : scene === "mission" ? 165 : 390;
  const local = frame - sceneStart;
  const inOpacity = interpolate(local, [0, 20], [0, 1], clamp);
  const outOpacity = interpolate(local, [scene === "welcome" ? 145 : scene === "mission" ? 205 : 190, scene === "welcome" ? 165 : scene === "mission" ? 225 : 210], [1, 0], clamp);
  const opacity = Math.min(inOpacity, outOpacity);
  const lift = interpolate(local, [0, 24], [38, 0], clamp);

  return (
    <AbsoluteFill style={{background:"#020b17",color:"white",fontFamily:"Arial, Helvetica, sans-serif",overflow:"hidden"}}>
      <AbsoluteFill style={{background:"linear-gradient(155deg,#020b17 0%,#05283e 42%,#087b88 100%)",transform:`scale(1.12) translateY(${drift}px)`}}/>
      <AbsoluteFill style={{background:`radial-gradient(ellipse at 50% 32%, rgba(85,230,221,${glow}) 0%, transparent 42%), linear-gradient(180deg,rgba(0,0,0,.04) 0%,rgba(0,0,0,.22) 48%,rgba(0,0,0,.8) 100%)`}}/>
      <AbsoluteFill style={{opacity:.32,backgroundImage:"repeating-linear-gradient(168deg,transparent 0px,transparent 96px,rgba(196,246,255,.13) 98px,transparent 102px)",transform:`translateY(${Math.sin(frame/28)*20}px)`}}/>
      {Array.from({length:24},(_,i)=>{
        const x = (i*43+11)%100;
        const rise = (frame*(.28+(i%4)*.1)+i*97)%1250;
        const size = 3+(i%3)*3;
        return <div key={i} style={{position:"absolute",left:`${x}%`,top:`${100-rise/12.5}%`,width:size,height:size,border:"1px solid rgba(213,252,255,.45)",borderRadius:"50%",opacity:.12+(i%5)*.08,boxShadow:"0 0 14px rgba(110,230,255,.35)"}}/>;
      })}
      <AbsoluteFill style={{padding:"110px 72px 92px",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        {scene === "welcome" && (
          <div style={{opacity,transform:`translateY(${lift}px)`,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
            <div style={{transform:`scale(${interpolate(frame,[0,35],[.72,1],clamp)})`,marginBottom:36}}><WaveMark size={108}/></div>
            <div style={{fontSize:23,fontWeight:700,letterSpacing:7,color:"#9af4e5",marginBottom:22}}>BYENVINI SOU</div>
            <h1 style={{fontSize:88,lineHeight:1.02,letterSpacing:-2,fontWeight:900,margin:0,textShadow:"0 10px 38px rgba(0,0,0,.5)"}}>MISTÈ<br/>LANATI</h1>
            <div style={{height:3,width:interpolate(frame,[35,75],[0,120],clamp),background:"#8af2e1",margin:"34px auto 25px"}}/>
            <div style={{fontSize:23,letterSpacing:4,color:"rgba(255,255,255,.83)"}}>SEKRE KI KACHE NAN LANATI</div>
          </div>
        )}
        {scene === "mission" && (
          <div style={{opacity,transform:`translateY(${lift}px)`,maxWidth:900}}>
            <div style={{margin:"0 auto 35px",display:"flex",justifyContent:"center"}}><WaveMark size={78}/></div>
            <div style={{fontSize:19,fontWeight:700,letterSpacing:5,color:"#9af4e5",marginBottom:25}}>MISYON NOU</div>
            <h2 style={{fontSize:57,lineHeight:1.1,fontWeight:900,letterSpacing:-1,margin:"0 0 28px"}}>LANATI GEN ANPIL SEKRÈ.</h2>
            <p style={{fontSize:33,lineHeight:1.45,color:"rgba(255,255,255,.9)",margin:0}}>Nou eksplore mistè sa yo, dekouvri sa syans di, epi aprann bagay ki ka fè w wè mond lan yon lòt jan.</p>
          </div>
        )}
        {scene === "invite" && (
          <div style={{opacity,transform:`translateY(${lift}px)`,display:"flex",flexDirection:"column",alignItems:"center",maxWidth:900}}>
            <div style={{marginBottom:30}}><WaveMark size={86}/></div>
            <h2 style={{fontSize:59,lineHeight:1.12,fontWeight:900,margin:"0 0 24px"}}>ANN DEKOUVRI YO ANSANM.</h2>
            <p style={{fontSize:30,lineHeight:1.4,color:"rgba(255,255,255,.86)",margin:"0 0 35px"}}>Si w renmen aprann bagay nouvo, ou nan bon plas la.</p>
            <div style={{padding:"17px 30px",border:"1px solid rgba(138,242,225,.85)",borderRadius:6,background:"rgba(4,38,51,.48)",fontSize:22,fontWeight:800,letterSpacing:4,color:"#a4f6e8"}}>SWIV MISTÈ LANATI</div>
            <div style={{fontSize:18,letterSpacing:3,color:"rgba(255,255,255,.66)",marginTop:36}}>LANATI GEN SEKRÈ…</div>
          </div>
        )}
      </AbsoluteFill>
      <div style={{position:"absolute",left:72,right:72,bottom:57}}>
        <div style={{height:3,background:"rgba(255,255,255,.18)",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress*100}%`,background:"linear-gradient(90deg,#8af2e1,#fff,#0a829c)"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:14,letterSpacing:3,marginTop:17,color:"rgba(255,255,255,.58)"}}>
          <span>MISTÈ LANATI</span><span>00:{String(elapsed).padStart(2,"0")}</span>
        </div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:5,background:"linear-gradient(90deg,#8af2e1,#fff,#0a829c)",opacity:.9}}/>
    </AbsoluteFill>
  );
};
