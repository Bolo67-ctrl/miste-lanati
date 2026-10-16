import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const scenes = [
  {start:0,end:120,title:"POUKISA LANMÈ A BLE?",sub:"Yon mistè lanati ou wè chak jou.",kind:"surface"},
  {start:120,end:330,title:"SE PA SÈLMAN SYÈL LA",sub:"Lanmè a pa jis yon glas pou syèl la.",kind:"dive"},
  {start:330,end:570,title:"LIMYÈ A GEN PLIZYÈ KOULÈ",sub:"Limyè solèy la pote tout koulè nou ka wè.",kind:"light"},
  {start:570,end:870,title:"DLO A ABSÒBE LIMYÈ",sub:"Dlo absòbe limyè wouj pi fasil pase ble.",kind:"deep"},
  {start:870,end:1170,title:"PWOfondè A CHANJE KOULÈ A",sub:"Sab, patikil ak òganis ka chanje sa je nou wè.",kind:"turquoise"},
  {start:1170,end:1500,title:"LANATI KACHE ANPIL SEKRÈ",sub:"Swiv Miste Lanati pou plis eksplikasyon.",kind:"surface"}
] as const;

const palettes: Record<string, string[]> = {
  surface:["#071a35","#087c9b","#54d6d0"],
  dive:["#04172c","#075b80","#1da6b5"],
  light:["#061a37","#075c91","#73d8ff"],
  deep:["#020914","#04365c","#0b80b4"],
  turquoise:["#062a43","#078c9b","#7ae6d3"]
};

export const OceanMystery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = scenes.find((s) => frame >= s.start && frame < s.end) ?? scenes[scenes.length - 1];
  const local = frame - scene.start;
  const duration = scene.end - scene.start;
  const fadeIn = interpolate(local,[0,18],[0,1],{extrapolateRight:"clamp"});
  const fadeOut = interpolate(local,[duration-18,duration],[1,0],{extrapolateLeft:"clamp"});
  const opacity = Math.min(fadeIn,fadeOut);
  const drift = Math.sin(frame/65)*28;
  const colors = palettes[scene.kind] ?? palettes.surface;
  const showTitle = scene.kind === "surface" && frame < 120;
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${colors[0]} 0%, ${colors[1]} 54%, ${colors[2]} 100%)`,color:"white",fontFamily:"Arial, Helvetica, sans-serif",overflow:"hidden"}}>
      <AbsoluteFill style={{opacity:0.25,backgroundImage:"radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.5), transparent 40%), repeating-linear-gradient(170deg, transparent 0px, transparent 70px, rgba(255,255,255,.09) 72px, transparent 76px)",transform:`translateY(${drift}px) scale(1.08)`}}/>
      {Array.from({length:8},(_,i)=><div key={i} style={{position:"absolute",left:`${7+i*13}%`,top:`${18+(i%4)*17}%`,width:4+i%3*3,height:100+(i%3)*70,background:"rgba(190,244,255,.18)",filter:"blur(8px)",transform:`rotate(12deg) translateY(${Math.sin(frame/38+i)*25}px)`}}/>)}
      <AbsoluteFill style={{justifyContent:"space-between",padding:"120px 72px 118px",opacity}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:26,letterSpacing:5,fontWeight:700}}>
          <span>MISTE LANATI</span><span style={{fontSize:20,letterSpacing:3,opacity:.8}}>01 / LANMÈ</span>
        </div>
        <div style={{maxWidth:900,marginTop:showTitle?0:180}}>
          <div style={{width:90,height:7,background:"#72f1dc",marginBottom:34,borderRadius:8}}/>
          <h1 style={{fontSize:showTitle?88:78,lineHeight:1.04,letterSpacing:-2,margin:0,fontWeight:900,textShadow:"0 6px 30px rgba(0,0,0,.28)"}}>{scene.title}</h1>
          <p style={{fontSize:38,lineHeight:1.35,maxWidth:850,fontWeight:500,marginTop:34,color:"rgba(255,255,255,.92)",textShadow:"0 3px 18px rgba(0,0,0,.3)"}}>{scene.sub}</p>
        </div>
        <div>
          <div style={{height:4,width:"100%",background:"rgba(255,255,255,.25)",borderRadius:8,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(frame/1500)*100}%`,background:"#72f1dc"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:21,letterSpacing:2,marginTop:22,opacity:.8}}>
            <span>DEKOUVRI SA KI KACHE</span><span>{Math.floor(frame/fps)}s</span>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:14,background:"linear-gradient(90deg,#72f1dc,#ffffff,#0b80b4)",opacity:.8}}/>
    </AbsoluteFill>
  );
};
