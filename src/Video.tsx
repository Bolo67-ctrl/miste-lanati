import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const WaveMark: React.FC<{size?: number}> = ({size = 92}) => (
  <div style={{width:size,height:size,border:"1px solid rgba(138,242,225,.8)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 45px rgba(55,216,207,.22)",background:"rgba(1,20,32,.24)"}}>
    <svg width={size*.64} height={size*.64} viewBox="0 0 60 60" fill="none">
      <path d="M5 35 C14 19, 22 19, 30 35 S46 51,55 35" stroke="#8AF2E1" strokeWidth="3" strokeLinecap="round"/>
      <path d="M5 24 C14 8, 22 8, 30 24 S46 40,55 24" stroke="white" strokeOpacity=".85" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = Math.sin(frame / 35) * 18;
  const glow = interpolate(frame, [0, 70, 600], [.18, .5, .2], clamp);
  const progress = frame / 600;
  const scene = frame < 165 ? "welcome" : frame < 390 ? "mission" : "invite";
  const sceneStart = scene === "welcome" ? 0 : scene === "mission" ? 165 : 390;
  const local = frame - sceneStart;
  const inOpacity = interpolate(local, [0, 20], [0, 1], clamp);
  const outStart = scene === "welcome" ? 145 : scene === "mission" ? 205 : 190;
  const outEnd = scene === "welcome" ? 165 : scene === "mission" ? 225 : 210;
  const outOpacity = interpolate(local, [outStart, outEnd], [1, 0], clamp);
  const opacity = Math.min(inOpacity, outOpacity);
  const lift = interpolate(local, [0, 24], [38, 0], clamp);
  const elapsed = Math.floor(frame / fps);
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
        {scene === "welcome" && <div style={{opacity,transform:`translateY(${lift}px)`,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
          <div style={{transform:`scale(${interpolate(frame,[0,35],[.72,1],clamp)})`,marginBottom:36}}><WaveMark size={108}/></div>
          <div style={{fontSize:23,fontWeight:700,letterSpacing:7,color:"#9af4e5",marginBottom:22}}>BYENVINI SOU</div>
          <h1 style={{fontSize:88,lineHeight:1.02,letterSpacing:-2,fontWeight:900,margin:0,textShadow:"0 10px 38px rgba(0,0,0,.5)"}}>MISTÈ<br/>LANATI</h1>
          <div style={{height:3,width:interpolate(frame,[35,75],[0,120],clamp),background:"#8af2e1",margin:"34px auto 25px"}}/>
          <div style={{fontSize:23,letterSpacing:4,color:"rgba(255,255,255,.83)"}}>SEKRE KI KACHE NAN LANATI</div>
        </div>}
        {scene === "mission" && <div style={{opacity,transform:`translateY(${lift}px)`,maxWidth:900}}>
          <div style={{margin:"0 auto 35px",display:"flex",justifyContent:"center"}}><WaveMark size={78}/></div>
          <div style={{fontSize:19,fontWeight:700,letterSpacing:5,color:"#9af4e5",marginBottom:25}}>MISYON NOU</div>
          <h2 style={{fontSize:57,lineHeight:1.1,fontWeight:900,letterSpacing:-1,margin:"0 0 28px"}}>LANATI GEN ANPIL SEKRÈ.</h2>
          <p style={{fontSize:33,lineHeight:1.45,color:"rgba(255,255,255,.9)",margin:0}}>Nou eksplore mistè sa yo, dekouvri sa syans di, epi aprann bagay ki ka fè w wè mond lan yon lòt jan.</p>
        </div>}
        {scene === "invite" && <div style={{opacity,transform:`translateY(${lift}px)`,display:"flex",flexDirection:"column",alignItems:"center",maxWidth:900}}>
          <div style={{marginBottom:30}}><WaveMark size={86}/></div>
          <h2 style={{fontSize:59,lineHeight:1.12,fontWeight:900,margin:"0 0 24px"}}>ANN DEKOUVRI YO ANSANM.</h2>
          <p style={{fontSize:30,lineHeight:1.4,color:"rgba(255,255,255,.86)",margin:"0 0 35px"}}>Si w renmen aprann bagay nouvo, ou nan bon plas la.</p>
          <div style={{padding:"17px 30px",border:"1px solid rgba(138,242,225,.85)",borderRadius:6,background:"rgba(4,38,51,.48)",fontSize:22,fontWeight:800,letterSpacing:4,color:"#a4f6e8"}}>SWIV MISTÈ LANATI</div>
          <div style={{fontSize:18,letterSpacing:3,color:"rgba(255,255,255,.66)",marginTop:36}}>LANATI GEN SEKRÈ…</div>
        </div>}
      </AbsoluteFill>
      <div style={{position:"absolute",left:72,right:72,bottom:57}}>
        <div style={{height:3,background:"rgba(255,255,255,.18)",overflow:"hidden"}}><div style={{height:"100%",width:`${progress*100}%`,background:"linear-gradient(90deg,#8af2e1,#fff,#0a829c)"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:14,letterSpacing:3,marginTop:17,color:"rgba(255,255,255,.58)"}}><span>MISTÈ LANATI</span><span>00:{String(elapsed).padStart(2,"0")}</span></div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:5,background:"linear-gradient(90deg,#8af2e1,#fff,#0a829c)",opacity:.9}}/>
    </AbsoluteFill>
  );
};

