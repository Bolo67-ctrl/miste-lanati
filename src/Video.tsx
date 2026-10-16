import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const scenes = [
  {start:0,end:120,title:"POUKISA LANMÈ A BLE?",sub:"Yon mistè lanati ou wè chak jou.",kind:"surface",chapter:"01"},
  {start:120,end:330,title:"SE PA SÈLMAN SYÈL LA",sub:"Lanmè a pa jis yon glas pou syèl la.",kind:"dive",chapter:"02"},
  {start:330,end:570,title:"LIMYÈ A GEN PLIZYÈ KOULÈ",sub:"Limyè solèy la pote tout koulè nou ka wè.",kind:"light",chapter:"03"},
  {start:570,end:870,title:"DLO A ABSÒBE LIMYÈ",sub:"Dlo absòbe limyè wouj pi fasil pase ble.",kind:"deep",chapter:"04"},
  {start:870,end:1170,title:"PWOFONDÈ A CHANJE KOULÈ A",sub:"Sab, patikil ak òganis ka chanje sa je nou wè.",kind:"turquoise",chapter:"05"},
  {start:1170,end:1500,title:"LANATI KACHE ANPIL SEKRÈ",sub:"Swiv Miste Lanati pou plis eksplikasyon.",kind:"surface",chapter:"06"}
] as const;

const palettes: Record<string, string[]> = {
  surface:["#03101e","#07516e","#16a5a7"],
  dive:["#020b18","#063d5b","#0d8294"],
  light:["#031326","#064d78","#65cfe3"],
  deep:["#010711","#022b4a","#087aa2"],
  turquoise:["#021b2a","#067c88","#62d8c4"]
};

const clamp = {extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};