const scenes = [
  {start:0,end:120,title:"POUKISA LANMÈ A BLE?",sub:"Yon mistè lanati ou wè chak jou.",kind:"surface",chapter:"01"},
  {start:120,end:330,title:"SE PA SÈLMAN SYÈL LA",sub:"Lanmè a pa jis yon glas pou syèl la.",kind:"dive",chapter:"02"},
  {start:330,end:570,title:"LIMYÈ A GEN PLIZYÈ KOULÈ",sub:"Limyè solèy la pote tout koulè nou ka wè.",kind:"light",chapter:"03"},
  {start:570,end:870,title:"DLO A ABSÒBE LIMYÈ",sub:"Dlo absòbe limyè wouj pi fasil pase ble.",kind:"deep",chapter:"04"},
  {start:870,end:1170,title:"PWOFONDÈ A CHANJE KOULÈ A",sub:"Sab, patikil ak òganis ka chanje sa je nou wè.",kind:"turquoise",chapter:"05"},
  {start:1170,end:1500,title:"LANATI KACHE ANPIL SEKRÈ",sub:"Swiv Mistè Lanati pou plis eksplikasyon.",kind:"surface",chapter:"06"}
] as const;

const palettes: Record<string,string[]> = {
  surface:["#03101e","#07516e","#16a5a7"], dive:["#020b18","#063d5b","#0d8294"],
  light:["#031326","#064d78","#65cfe3"], deep:["#010711","#022b4a","#087aa2"],
  turquoise:["#021b2a","#067c88","#62d8c4"]
};

const OceanEpisode: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = scenes.find((s)=>frame>=s.start && frame<s.end) ?? scenes[scenes.length-1];
  const local = frame-scene.start;
  const duration = scene.end-scene.start;
  const fadeIn = interpolate(local,[0,20],[0,1],clamp);
  const fadeOut = interpolate(local,[duration-18,duration],[1,0],clamp);
  const sceneOpacity = Math.min(fadeIn,fadeOut);
  const colors = palettes[scene.kind] ?? palettes.surface;
  const scale = interpolate(frame,[0,1500],[1.12,1.02],clamp);
  const drift = Math.sin(frame/75)*24;
  const titleLines = scene.title === "POUKISA LANMÈ A BLE?" ? ["POUKISA LANMÈ","A BLE?"] : [scene.title];
  const elapsed = Math.floor(frame/fps);
  return <AbsoluteFill style={{background:colors[0],color:"white",fontFamily:"Arial, Helvetica, sans-serif",overflow:"hidden"}}>
    <AbsoluteFill style={{background:`linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 52%, ${colors[2]} 100%)`,transform:`scale(${scale}) translateY(${drift}px)`}}/>
    <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 35%, rgba(100,225,235,.28), transparent 42%), linear-gradient(180deg, rgba(0,0,0,.08), transparent 30%, rgba(0,0,0,.72))"}}/>
    <AbsoluteFill style={{opacity:.42,backgroundImage:"repeating-linear-gradient(168deg, transparent 0px, transparent 92px, rgba(196,246,255,.12) 94px, transparent 98px)",transform:`translateY(${Math.sin(frame/35)*22}px)`}}/>
    {Array.from({length:16},(_,i)=>{const x=(i*67+13)%100;const rise=(frame*(.35+(i%4)*.12)+i*83)%1150;return <div key={i} style={{position:"absolute",left:`${x}%`,top:`${100-rise/11.5}%`,width:3+(i%3)*2,height:3+(i%3)*2,border:"1px solid rgba(213,252,255,.38)",borderRadius:"50%",opacity:.15+(i%5)*.09,boxShadow:"0 0 12px rgba(110,230,255,.3)"}}/>;})}
    <AbsoluteFill style={{opacity:sceneOpacity,padding:"95px 70px 105px",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:35,height:35,border:"1px solid #8af2e1",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#8af2e1",fontSize:17}}>≈</div><span style={{fontSize:21,fontWeight:800,letterSpacing:4}}>MISTÈ LANATI</span></div>
        <span style={{fontSize:17,letterSpacing:3,color:"#a8e9e8"}}>{scene.chapter} / 06</span>
      </div>
      <div style={{transform:`translateY(${interpolate(local,[0,22],[36,0],clamp)}px)`,maxWidth:920}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:30}}><div style={{height:3,width:54,background:"#8af2e1"}}/><span style={{fontSize:18,fontWeight:700,letterSpacing:4,color:"#a8e9e8"}}>SEKRE LANATI</span></div>
        <h2 style={{fontSize:scene.title.length>23?66:78,lineHeight:1.04,letterSpacing:-2,fontWeight:900,margin:0,textShadow:"0 6px 28px rgba(0,0,0,.45)"}}>{titleLines.map((line,i)=><div key={i}>{line}</div>)}</h2>
        <div style={{height:1,width:"100%",background:"rgba(255,255,255,.23)",marginTop:32,marginBottom:26}}/>
        <p style={{fontSize:35,lineHeight:1.36,fontWeight:500,margin:0,color:"rgba(255,255,255,.93)",textShadow:"0 3px 18px rgba(0,0,0,.35)"}}>{scene.sub}</p>
      </div>
      <div><div style={{height:3,width:"100%",background:"rgba(255,255,255,.2)",overflow:"hidden"}}><div style={{height:"100%",width:`${frame/1500*100}%`,background:"#8af2e1"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:15,letterSpacing:3,marginTop:20,color:"rgba(255,255,255,.65)"}}><span>DEKOUVRI SA KI KACHE</span><span>{String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}</span></div>
      </div>
    </AbsoluteFill>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:5,background:"linear-gradient(90deg,#8af2e1,#ffffff,#0a829c)",opacity:.85}}/>
  </AbsoluteFill>;
};

export const OceanMystery: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={600}><Intro/></Sequence>
    <Sequence from={600} durationInFrames={1500}><OceanEpisode/></Sequence>
  </AbsoluteFill>
);