export const OceanMystery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = scenes.find((s) => frame >= s.start && frame < s.end) ?? scenes[scenes.length - 1];
  const local = frame - scene.start;
  const duration = scene.end - scene.start;
  const fadeIn = interpolate(local,[0,20],[0,1],clamp);
  const fadeOut = interpolate(local,[duration-18,duration],[1,0],clamp);
  const sceneOpacity = Math.min(fadeIn,fadeOut);
  const colors = palettes[scene.kind] ?? palettes.surface;
  const intro = frame < 120;
  const logoProgress = interpolate(frame,[5,38],[0,1],clamp);
  const titleProgress = interpolate(frame,[32,72],[0,1],clamp);
  const titleY = interpolate(frame,[32,72],[70,0],clamp);
  const scale = interpolate(frame,[0,1500],[1.12,1.02],clamp);
  const drift = Math.sin(frame/75)*24;
  const titleLines = scene.title === "POUKISA LANMÈ A BLE?" ? ["POUKISA LANMÈ","A BLE?"] : [scene.title];
  const elapsed = Math.floor(frame/fps);
  return (
    <AbsoluteFill style={{background:colors[0],color:"white",fontFamily:"Arial, Helvetica, sans-serif",overflow:"hidden"}}>
      <AbsoluteFill style={{background:`linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 52%, ${colors[2]} 100%)`,transform:`scale(${scale}) translateY(${drift}px)`}}/>
      <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 35%, rgba(100,225,235,.28), transparent 42%), linear-gradient(180deg, rgba(0,0,0,.08), transparent 30%, rgba(0,0,0,.72))"}}/>
      <AbsoluteFill style={{opacity:.42,backgroundImage:"repeating-linear-gradient(168deg, transparent 0px, transparent 92px, rgba(196,246,255,.12) 94px, transparent 98px)",transform:`translateY(${Math.sin(frame/35)*22}px)`}}/>
      {Array.from({length:16},(_,i)=>{
        const x = (i*67+13)%100;
        const y = (i*41+7)%100;
        const rise = (frame*(0.35+(i%4)*0.12)+i*83)%1150;
        return <div key={i} style={{position:"absolute",left:`${x}%`,top:`${100-rise/11.5}%`,width:3+(i%3)*2,height:3+(i%3)*2,border:"1px solid rgba(213,252,255,.38)",borderRadius:"50%",opacity:.15+(i%5)*.09,boxShadow:"0 0 12px rgba(110,230,255,.3)"}}/>;
      })}
      {intro ? (
        <AbsoluteFill style={{justifyContent:"center",alignItems:"center",textAlign:"center",padding:"100px 64px"}}>
          <div style={{opacity:logoProgress,transform:`translateY(${interpolate(frame,[5,38],[24,0],clamp)}px)`,display:"flex",alignItems:"center",flexDirection:"column",gap:18,marginBottom:56}}>
            <div style={{width:74,height:74,border:"1px solid rgba(147,246,235,.85)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 44px rgba(55,216,207,.22)"}}>
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none"><path d="M4 25 C11 13, 17 13, 23 25 S35 37,42 25" stroke="#8AF2E1" strokeWidth="2.5" strokeLinecap="round"/><path d="M4 17 C11 5, 17 5, 23 17 S35 29,42 17" stroke="white" strokeOpacity=".7" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </div>
            <div style={{fontSize:27,fontWeight:800,letterSpacing:8}}>MISTE LANATI</div>
            <div style={{fontSize:15,letterSpacing:5,color:"#8af2e1"}}>DEKOUVRI SA KI KACHE</div>
          </div>
          <div style={{opacity:titleProgress,transform:`translateY(${titleY}px)`,width:"100%"}}>
            <div style={{height:2,width:interpolate(frame,[35,75],[0,110],clamp),background:"#8af2e1",margin:"0 auto 30px"}}/>
            <div style={{fontSize:21,letterSpacing:6,color:"#a8e9e8",fontWeight:700,marginBottom:24}}>EPIZÒD 01  •  LANMÈ</div>
            <h1 style={{fontSize:91,lineHeight:.98,letterSpacing:-3,fontWeight:900,margin:0,textShadow:"0 10px 38px rgba(0,0,0,.5)"}}>{titleLines.map((line,i)=><div key={i}>{line}</div>)}</h1>
            <p style={{fontSize:28,lineHeight:1.4,letterSpacing:.4,color:"rgba(255,255,255,.82)",marginTop:30}}>Repons lan pi fon pase sa ou panse.</p>
          </div>
          <div style={{position:"absolute",bottom:100,left:0,right:0,fontSize:15,letterSpacing:4,color:"rgba(255,255,255,.56)",opacity:logoProgress}}>NATI A GEN ANPIL SEKRÈ</div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{opacity:sceneOpacity,padding:"95px 70px 105px",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:35,height:35,border:"1px solid #8af2e1",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#8af2e1",fontSize:17}}>≈</div>
              <span style={{fontSize:21,fontWeight:800,letterSpacing:4}}>MISTE LANATI</span>
            </div>
            <span style={{fontSize:17,letterSpacing:3,color:"#a8e9e8"}}>{scene.chapter} / 06</span>
          </div>
          <div style={{transform:`translateY(${interpolate(local,[0,22],[36,0],clamp)}px)`,maxWidth:920}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:30}}>
              <div style={{height:3,width:54,background:"#8af2e1"}}/>
              <span style={{fontSize:18,fontWeight:700,letterSpacing:4,color:"#a8e9e8"}}>SEKRE LANATI</span>
            </div>
            <h2 style={{fontSize:scene.title.length>23?66:78,lineHeight:1.04,letterSpacing:-2,fontWeight:900,margin:0,textShadow:"0 6px 28px rgba(0,0,0,.45)"}}>{scene.title}</h2>
            <div style={{height:1,width:"100%",background:"rgba(255,255,255,.23)",marginTop:32,marginBottom:26}}/>
            <p style={{fontSize:35,lineHeight:1.36,fontWeight:500,margin:0,color:"rgba(255,255,255,.93)",textShadow:"0 3px 18px rgba(0,0,0,.35)"}}>{scene.sub}</p>
          </div>
          <div>
            <div style={{height:3,width:"100%",background:"rgba(255,255,255,.2)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${frame/1500*100}%`,background:"#8af2e1"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:15,letterSpacing:3,marginTop:20,color:"rgba(255,255,255,.65)"}}>
              <span>DEKOUVRI SA KI KACHE</span><span>{String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:5,background:"linear-gradient(90deg,#8af2e1,#ffffff,#0a829c)",opacity:.85}}/>
    </AbsoluteFill>
  );
};
