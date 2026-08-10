import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════
const CFG_BASE = {
  owner: "Alberto Tomás Guambe",
  emola: "879937763",
  mpesa: "",
  adminUser: "alberto",
  adminPass: "MzPrediz@2026",
};

const CATS = ["Política","Economia","Desporto","Social","Saúde","Tecnologia","Educação","Justiça","Ambiente","Cultura"];
const CAT_I = {Política:"🏛️",Economia:"📊",Desporto:"⚽",Social:"👥",Saúde:"🏥",Tecnologia:"💻",Educação:"📚",Justiça:"⚖️",Ambiente:"🌿",Cultura:"🎭"};
const CAT_C = {Política:"#FFC700",Economia:"#00E676",Desporto:"#00C2FF",Social:"#B388FF",Saúde:"#3DFFC2",Tecnologia:"#FF8A4C",Educação:"#FFE066",Justiça:"#FFC700",Ambiente:"#5FFF8F",Cultura:"#FF6B9D"};

const MERCADOS_BASE = [
  {id:1, cat:"Justiça",    q:"Nyusi vai ser julgado pelas dívidas ocultas antes de 2027?",               emoji:"⚖️", prazo:"31 Dez 2026",sim:3420,nao:1180,destaque:true, status:"aberto",criado:"2026-01-10",vol:[800,1100,1600,2200,2800,3420],met:"Análise de processos judiciais em curso e precedentes internacionais.",fontes:"@Verdade, CIP Moçambique, Amnesty International"},
  {id:2, cat:"Desporto",   q:"Black Bulls vai ganhar o título nacional de futebol 2026?",                emoji:"⚽", prazo:"30 Nov 2026",sim:2100,nao:2900,destaque:false,status:"aberto",criado:"2026-02-01",vol:[400,900,1500,2100],met:"Análise das últimas 5 épocas e forma actual.",fontes:"FMF, Desafio News"},
  {id:3, cat:"Política",   q:"Mondlane vai ser reconhecido oficialmente como presidente eleito?",         emoji:"🗳️",prazo:"15 Out 2026",sim:5800,nao:1200,destaque:true, status:"aberto",criado:"2026-01-05",vol:[500,1800,3800,5800],met:"Acompanhamento dos recursos eleitorais e posição da SADC.",fontes:"CNE, SADC, União Africana"},
  {id:4, cat:"Economia",   q:"O metical vai valorizar face ao rand em 2026?",                            emoji:"💱", prazo:"31 Dez 2026",sim:980, nao:2300,destaque:false,status:"aberto",criado:"2026-02-15",vol:[200,500,800,980], met:"Análise das reservas do BM e balança comercial.",fontes:"Banco de Moçambique, INE, Reuters"},
  {id:5, cat:"Política",   q:"Moçambique vai ter eleições autárquicas livres e justas em 2026?",         emoji:"🏛️",prazo:"30 Nov 2026",sim:890, nao:4100,destaque:true, status:"aberto",criado:"2026-03-20",vol:[150,400,650,890], met:"Histórico eleitoral e missões de observação previstas.",fontes:"CNE, STAE, EU EOM"},
  {id:6, cat:"Economia",   q:"O gás de Cabo Delgado vai ser explorado em larga escala antes de 2028?",  emoji:"⛽", prazo:"31 Dez 2027",sim:1500,nao:900, destaque:true, status:"aberto",criado:"2026-03-10",vol:[300,700,1100,1500],met:"Cronograma TotalEnergies e segurança em Cabo Delgado.",fontes:"TotalEnergies, ENH, Banco Mundial"},
  {id:7, cat:"Desporto",   q:"Moçambique vai qualificar para a CAN 2027?",                              emoji:"🏆", prazo:"30 Jun 2026",sim:4200,nao:2100,destaque:false,status:"aberto",criado:"2026-02-20",vol:[600,1500,2800,4200],met:"Análise do ranking CAF e jogos restantes.",fontes:"CAF, FMF"},
  {id:8, cat:"Economia",   q:"A inflação em Moçambique vai superar os 15% em 2026?",                    emoji:"📈", prazo:"31 Dez 2026",sim:1100,nao:3200,destaque:false,status:"aberto",criado:"2026-03-05",vol:[200,600,950,1100],met:"Histórico INE e política do Banco de Moçambique.",fontes:"INE, BM, FMI"},
  {id:9, cat:"Tecnologia", q:"Moçambique vai atingir 50% de cobertura de internet antes de 2028?",      emoji:"🌐", prazo:"31 Dez 2027",sim:2200,nao:1800,destaque:false,status:"aberto",criado:"2026-03-15",vol:[300,900,1600,2200],met:"Planos de expansão das operadoras e FSTIC.",fontes:"INCM, Vodacom MZ"},
  {id:10,cat:"Política",   q:"Vai haver um novo partido político relevante em Moçambique até 2027?",    emoji:"🏛️",prazo:"31 Dez 2027",sim:2800,nao:1900,destaque:false,status:"aberto",criado:"2026-04-01",vol:[400,900,1600,2800],met:"Análise do contexto político e fragmentação partidária.",fontes:"CNE, jornais nacionais"},
  {id:11,cat:"Saúde",      q:"Moçambique vai eliminar a malária como ameaça pública antes de 2030?",    emoji:"🦟", prazo:"31 Dez 2029",sim:1800,nao:2600,destaque:false,status:"aberto",criado:"2026-04-01",vol:[300,800,1400,1800],met:"Programas MISAU e cobertura de mosquiteiros.",fontes:"MISAU, OMS"},
  {id:12,cat:"Educação",   q:"A taxa de alfabetização em Moçambique vai superar 70% até 2028?",         emoji:"📚", prazo:"31 Dez 2028",sim:2400,nao:1600,destaque:false,status:"aberto",criado:"2026-04-05",vol:[400,1000,1800,2400],met:"Projecção com dados INE e MINEDH.",fontes:"MINEDH, INE, UNESCO"},
];

const PART_BASE = [
  {id:"MZP-1-SIM-A3F2",user:"João Macuácua",   val:500, lado:"sim",mId:1,status:"pendente",  met:"e-Mola",hora:"14:32",data:"2026-06-01"},
  {id:"MZP-3-NAO-B7K1",user:"Ana Cossa",        val:250, lado:"nao",mId:3,status:"pendente",  met:"e-Mola",hora:"14:45",data:"2026-06-01"},
  {id:"MZP-2-SIM-C9P4",user:"Carlos Fumo",      val:1000,lado:"sim",mId:2,status:"confirmado",met:"e-Mola",hora:"13:10",data:"2026-05-31"},
  {id:"MZP-7-SIM-D2R6",user:"Fátima Nhantumbo", val:300, lado:"sim",mId:7,status:"confirmado",met:"e-Mola",hora:"11:55",data:"2026-05-31"},
  {id:"MZP-6-NAO-E4T8",user:"Pedro Sitoe",      val:750, lado:"nao",mId:6,status:"pendente",  met:"e-Mola",hora:"15:20",data:"2026-06-01"},
];

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════
const fmt   = n => Number(n||0).toLocaleString("pt-MZ");
const pct   = (a,b) => (!a&&!b)?50:Math.round((a/(a+b))*100);
const multX = (me,ot,taxa) => !me?1.50:parseFloat(((me+ot*(1-taxa/100))/me).toFixed(2));
const mkRef = (mid,s) => `MZP-${mid}-${s.toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
const agora = () => new Date().toLocaleTimeString("pt",{hour:"2-digit",minute:"2-digit"});
const hoje  = () => new Date().toISOString().slice(0,10);

// ═══════════════════════════════════════════════════════════
// DESIGN SYSTEM — "Capulana Digital"
// ═══════════════════════════════════════════════════════════
const P = {
  bgVoid:"#05080A", bgDeep:"#0A1410", bgPanel:"#0F1B15",
  esmeralda:"#00E676", esmeraldaD:"#00A859", esmeraldaXD:"#006B3C",
  ouro:"#FFC700", ouroD:"#E0A800", ouroBrilho:"#FFE066",
  terracota:"#E8703A", terracotaD:"#C4541F",
  rubi:"#FF3B5C", rubiD:"#C41E3A",
  textoP:"#F5F0E1", textoS:"#8FA89A", textoM:"#3D5247",
  borda:"rgba(0,230,118,0.16)", bordaOuro:"rgba(255,199,0,0.22)",
};
const F = { display:"'Georgia',serif", body:"system-ui,'Segoe UI',sans-serif", mono:"'Courier New',monospace" };

const INP = {width:"100%",padding:"12px 15px",borderRadius:11,boxSizing:"border-box",background:"rgba(0,230,118,0.05)",border:`1px solid ${P.borda}`,color:P.textoP,fontSize:14,outline:"none",fontFamily:F.display};
const LBL = {display:"block",fontSize:10,letterSpacing:1.6,color:P.textoS,fontWeight:700,marginBottom:7,fontFamily:F.body,textTransform:"uppercase"};

// ═══════════════════════════════════════════════════════════
// ÁTOMOS — com brilho real (glow, gradientes, animação)
// ═══════════════════════════════════════════════════════════
const Badge = ({cor,children,glow=false}) => (
  <span style={{fontSize:9.5,fontWeight:800,letterSpacing:1,color:cor,background:`${cor}1A`,padding:"4px 10px",borderRadius:20,border:`1px solid ${cor}40`,fontFamily:F.body,whiteSpace:"nowrap",boxShadow:glow?`0 0 12px ${cor}40`:"none"}}>{children}</span>
);

const Toast = ({msg}) => msg ? (
  <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,color:"#04140A",padding:"13px 28px",borderRadius:16,fontWeight:800,fontSize:14,zIndex:9999,boxShadow:`0 8px 50px ${P.esmeralda}55, 0 0 0 1px ${P.esmeralda}40`,whiteSpace:"nowrap",fontFamily:F.body,animation:"slideUp .3s ease"}}>{msg}</div>
) : null;

// Notificação de resultado — aparece quando um mercado é resolvido
const NotificacaoResultado = ({notifs, fechar}) => {
  if(!notifs||notifs.length===0) return null;
  return (
    <div style={{position:"fixed",top:80,right:16,zIndex:900,display:"flex",flexDirection:"column",gap:10,maxWidth:320}}>
      {notifs.map((n,i)=>(
        <div key={i} style={{background:`linear-gradient(135deg,${P.bgPanel},${P.bgDeep})`,border:`1px solid ${n.venc==="sim"?P.esmeralda:P.rubi}50`,borderRadius:16,padding:"16px 18px",boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)`,animation:"popIn .3s ease",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"16px 16px 0 0",background:n.venc==="sim"?P.esmeralda:P.rubi}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <div style={{fontSize:11,color:P.textoS,fontFamily:F.body,marginBottom:5,letterSpacing:.5}}>🔔 RESULTADO PUBLICADO</div>
              <p style={{fontSize:13,color:P.textoP,margin:"0 0 8px",lineHeight:1.4,fontFamily:F.display}}>{n.q?.slice(0,70)}{n.q?.length>70?"…":""}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,background:n.venc==="sim"?`${P.esmeralda}18`:`${P.rubi}18`,padding:"6px 12px",borderRadius:10,border:`1px solid ${n.venc==="sim"?P.esmeralda:P.rubi}40`}}>
                <span style={{fontSize:16}}>{n.venc==="sim"?"✓":"✗"}</span>
                <span style={{fontSize:13,fontWeight:800,color:n.venc==="sim"?P.esmeralda:P.rubi,fontFamily:F.body}}>{n.venc==="sim"?"SIM GANHOU":"NÃO GANHOU"}</span>
              </div>
            </div>
            <button onClick={()=>fechar(i)} style={{background:"none",border:"none",color:P.textoS,cursor:"pointer",fontSize:16,padding:"0 0 0 8px",flexShrink:0}}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
};



const Overlay = ({children,fechar}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(2,5,3,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:800,backdropFilter:"blur(16px)",padding:14,animation:"fadeIn .2s ease"}} onClick={fechar}>
    <div onClick={e=>e.stopPropagation()} style={{background:`linear-gradient(165deg,${P.bgPanel},${P.bgDeep})`,border:`1px solid ${P.borda}`,borderRadius:24,padding:28,width:"100%",maxWidth:460,maxHeight:"93vh",overflowY:"auto",boxShadow:`0 30px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,230,118,0.08), inset 0 1px 0 rgba(255,255,255,0.03)`,animation:"popIn .25s ease"}}>{children}</div>
  </div>
);

const Btn = ({children,onClick,v="verde",largo=false,style={},off=false}) => {
  const bg={
    verde:`linear-gradient(135deg,${P.esmeraldaD},${P.esmeralda})`,
    ouro:`linear-gradient(135deg,${P.ouroD},${P.ouro})`,
    terracota:`linear-gradient(135deg,${P.terracotaD},${P.terracota})`,
    rubi:`linear-gradient(135deg,${P.rubiD},${P.rubi})`,
    ghost:"transparent",
    dark:"rgba(0,230,118,0.08)",
    sim:`linear-gradient(135deg,#0D8043,${P.esmeralda})`,
    nao:`linear-gradient(135deg,${P.rubiD},#FF5C7A)`,
  }[v];
  const col={verde:"#04140A",ouro:"#1A1200",terracota:"#fff",rubi:"#fff",ghost:P.textoS,dark:P.esmeralda,sim:"#04140A",nao:"#fff"}[v];
  const glowCol={verde:P.esmeralda,ouro:P.ouro,terracota:P.terracota,rubi:P.rubi,sim:P.esmeralda,nao:P.rubi}[v];
  return (
    <button onClick={onClick} disabled={off} style={{padding:"11px 20px",borderRadius:12,border:v==="ghost"?`1px solid rgba(255,255,255,0.08)`:"none",background:bg,color:col,fontWeight:800,fontSize:13,cursor:off?"not-allowed":"pointer",opacity:off?.4:1,fontFamily:F.body,width:largo?"100%":"auto",transition:"transform .15s, box-shadow .2s",boxShadow:v!=="ghost"&&v!=="dark"&&!off?`0 4px 20px ${glowCol}35`:"none",...style}}
      onMouseEnter={e=>{if(!off){e.currentTarget.style.transform="translateY(-1px) scale(1.01)";if(v!=="ghost"&&v!=="dark")e.currentTarget.style.boxShadow=`0 6px 28px ${glowCol}55`;}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";if(v!=="ghost"&&v!=="dark"&&!off)e.currentTarget.style.boxShadow=`0 4px 20px ${glowCol}35`;}}>
      {children}
    </button>
  );
};

const Toggle = ({on,mudar}) => (
  <div onClick={()=>mudar(!on)} style={{width:42,height:24,borderRadius:12,background:on?`linear-gradient(135deg,${P.esmeraldaD},${P.esmeralda})`:"rgba(255,255,255,0.08)",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0,boxShadow:on?`0 0 14px ${P.esmeralda}50`:"none"}}>
    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?21:3,transition:"left .25s cubic-bezier(.4,0,.2,1)",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
  </div>
);

const Box = ({children,style={},glow=false}) => (
  <div style={{background:"rgba(0,230,118,0.04)",border:`1px solid ${P.borda}`,borderRadius:18,padding:20,boxShadow:glow?`0 0 30px rgba(0,230,118,0.06), inset 0 1px 0 rgba(255,255,255,0.02)`:"inset 0 1px 0 rgba(255,255,255,0.02)",...style}}>{children}</div>
);

// Faixa decorativa — padrão geométrico inspirado em capulana, não a bandeira literal
const FaixaCapulana = () => (
  <div style={{height:5,background:`linear-gradient(90deg,${P.terracota} 0%,${P.ouro} 25%,${P.esmeralda} 50%,${P.ouro} 75%,${P.terracota} 100%)`,backgroundSize:"200% 100%",animation:"shimmer 8s linear infinite",flexShrink:0}}/>
);

const Spark = ({dados,cor}) => {
  if(!dados||dados.length<2) return null;
  const W=76,H=26,mn=Math.min(...dados),mx=Math.max(...dados),rng=mx-mn||1;
  const pts=dados.map((v,i)=>`${(i/(dados.length-1))*W},${H-((v-mn)/rng)*H*.8-H*.1}`).join(" ");
  const lastX=W, lastY=H-((dados[dados.length-1]-mn)/rng)*H*.8-H*.1;
  return (
    <svg width={W} height={H} style={{overflow:"visible"}}>
      <defs><linearGradient id={`sg-${cor.slice(1)}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={cor} stopOpacity="0.2"/><stop offset="100%" stopColor={cor} stopOpacity="1"/></linearGradient></defs>
      <polyline points={pts} fill="none" stroke={`url(#sg-${cor.slice(1)})`} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={lastX} cy={lastY} r="3" fill={cor} style={{filter:`drop-shadow(0 0 4px ${cor})`}}/>
    </svg>
  );
};

const BarraConsenso = ({sim,nao}) => {
  const s=pct(sim,nao);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,marginBottom:6,fontFamily:F.body,fontWeight:700}}>
        <span style={{color:P.esmeralda}}>✓ SIM {s}%</span>
        <span style={{color:P.rubi}}>{100-s}% NÃO ✗</span>
      </div>
      <div style={{height:9,borderRadius:5,background:"rgba(255,255,255,.05)",overflow:"hidden",display:"flex",boxShadow:"inset 0 1px 3px rgba(0,0,0,0.3)"}}>
        <div style={{width:`${s}%`,background:`linear-gradient(90deg,${P.esmeraldaXD},${P.esmeralda})`,transition:"width .6s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 10px ${P.esmeralda}60`}}/>
        <div style={{flex:1,background:`linear-gradient(90deg,${P.rubiD},${P.rubi})`,boxShadow:`0 0 10px ${P.rubi}50`}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:P.textoS,marginTop:5,fontFamily:F.body}}>
        <span>{fmt(sim)} pts</span><span>{fmt(nao)} pts</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODAL PARTICIPAR — modo BETA: gratuito ou por comprovativo
// Sem exigir pagamento real M-Pesa/e-Mola na fase de testes
// ═══════════════════════════════════════════════════════════
const ModalParticipar = ({m,lado,modoPagamento,emola,taxa,minVal,maxVal,fechar,concluir}) => {
  const [val,setVal]=useState(Math.max(minVal,100));
  const [nome,setNome]=useState("");
  const [contacto,setContacto]=useState("");
  const [passo,setPasso]=useState(1);
  const [ref]=useState(mkRef(m.id,lado));
  const me=lado==="sim"?m.sim:m.nao, ot=lado==="sim"?m.nao:m.sim;
  const mx=multX(me+val,ot,taxa), lucro=Math.round(val*mx)-val;
  const gratuito = modoPagamento==="gratuito";
  const ok = nome.trim().length>1 && val>=minVal && val<=maxVal;
  const corLado = lado==="sim"?P.esmeralda:P.rubi;

  return (
    <Overlay fechar={fechar}>
      {passo===1?(
        <>
          <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:28}}>{m.emoji}</span>
            <div>
              <h3 style={{color:corLado,margin:0,fontSize:17,fontFamily:F.display}}>Participar — {lado==="sim"?"✓ SIM":"✗ NÃO"}</h3>
              <p style={{color:P.textoS,fontSize:10,margin:0,fontFamily:F.body,letterSpacing:.5}}>PREVISÃO DE MERCADO · MZPREDIZ 🇲🇿</p>
            </div>
          </div>
          <p style={{color:P.textoS,fontSize:12.5,marginBottom:20,lineHeight:1.6,fontFamily:F.body,borderLeft:`3px solid ${corLado}`,paddingLeft:12}}>{m.q}</p>

          {gratuito && (
            <div style={{background:`${P.esmeralda}10`,border:`1px solid ${P.esmeralda}30`,borderRadius:12,padding:13,marginBottom:18,fontSize:12,color:P.textoP,fontFamily:F.body,lineHeight:1.6}}>
              🎓 <b>Fase Beta — Participação Gratuita.</b> Estás a testar a plataforma com pontos simbólicos, sem dinheiro real. Os teus resultados contam para o ranking de previsores.
            </div>
          )}

          <label style={LBL}>O TEU NOME</label>
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Como te devemos identificar?" style={{...INP,marginBottom:14}}/>

          <label style={LBL}>CONTACTO (opcional)</label>
          <input value={contacto} onChange={e=>setContacto(e.target.value)} placeholder="WhatsApp ou telefone" style={{...INP,marginBottom:16}}/>

          <label style={LBL}>{gratuito?"PONTOS DE PARTICIPAÇÃO":"VALOR (MZN)"} · Mín {fmt(minVal)} · Máx {fmt(maxVal)}</label>
          <input type="number" value={val} min={minVal} max={maxVal} onChange={e=>setVal(Math.max(minVal,Math.min(maxVal,+e.target.value)))} style={{...INP,fontSize:26,fontWeight:800,marginBottom:8}}/>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
            {[50,100,250,500,1000,2500].map(v=>(
              <button key={v} onClick={()=>setVal(v)} style={{padding:"6px 12px",borderRadius:9,border:`1px solid ${val===v?P.ouro:"rgba(255,255,255,0.08)"}`,background:val===v?`${P.ouro}1A`:"transparent",color:val===v?P.ouro:P.textoS,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F.body}}>{fmt(v)}</button>
            ))}
          </div>

          <Box style={{marginBottom:20}} glow>
            <p style={{fontSize:10,color:P.esmeralda,fontWeight:800,letterSpacing:1.2,marginBottom:11,fontFamily:F.body}}>📊 SIMULAÇÃO DE RETORNO</p>
            {[["Participação",`${fmt(val)} ${gratuito?"pts":"MZN"}`,P.textoP],["Multiplicador",`${mx}×`,P.ouro],["Se ganhar",`${fmt(Math.round(val*mx))} ${gratuito?"pts":"MZN"}`,P.esmeralda],["Ganho líquido",`+${fmt(lucro)} ${gratuito?"pts":"MZN"}`,P.ouroBrilho]].map(([l,v2,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:6,fontFamily:F.body}}>
                <span style={{color:P.textoS}}>{l}</span><span style={{color:c,fontWeight:700}}>{v2}</span>
              </div>
            ))}
          </Box>

          <div style={{display:"flex",gap:10}}>
            <Btn v="ghost" onClick={fechar} style={{flex:1}}>Cancelar</Btn>
            <Btn v={lado==="sim"?"sim":"nao"} onClick={()=>ok&&(gratuito?(concluir(val,lado,m.id,"gratuito",ref,nome,contacto),fechar()):setPasso(2))} off={!ok} style={{flex:2}}>{gratuito?"✓ Confirmar Participação":"Continuar →"}</Btn>
          </div>
        </>
      ):(
        <>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:42,marginBottom:8}}>📤</div>
            <h3 style={{color:P.ouro,margin:0,fontSize:18,fontFamily:F.display}}>Envia o Comprovativo</h3>
            <p style={{color:P.textoS,fontSize:12,marginTop:5,fontFamily:F.body}}>Envia o valor via e-Mola e partilha o comprovativo</p>
          </div>
          <div style={{background:`${P.ouro}0c`,border:`1px solid ${P.ouro}30`,borderRadius:14,padding:16,marginBottom:16}}>
            {[`Abre o e-Mola no telemóvel`,"Selecciona «Enviar Dinheiro»",`Número: ${emola}`,`Valor: ${fmt(val)} MZN`,`Referência: ${ref}`,"Faz captura de tela do comprovativo","Envia para o WhatsApp do admin"].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:i<6?9:0,alignItems:"flex-start"}}>
                <div style={{width:23,height:23,borderRadius:"50%",background:`${P.ouro}22`,border:`1px solid ${P.ouro}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:P.ouro,flexShrink:0,fontFamily:F.body}}>{i+1}</div>
                <span style={{fontSize:13,color:i>=2&&i<=4?P.textoP:P.textoS,fontWeight:i>=2&&i<=4?700:400,lineHeight:1.4,paddingTop:2,fontFamily:F.body}}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["NÚMERO",emola],["VALOR",`${fmt(val)} MZN`],["REFERÊNCIA",ref],["TITULAR",CFG_BASE.owner]].map(([k,v])=>(
              <div key={k} style={{background:"rgba(0,230,118,0.04)",borderRadius:11,padding:"11px 13px",border:`1px solid ${P.borda}`}}>
                <div style={{fontSize:9,color:P.textoS,letterSpacing:1,marginBottom:4,fontFamily:F.body}}>{k}</div>
                <div style={{fontSize:k==="REFERÊNCIA"?10.5:13,fontWeight:700,color:P.textoP,wordBreak:"break-all",fontFamily:F.body}}>{v}</div>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:P.textoS,textAlign:"center",marginBottom:18,lineHeight:1.7,fontFamily:F.body}}>A tua participação fica <b style={{color:P.ouro}}>pendente</b> até o admin confirmar o comprovativo recebido.</p>
          <div style={{display:"flex",gap:10}}>
            <Btn v="ghost" onClick={()=>setPasso(1)} style={{flex:1}}>← Voltar</Btn>
            <Btn v="ouro" onClick={()=>{concluir(val,lado,m.id,"comprovativo",ref,nome,contacto);fechar();}} style={{flex:2}}>✓ Já Enviei</Btn>
          </div>
        </>
      )}
    </Overlay>
  );
};

// ═══════════════════════════════════════════════════════════
// MODAL DETALHE
// ═══════════════════════════════════════════════════════════
const ModalDetalhe = ({m,taxa,fechar,participar,partilhar}) => {
  const mS=multX(m.sim,m.nao,taxa), mN=multX(m.nao,m.sim,taxa);
  const mxVol=Math.max(...(m.vol||[1]));
  return (
    <Overlay fechar={fechar}>
      <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:9}}>
        <span style={{fontSize:30}}>{m.emoji}</span>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Badge cor={CAT_C[m.cat]||P.ouro}>{m.cat.toUpperCase()}</Badge>
          {m.destaque&&<Badge cor={P.rubi} glow>🔥 DESTAQUE</Badge>}
          <Badge cor={P.esmeralda}>🟢 {m.status.toUpperCase()}</Badge>
        </div>
      </div>
      <h3 style={{color:P.ouro,fontSize:18,marginBottom:5,fontFamily:F.display,lineHeight:1.4}}>{m.q}</h3>
      <p style={{color:P.textoS,fontSize:11,marginBottom:18,fontFamily:F.body}}>Publicado: {m.criado} · Prazo: {m.prazo} · Pool: {fmt(m.sim+m.nao)} pts</p>
      <BarraConsenso sim={m.sim} nao={m.nao}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:16,marginBottom:18}}>
        {[["✓ SIM",m.sim,mS,P.esmeralda],["✗ NÃO",m.nao,mN,P.rubi]].map(([l,v,mx,c])=>(
          <div key={l} style={{background:`${c}0c`,border:`1px solid ${c}35`,borderRadius:12,padding:13,textAlign:"center",boxShadow:`0 0 20px ${c}15`}}>
            <div style={{fontSize:11,color:c,fontWeight:700,fontFamily:F.body}}>{l}</div>
            <div style={{fontSize:18,fontWeight:800,color:c,fontFamily:F.body}}>{fmt(v)} pts</div>
            <div style={{fontSize:12,color:P.ouro,fontFamily:F.body}}>Mult: {mx}×</div>
            <div style={{fontSize:10,color:P.textoS,fontFamily:F.body}}>{pct(v,(m.sim+m.nao)-v)}% consenso</div>
          </div>
        ))}
      </div>
      {m.vol&&m.vol.length>1&&(
        <Box style={{marginBottom:16}}>
          <p style={{fontSize:10,color:P.textoS,letterSpacing:1.2,marginBottom:10,fontFamily:F.body}}>📈 EVOLUÇÃO DO CONSENSO SIM</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:54}}>
            {m.vol.map((v,i)=><div key={i} style={{flex:1,background:i===m.vol.length-1?`linear-gradient(180deg,${P.esmeralda},${P.esmeraldaD})`:`${P.esmeralda}30`,borderRadius:"4px 4px 0 0",height:`${(v/mxVol)*100}%`,minHeight:4,transition:"height .4s",boxShadow:i===m.vol.length-1?`0 0 12px ${P.esmeralda}50`:"none"}}/>)}
          </div>
        </Box>
      )}
      {m.met&&<div style={{background:`${P.ouro}0a`,border:`1px solid ${P.ouro}25`,borderRadius:13,padding:15,marginBottom:13}}><p style={{fontSize:10,color:P.ouro,fontWeight:800,letterSpacing:1.2,marginBottom:7,fontFamily:F.body}}>📐 METODOLOGIA</p><p style={{fontSize:12.5,color:P.textoS,margin:0,lineHeight:1.65,fontFamily:F.body}}>{m.met}</p></div>}
      {m.fontes&&<div style={{background:"rgba(0,230,118,0.05)",border:`1px solid ${P.borda}`,borderRadius:13,padding:15,marginBottom:18}}><p style={{fontSize:10,color:P.esmeralda,fontWeight:800,letterSpacing:1.2,marginBottom:7,fontFamily:F.body}}>📚 FONTES</p><p style={{fontSize:12.5,color:P.textoS,margin:0,fontFamily:F.body}}>{m.fontes}</p></div>}
      {m.status==="aberto"&&<div style={{display:"flex",gap:10}}><Btn v="sim" onClick={()=>{participar(m,"sim");fechar();}} style={{flex:1}}>✓ SIM {mS}×</Btn><Btn v="nao" onClick={()=>{participar(m,"nao");fechar();}} style={{flex:1}}>✗ NÃO {mN}×</Btn></div>}
      <Btn v="ouro" onClick={()=>{fechar();partilhar(m);}} largo style={{marginTop:10,padding:11}}>📤 Partilhar esta Previsão</Btn>
      <Btn v="ghost" onClick={fechar} largo style={{marginTop:11,padding:11}}>Fechar</Btn>
    </Overlay>
  );
};

// ═══════════════════════════════════════════════════════════
// CARD PREVISÃO — com brilho e profundidade
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// MODAL PARTILHAR — o motor de crescimento social
// Gera um "cartão de previsão" pronto para WhatsApp/Facebook/Instagram
// ═══════════════════════════════════════════════════════════
const ModalPartilhar = ({m,taxa,fechar}) => {
  const [copiado,setCopiado]=useState(false);
  const s=pct(m.sim,m.nao);
  const cc=CAT_C[m.cat]||P.ouro;
  const linkPrevisao = `https://mzprediz.co.mz/previsao/${m.id}`;
  const textoPartilha = `🇲🇿 MzPrediz: "${m.q}"\n\n${s}% dizem SIM · ${100-s}% dizem NÃO\n\nQual é a tua previsão? 👉 ${linkPrevisao}`;

  const copiarTexto = () => {
    if(navigator.clipboard) navigator.clipboard.writeText(textoPartilha);
    setCopiado(true); setTimeout(()=>setCopiado(false),2000);
  };

  const abrirWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(textoPartilha)}`,"_blank");
  const abrirFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkPrevisao)}&quote=${encodeURIComponent(textoPartilha)}`,"_blank");

  return (
    <Overlay fechar={fechar}>
      <h3 style={{color:P.ouro,fontSize:18,marginBottom:6,fontFamily:F.display,textAlign:"center"}}>📤 Partilhar Previsão</h3>
      <p style={{color:P.textoS,fontSize:12,marginBottom:20,fontFamily:F.body,textAlign:"center"}}>Desafia os teus amigos a dar a opinião deles</p>

      {/* Cartão visual — exactamente o que vai parecer partilhado */}
      <div style={{background:`linear-gradient(155deg, ${P.bgPanel}, ${P.bgDeep})`,border:`1.5px solid ${cc}45`,borderRadius:20,padding:"22px 20px",marginBottom:20,position:"relative",overflow:"hidden",boxShadow:`0 0 40px ${cc}20`}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${P.terracota},${P.ouro},${P.esmeralda})`}}/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:10,color:"#04140A",fontFamily:F.body}}>MZ</div>
          <span style={{fontSize:11,fontWeight:800,color:P.textoP,fontFamily:F.body,letterSpacing:.5}}>MZPREDIZ · MOÇAMBIQUE 🇲🇿</span>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:30}}>{m.emoji}</span>
          <Badge cor={cc}>{m.cat.toUpperCase()}</Badge>
        </div>
        <p style={{fontSize:16,fontWeight:700,color:P.textoP,marginBottom:16,lineHeight:1.5,fontFamily:F.display}}>{m.q}</p>
        <div style={{display:"flex",gap:10,marginBottom:8}}>
          <div style={{flex:1,textAlign:"center",background:`${P.esmeralda}12`,borderRadius:12,padding:"12px 8px",border:`1px solid ${P.esmeralda}30`}}>
            <div style={{fontSize:22,fontWeight:800,color:P.esmeralda,fontFamily:F.body}}>{s}%</div>
            <div style={{fontSize:10,color:P.textoS,fontFamily:F.body}}>✓ DIZEM SIM</div>
          </div>
          <div style={{flex:1,textAlign:"center",background:`${P.rubi}12`,borderRadius:12,padding:"12px 8px",border:`1px solid ${P.rubi}30`}}>
            <div style={{fontSize:22,fontWeight:800,color:P.rubi,fontFamily:F.body}}>{100-s}%</div>
            <div style={{fontSize:10,color:P.textoS,fontFamily:F.body}}>✗ DIZEM NÃO</div>
          </div>
        </div>
        <p style={{textAlign:"center",fontSize:10.5,color:P.textoS,marginTop:14,fontFamily:F.body}}>👉 Qual é a tua previsão? mzprediz.co.mz</p>
      </div>

      {/* Botões de partilha directa */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Btn v="verde" onClick={abrirWhatsApp} largo style={{padding:14,fontSize:14}}>📱 Partilhar no WhatsApp</Btn>
        <Btn v="dark" onClick={abrirFacebook} largo style={{padding:13,fontSize:13.5}}>📘 Partilhar no Facebook</Btn>
        <Btn v="ghost" onClick={copiarTexto} largo style={{padding:12,fontSize:13}}>{copiado?"✓ Copiado!":"📋 Copiar Texto"}</Btn>
      </div>
      <Btn v="ghost" onClick={fechar} largo style={{marginTop:12,padding:10}}>Fechar</Btn>
    </Overlay>
  );
};

// ═══════════════════════════════════════════════════════════
// SISTEMA DE NOTIFICAÇÕES INTERNAS
// Quando admin resolve um mercado, utilizadores que participaram
// vêem um banner de notificação ao abrir a plataforma
// ═══════════════════════════════════════════════════════════
const BannerNotificacoes = ({parts,mercados,onFechar}) => {
  const resolvidos = mercados.filter(m=>m.status==="resolvido");
  const minhasParticipacoes = parts.filter(p=>resolvidos.some(m=>m.id===p.mId));
  if(!minhasParticipacoes.length) return null;

  return (
    <div style={{position:"fixed",top:70,right:14,zIndex:500,display:"flex",flexDirection:"column",gap:8,maxWidth:340}}>
      {minhasParticipacoes.slice(0,3).map(p=>{
        const m = mercados.find(m=>m.id===p.mId);
        if(!m) return null;
        const ganhou = m.venc===p.lado;
        const cor = ganhou?P.esmeralda:P.rubi;
        return (
          <div key={p.id} style={{background:P.bgPanel,border:`1px solid ${cor}50`,borderRadius:14,padding:"12px 16px",boxShadow:`0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${cor}20`,animation:"popIn .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
              <div>
                <div style={{fontSize:11,color:cor,fontWeight:800,fontFamily:F.body,marginBottom:4}}>
                  {ganhou?"🏆 PREVISÃO CORRECTA!":"❌ PREVISÃO ERRADA"}
                </div>
                <p style={{fontSize:11.5,color:P.textoP,margin:"0 0 5px",lineHeight:1.4,fontFamily:F.body}}>{m.q.slice(0,60)}…</p>
                <div style={{fontSize:10,color:P.textoS,fontFamily:F.body}}>
                  Resultado: <b style={{color:cor}}>{m.venc?.toUpperCase()}</b> · A tua previsão: <b style={{color:p.lado==="sim"?P.esmeralda:P.rubi}}>{p.lado.toUpperCase()}</b>
                </div>
              </div>
              <button onClick={()=>onFechar(p.id)} style={{background:"none",border:"none",color:P.textoS,cursor:"pointer",fontSize:16,padding:0,flexShrink:0}}>×</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CardPrevisao = ({m,taxa,onParticipar,onDetalhe,onPartilhar}) => {
  const [hov,setHov]=useState(false);
  const cc=CAT_C[m.cat]||P.ouro;
  const mS=multX(m.sim,m.nao,taxa), mN=multX(m.nao,m.sim,taxa);
  const tot=m.sim+m.nao, part=Math.max(1,Math.round(tot/120));

  // Multiplicador dinâmico por tempo — diminui conforme o prazo se aproxima
  const calcMultTempo = () => {
    try {
      const meses={"Jan":"01","Fev":"02","Mar":"03","Abr":"04","Mai":"05","Jun":"06","Jul":"07","Ago":"08","Set":"09","Out":"10","Nov":"11","Dez":"12"};
      const partes = m.prazo.split(" ");
      const dataStr = partes.length===3?`${partes[2]}-${meses[partes[1]]||"12"}-${partes[0].padStart(2,"0")}`:"2027-12-31";
      const dias = Math.max(0, Math.floor((new Date(dataStr)-new Date())/864e5));
      if(dias>90) return null; // só mostra aviso quando falta menos de 90 dias
      if(dias<=3)  return {txt:"⚡ ENCERRA EM BREVE",cor:P.rubi};
      if(dias<=14) return {txt:`🔥 ${dias} dias — multiplicador a cair`,cor:"#FFB020"};
      if(dias<=30) return {txt:`⏳ ${dias} dias restantes`,cor:P.ouro};
      return {txt:`📅 ${dias} dias restantes`,cor:P.textoS};
    } catch { return null; }
  };
  const alerta = calcMultTempo();

  return (
    <div style={{
      background:hov?"rgba(0,230,118,0.055)":"rgba(0,230,118,0.035)",
      border:`1px solid ${hov?`${cc}55`:P.borda}`,
      borderRadius:20, padding:"22px 20px", position:"relative", overflow:"hidden",
      transition:"all .25s cubic-bezier(.4,0,.2,1)",
      transform:hov?"translateY(-4px)":"none",
      boxShadow:hov?`0 16px 48px rgba(0,0,0,0.35), 0 0 32px ${cc}18`:"0 4px 16px rgba(0,0,0,0.2)",
    }} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${cc},transparent)`,opacity:hov?1:.6,transition:"opacity .25s"}}/>
      {m.destaque&&<div style={{position:"absolute",top:14,right:14,background:`linear-gradient(135deg,${P.rubiD},${P.rubi})`,color:"#fff",fontSize:9,fontWeight:800,padding:"4px 10px",borderRadius:20,letterSpacing:1,fontFamily:F.body,boxShadow:`0 0 16px ${P.rubi}50`}}>🔥 DESTAQUE</div>}
      <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:24,filter:hov?`drop-shadow(0 0 8px ${cc}60)`:"none",transition:"filter .25s"}}>{m.emoji}</span>
        <Badge cor={cc}>{m.cat.toUpperCase()}</Badge>
        <Badge cor={P.esmeralda} style={{marginLeft:"auto"}}>🟢 ABERTO</Badge>
      </div>
      {alerta&&(
        <div style={{background:`${alerta.cor}12`,border:`1px solid ${alerta.cor}30`,borderRadius:8,padding:"5px 10px",marginBottom:10,fontSize:10.5,color:alerta.cor,fontWeight:700,fontFamily:F.body}}>
          {alerta.txt}
        </div>
      )}
      <p style={{fontSize:15.5,fontWeight:600,color:P.textoP,marginBottom:16,lineHeight:1.55,fontFamily:F.display}}>{m.q}</p>
      <BarraConsenso sim={m.sim} nao={m.nao}/>
      <div style={{display:"flex",gap:10,marginTop:16,marginBottom:14}}>
        <button onClick={()=>onParticipar(m,"sim")} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,color:"#04140A",fontWeight:800,fontSize:12.5,cursor:"pointer",fontFamily:F.body,transition:"all .15s",boxShadow:`0 4px 16px ${P.esmeralda}30`}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 22px ${P.esmeralda}55`;e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 4px 16px ${P.esmeralda}30`;e.currentTarget.style.transform="none";}}>
          ✓ SIM <span style={{opacity:.7,fontWeight:400}}>{mS}×</span>
        </button>
        <button onClick={()=>onParticipar(m,"nao")} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",background:`linear-gradient(135deg,${P.rubiD},${P.rubi})`,color:"#fff",fontWeight:800,fontSize:12.5,cursor:"pointer",fontFamily:F.body,transition:"all .15s",boxShadow:`0 4px 16px ${P.rubi}30`}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 22px ${P.rubi}55`;e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 4px 16px ${P.rubi}30`;e.currentTarget.style.transform="none";}}>
          ✗ NÃO <span style={{opacity:.7,fontWeight:400}}>{mN}×</span>
        </button>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:P.textoS,fontFamily:F.body}}>
        <div style={{display:"flex",gap:13,alignItems:"center"}}>
          <span>💰 <b style={{color:P.ouro}}>{fmt(tot)} pts</b></span>
          <span>👥 {fmt(part)}</span>
          {m.vol&&<Spark dados={m.vol} cor={P.esmeralda}/>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
          <ContadorPrazo prazo={m.prazo}/>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>onPartilhar(m)} style={{background:"rgba(255,199,0,0.06)",border:`1px solid ${P.ouro}30`,borderRadius:8,padding:"4px 11px",color:P.ouro,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F.body}}>📤 Partilhar</button>
            <button onClick={()=>onDetalhe(m)} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${P.borda}`,borderRadius:8,padding:"4px 11px",color:P.esmeralda,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:F.body}}>Detalhes ↗</button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════
const LoginAdmin = ({entrar,voltar}) => {
  const [u,setU]=useState(""), [p,setP]=useState(""), [err,setErr]=useState("");
  const tentar=()=>{ if(u.trim().toLowerCase()===CFG_BASE.adminUser&&p.trim()===CFG_BASE.adminPass) entrar(); else setErr("Credenciais incorrectas."); };
  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,230,118,0.08) 0%, ${P.bgVoid} 60%)`,display:"flex",flexDirection:"column"}}>
      <FaixaCapulana/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{width:"100%",maxWidth:390}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <div style={{width:64,height:64,borderRadius:18,background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22,fontWeight:900,color:"#04140A",fontFamily:F.body,boxShadow:`0 8px 32px ${P.esmeralda}40`}}>MZ</div>
            <h2 style={{color:P.ouro,fontSize:23,margin:0,fontFamily:F.display}}>Oficina do Proprietário</h2>
            <p style={{color:P.textoS,fontSize:12,marginTop:6,fontFamily:F.body}}>{CFG_BASE.owner} · MzPrediz 🇲🇿</p>
          </div>
          <Box glow style={{padding:26}}>
            <label style={LBL}>UTILIZADOR</label>
            <input value={u} onChange={e=>setU(e.target.value)} placeholder="alberto" autoCapitalize="none" autoCorrect="off" autoComplete="username" style={{...INP,marginBottom:15}}/>
            <label style={LBL}>PALAVRA-PASSE</label>
            <input type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tentar()} placeholder="••••••••" style={INP}/>
            {err&&<p style={{color:P.rubi,fontSize:12,marginTop:9,fontFamily:F.body}}>{err}</p>}
            <Btn v="verde" onClick={tentar} largo style={{marginTop:22,padding:14,fontSize:15}}>Entrar na Oficina</Btn>
            <button onClick={voltar} style={{width:"100%",marginTop:11,padding:11,background:"transparent",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,color:P.textoS,cursor:"pointer",fontSize:12,fontFamily:F.body}}>← Voltar à Plataforma</button>
          </Box>

        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PAINEL ADMIN — "OFICINA DE BASTIDORES"
// Visualmente rico: KPIs com glow, gráficos, gestão completa
// ═══════════════════════════════════════════════════════════
const PainelAdmin = ({mercados,setMercados,parts,setParts,emola,setEmola,mpesa,setMpesa,cfg,setCfg,sair}) => {
  const [aba,setAba]=useState("dash");
  const [toast,setToast]=useState("");
  const [resolverM,setResolverM]=useState(null);
  const [form,setForm]=useState({q:"",cat:"Política",emoji:"🏛️",prazo:"",destaque:false,met:"",fontes:""});
  const [eEmola,setEEmola]=useState(emola);
  const [eMpesa,setEMpesa]=useState(mpesa);
  const [eCfg,setECfg]=useState({...cfg});

  const notif=m=>{setToast(m);setTimeout(()=>setToast(""),3200);};
  const totalPool=mercados.reduce((s,m)=>s+m.sim+m.nao,0);
  const pendentes=parts.filter(p=>p.status==="pendente").length;
  const confirmadas=parts.filter(p=>p.status==="confirmado").length;
  const receita=Math.round(totalPool*(cfg.taxa/100)*0.5);
  const taxaConfirmacao = parts.length ? Math.round((confirmadas/parts.length)*100) : 0;

  const publicar=async()=>{
    if(!form.q||!form.prazo){notif("❌ Pergunta e data são obrigatórias");return;}
    const dadosSupa={categoria:form.cat,pergunta:form.q,emoji:form.emoji||CAT_I[form.cat]||"❓",prazo:form.prazo,sim:0,nao:0,destaque:form.destaque,status:"aberto",metodologia:form.met,fontes:form.fontes};
    const resultado = await db.inserir("mercados", dadosSupa);
    const novoId = resultado?.id || Date.now();
    const novo={id:novoId,cat:form.cat,q:form.q,emoji:form.emoji||CAT_I[form.cat]||"❓",prazo:form.prazo,sim:0,nao:0,destaque:form.destaque,status:"aberto",criado:hoje(),vol:[0],met:form.met,fontes:form.fontes};
    setMercados(p=>[novo,...p]);
    setForm({q:"",cat:"Política",emoji:"🏛️",prazo:"",destaque:false,met:"",fontes:""});
    notif("✅ Previsão publicada!"); setAba("mercados");
  };

  const resolver=async(id,venc)=>{
    await db.actualizar("mercados", id, {status:"resolvido",vencedor:venc});
    setMercados(p=>p.map(m=>m.id===id?{...m,status:"resolvido",venc}:m));
    setResolverM(null); notif(`✅ Resolvido — ${venc.toUpperCase()} ganhou!`);
  };
  const confirmarP=async id=>{
    await db.actualizar("participacoes", id, {status:"confirmado"});
    setParts(p=>p.map(a=>a.id===id?{...a,status:"confirmado"}:a));
    notif("✅ Confirmada!");
  };
  const rejeitarP=async id=>{
    await db.actualizar("participacoes", id, {status:"rejeitado"});
    setParts(p=>p.map(a=>a.id===id?{...a,status:"rejeitado"}:a));
    notif("🚫 Rejeitada");
  };
  const apagarP=async id=>{
    await db.apagar("participacoes", id);
    setParts(p=>p.filter(a=>a.id!==id));
    notif("🗑️ Removida");
  };
  const apagarM=async id=>{
    await db.apagar("mercados", id);
    setMercados(p=>p.filter(m=>m.id!==id));
    notif("🗑️ Removida");
  };
  const alternarD=async id=>{
    const m = mercados.find(m=>m.id===id);
    if(m) await db.actualizar("mercados", id, {destaque:!m.destaque});
    setMercados(p=>p.map(m=>m.id===id?{...m,destaque:!m.destaque}:m));
  };
  const guardarPay=()=>{setEmola(eEmola);setMpesa(eMpesa);notif("✅ Pagamentos guardados!");};
  const guardarCfg=()=>{setCfg(eCfg);notif("✅ Configuração guardada!");};

  const ABAS=[
    {id:"dash",   t:"📊 Painel"},
    {id:"criar",  t:"➕ Nova Previsão"},
    {id:"mercados",t:`📋 Mercados (${mercados.filter(m=>m.status==="aberto").length})`},
    {id:"parts",  t:`💳 Participações${pendentes>0?` ⚠️${pendentes}`:""}`},
    {id:"pagamentos",t:"💰 Pagamentos"},
    {id:"valores",t:"⚙️ Valores"},
    {id:"sistema",t:"🛠️ Sistema"},
  ];

  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 100% 30% at 50% 0%, rgba(0,230,118,0.06) 0%, ${P.bgVoid} 50%)`,color:P.textoP,fontFamily:F.display}}>
      <FaixaCapulana/>
      <Toast msg={toast}/>

      <header style={{background:"rgba(5,8,10,0.97)",borderBottom:`1px solid ${P.borda}`,padding:"0 18px",position:"sticky",top:0,zIndex:200,backdropFilter:"blur(16px)"}}>
        <div style={{maxWidth:1040,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:P.esmeralda,boxShadow:`0 0 14px ${P.esmeralda}`,animation:"pulse 2s infinite"}}/>
            <span style={{fontWeight:800,fontSize:16,color:P.ouro,fontFamily:F.body}}>Oficina MzPrediz</span>
            <span style={{fontSize:11,color:P.textoS,fontFamily:F.body}}>· {CFG_BASE.owner}</span>
            <span style={{fontSize:10,color:P.esmeralda,background:`${P.esmeralda}15`,padding:"3px 10px",borderRadius:20,fontFamily:F.body,border:`1px solid ${P.esmeralda}30`}}>💾 AUTO-GUARDADO</span>
          </div>
          <button onClick={sair} style={{padding:"6px 16px",borderRadius:10,border:`1px solid ${P.rubi}40`,background:`${P.rubi}10`,color:P.rubi,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:F.body}}>Sair →</button>
        </div>
      </header>

      <div style={{maxWidth:1040,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{display:"flex",gap:6,marginBottom:26,flexWrap:"wrap"}}>
          {ABAS.map(t=>(
            <button key={t.id} onClick={()=>setAba(t.id)} style={{padding:"9px 15px",borderRadius:11,fontSize:12.5,fontWeight:700,border:aba===t.id?"none":"1px solid rgba(255,255,255,0.06)",background:aba===t.id?`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`:"transparent",color:aba===t.id?"#04140A":P.textoS,cursor:"pointer",fontFamily:F.body,boxShadow:aba===t.id?`0 4px 16px ${P.esmeralda}35`:"none",transition:"all .2s"}}>{t.t}</button>
          ))}
        </div>

        {/* ═══ DASHBOARD — visual premium ═══ */}
        {aba==="dash"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* KPIs hero com glow */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {i:"💰",v:`${fmt(totalPool)}`,u:"pts",l:"Pool Total",c:P.ouro,glow:P.ouro},
                {i:"👥",v:confirmadas,u:"",l:"Confirmadas",c:P.esmeralda,glow:P.esmeralda},
                {i:"⏳",v:pendentes,u:"",l:"Pendentes",c:pendentes>0?"#FFB020":P.textoS,glow:pendentes>0?"#FFB020":"transparent"},
                {i:"🏦",v:`${fmt(receita)}`,u:"pts",l:"Receita Projectada",c:"#00C2FF",glow:"#00C2FF"},
              ].map(s=>(
                <div key={s.l} style={{background:`linear-gradient(165deg, ${s.c}10, transparent)`,border:`1px solid ${s.c}30`,borderRadius:18,padding:"20px 14px",textAlign:"center",boxShadow:`0 0 30px ${s.glow}18, inset 0 1px 0 rgba(255,255,255,0.03)`,position:"relative",overflow:"hidden"}}>
                  <div style={{fontSize:26,marginBottom:8,filter:`drop-shadow(0 0 8px ${s.glow}50)`}}>{s.i}</div>
                  <div style={{fontSize:"clamp(15px,2.5vw,22px)",fontWeight:800,color:s.c,fontFamily:F.body,lineHeight:1.1}}>{s.v}<span style={{fontSize:11,opacity:.6,marginLeft:3}}>{s.u}</span></div>
                  <div style={{fontSize:9.5,color:P.textoS,marginTop:5,letterSpacing:.8,fontFamily:F.body}}>{s.l.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Taxa de confirmação — anel visual */}
            <Box glow>
              <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
                <div style={{position:"relative",width:90,height:90,flexShrink:0}}>
                  <svg width="90" height="90" style={{transform:"rotate(-90deg)"}}>
                    <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                    <circle cx="45" cy="45" r="38" fill="none" stroke={P.esmeralda} strokeWidth="8" strokeDasharray={`${(taxaConfirmacao/100)*238.8} 238.8`} strokeLinecap="round" style={{filter:`drop-shadow(0 0 6px ${P.esmeralda})`,transition:"stroke-dasharray .6s"}}/>
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:P.esmeralda,fontFamily:F.body}}>{taxaConfirmacao}%</div>
                </div>
                <div>
                  <h3 style={{color:P.ouro,fontSize:15,margin:0,marginBottom:6,fontFamily:F.body}}>Taxa de Confirmação</h3>
                  <p style={{color:P.textoS,fontSize:12,margin:0,lineHeight:1.6,fontFamily:F.body,maxWidth:380}}>{confirmadas} de {parts.length} participações confirmadas. {pendentes>0?`Tens ${pendentes} pendente${pendentes>1?"s":""} à espera de verificação.`:"Tudo em dia! 🎉"}</p>
                </div>
              </div>
            </Box>

            {/* Pool por categoria — barras com glow */}
            <Box>
              <h3 style={{color:P.ouro,fontSize:15,marginBottom:16,fontFamily:F.body}}>📊 Pool por Categoria</h3>
              {CATS.filter(c=>mercados.some(m=>m.cat===c)).map(c=>{
                const pool=mercados.filter(m=>m.cat===c).reduce((s,m)=>s+m.sim+m.nao,0);
                const p=totalPool>0?Math.round((pool/totalPool)*100):0, cc=CAT_C[c]||P.esmeralda;
                return (
                  <div key={c} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:5,fontFamily:F.body}}>
                      <span style={{color:P.textoP}}>{CAT_I[c]} {c}</span>
                      <span style={{color:cc,fontWeight:700}}>{fmt(pool)} pts · {p}%</span>
                    </div>
                    <div style={{height:7,background:"rgba(255,255,255,.04)",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${p}%`,height:"100%",background:`linear-gradient(90deg,${cc}99,${cc})`,borderRadius:4,boxShadow:`0 0 8px ${cc}50`,transition:"width .5s"}}/>
                    </div>
                  </div>
                );
              })}
            </Box>

            <Box>
              <h3 style={{color:P.ouro,fontSize:15,marginBottom:14,fontFamily:F.body}}>🕓 Últimas Participações</h3>
              {parts.slice(0,8).map(a=>{
                const mkt=mercados.find(m=>m.id===a.mId);
                const sc={pendente:"#FFB020",confirmado:P.esmeralda,rejeitado:P.rubi}[a.status];
                return (
                  <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:12,fontFamily:F.body}}>
                    <div style={{flex:1,overflow:"hidden"}}>
                      <span style={{color:a.lado==="sim"?P.esmeralda:P.rubi,fontWeight:800}}>{a.lado.toUpperCase()}</span>
                      <span style={{color:P.textoS,marginLeft:9}}>{mkt?.q?.slice(0,42)}…</span>
                    </div>
                    <div style={{display:"flex",gap:9,alignItems:"center",flexShrink:0}}>
                      <span style={{color:P.ouro,fontWeight:700}}>{fmt(a.val)} pts</span>
                      <Badge cor={sc}>{a.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                );
              })}
            </Box>
          </div>
        )}

        {/* ═══ CRIAR PREVISÃO ═══ */}
        {aba==="criar"&&(
          <Box glow>
            <h3 style={{color:P.ouro,marginBottom:7,fontSize:19,fontFamily:F.display}}>➕ Publicar Nova Previsão</h3>
            <p style={{color:P.textoS,fontSize:12.5,marginBottom:24,fontFamily:F.body,lineHeight:1.6}}>A pergunta deve ter resposta clara de <b style={{color:P.esmeralda}}>SIM</b> ou <b style={{color:P.rubi}}>NÃO</b>. Inclui metodologia e fontes para credibilidade.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={LBL}>PERGUNTA *</label>
                <textarea value={form.q} onChange={e=>setForm(p=>({...p,q:e.target.value}))} placeholder="Ex: Será que [evento] vai acontecer antes de [data]?" rows={3} style={{...INP,resize:"vertical",lineHeight:1.6}}/>
              </div>
              <div>
                <label style={LBL}>CATEGORIA *</label>
                <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value,emoji:CAT_I[e.target.value]||"❓"}))} style={INP}>{CATS.map(c=><option key={c} value={c}>{CAT_I[c]} {c}</option>)}</select>
              </div>
              <div>
                <label style={LBL}>EMOJI</label>
                <input value={form.emoji} onChange={e=>setForm(p=>({...p,emoji:e.target.value}))} style={INP}/>
              </div>
              <div>
                <label style={LBL}>DATA LIMITE *</label>
                <input type="date" value={form.prazo} onChange={e=>setForm(p=>({...p,prazo:e.target.value}))} style={INP}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:11}}>
                <Toggle on={form.destaque} mudar={v=>setForm(p=>({...p,destaque:v}))}/>
                <span style={{color:P.textoS,fontSize:13,fontFamily:F.body}}>🔥 Em Destaque</span>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={LBL}>METODOLOGIA</label>
                <textarea value={form.met} onChange={e=>setForm(p=>({...p,met:e.target.value}))} placeholder="Como foi elaborada esta previsão? Dados históricos, relatórios, tendências..." rows={2} style={{...INP,resize:"vertical",lineHeight:1.6}}/>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={LBL}>FONTES</label>
                <input value={form.fontes} onChange={e=>setForm(p=>({...p,fontes:e.target.value}))} placeholder="INE, Banco de Moçambique, ONU, CIP Moçambique..." style={INP}/>
              </div>
            </div>
            {form.q&&(
              <div style={{marginTop:20,padding:16,background:"rgba(0,230,118,0.03)",borderRadius:14,border:`1px dashed ${P.borda}`}}>
                <div style={{fontSize:9,color:P.textoS,letterSpacing:1.2,marginBottom:8,fontFamily:F.body}}>PREVIEW</div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:19}}>{form.emoji}</span>
                  <Badge cor={CAT_C[form.cat]||P.esmeralda}>{form.cat.toUpperCase()}</Badge>
                  {form.destaque&&<Badge cor={P.rubi}>🔥 DESTAQUE</Badge>}
                </div>
                <p style={{fontSize:14.5,color:P.textoP,margin:0,lineHeight:1.5,fontFamily:F.display}}>{form.q}</p>
                {form.met&&<p style={{fontSize:11,color:P.textoS,margin:"8px 0 0",fontFamily:F.body}}>📐 {form.met.slice(0,90)}{form.met.length>90?"…":""}</p>}
              </div>
            )}
            <Btn v="verde" onClick={publicar} largo style={{marginTop:22,padding:15,fontSize:15.5}}>🚀 Publicar Previsão</Btn>
          </Box>
        )}

        {/* ═══ MERCADOS ═══ */}
        {aba==="mercados"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              {["aberto","resolvido"].map(s=><Badge key={s} cor={s==="aberto"?P.esmeralda:"#777"}>{s.toUpperCase()} ({mercados.filter(m=>m.status===s).length})</Badge>)}
            </div>
            {mercados.map(m=>(
              <Box key={m.id} style={{opacity:m.status==="resolvido"?.5:1,padding:"15px 17px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:11}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                      <span style={{fontSize:17}}>{m.emoji}</span>
                      <Badge cor={CAT_C[m.cat]||P.esmeralda}>{m.cat.toUpperCase()}</Badge>
                      {m.destaque&&<Badge cor={P.rubi}>🔥</Badge>}
                      {m.status==="resolvido"&&<Badge cor={P.esmeralda}>✓ {m.venc?.toUpperCase()} GANHOU</Badge>}
                    </div>
                    <p style={{fontSize:13.5,color:P.textoP,margin:"0 0 6px",lineHeight:1.4}}>{m.q}</p>
                    <div style={{fontSize:11,color:P.textoS,fontFamily:F.body}}>Pool: <b style={{color:P.ouro}}>{fmt(m.sim+m.nao)} pts</b> · SIM {fmt(m.sim)} · NÃO {fmt(m.nao)} · ⏰ {m.prazo}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                    {m.status==="aberto"&&<>
                      <Btn v="ouro" onClick={()=>setResolverM(m)} style={{padding:"6px 12px",fontSize:11}}>Resolver</Btn>
                      <Btn v="dark" onClick={()=>alternarD(m.id)} style={{padding:"6px 11px",fontSize:10}}>{m.destaque?"❌ Destaque":"🔥 Destaque"}</Btn>
                    </>}
                    <Btn v="ghost" onClick={()=>apagarM(m.id)} style={{padding:"6px 11px",fontSize:10,color:P.rubi}}>🗑️</Btn>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        )}

        {/* ═══ PARTICIPAÇÕES ═══ */}
        {aba==="parts"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <Box style={{padding:"13px 17px",background:`${P.ouro}08`,border:`1px solid ${P.ouro}25`}}>
              <p style={{fontSize:12.5,color:P.textoS,margin:0,fontFamily:F.body}}>💡 Verifica os comprovativos recebidos (e-Mola <b style={{color:P.textoP}}>{emola}</b>) antes de confirmar.</p>
            </Box>
            {["pendente","confirmado","rejeitado"].map(status=>{
              const grupo=parts.filter(a=>a.status===status); if(!grupo.length) return null;
              const sc={pendente:"#FFB020",confirmado:P.esmeralda,rejeitado:P.rubi}[status];
              return (
                <div key={status}>
                  <div style={{fontSize:10,color:P.textoS,letterSpacing:1.3,marginBottom:9,fontFamily:F.body}}>{status.toUpperCase()} ({grupo.length})</div>
                  {grupo.map(a=>{
                    const mkt=mercados.find(m=>m.id===a.mId);
                    return (
                      <Box key={a.id} style={{border:`1px solid ${sc}30`,padding:"13px 15px",marginBottom:9}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:11}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                              <Badge cor={a.lado==="sim"?P.esmeralda:P.rubi}>{a.lado.toUpperCase()}</Badge>
                              <Badge cor={P.ouro}>{a.met}</Badge>
                              <Badge cor={sc}>{a.status.toUpperCase()}</Badge>
                            </div>
                            <p style={{fontSize:12.5,color:P.textoP,margin:"0 0 5px",lineHeight:1.4}}>{mkt?.q||"Previsão removida"}</p>
                            <div style={{fontSize:11,color:P.textoS,fontFamily:F.body}}>
                              <b style={{color:P.textoP}}>{a.user}</b>{a.contacto?` · ${a.contacto}`:""} · Ref: <b style={{color:P.ouro}}>{a.id}</b> · <b style={{color:P.ouro}}>{fmt(a.val)} pts</b> · {a.data} {a.hora}
                            </div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                            {a.status==="pendente"&&<>
                              <Btn v="verde" onClick={()=>confirmarP(a.id)} style={{padding:"7px 12px",fontSize:11}}>✓ Confirmar</Btn>
                              <Btn v="ghost" onClick={()=>rejeitarP(a.id)} style={{padding:"5px 11px",fontSize:10,color:P.rubi}}>✗ Rejeitar</Btn>
                            </>}
                            <Btn v="ghost" onClick={()=>apagarP(a.id)} style={{padding:"4px 9px",fontSize:10,color:P.textoS}}>🗑️</Btn>
                          </div>
                        </div>
                      </Box>
                    );
                  })}
                </div>
              );
            })}
            {parts.length===0&&<p style={{color:P.textoS,textAlign:"center",padding:44,fontFamily:F.body}}>Nenhuma participação ainda.</p>}
          </div>
        )}

        {/* ═══ PAGAMENTOS — modo BETA configurável ═══ */}
        {aba==="pagamentos"&&(
          <div style={{display:"flex",flexDirection:"column",gap:15}}>
            <Box glow style={{border:`1px solid ${P.ouro}35`,background:`${P.ouro}06`}}>
              <h3 style={{color:P.ouro,fontSize:16.5,margin:"0 0 8px",fontFamily:F.body}}>🎓 Modo da Fase Beta</h3>
              <p style={{color:P.textoS,fontSize:12.5,marginBottom:16,fontFamily:F.body,lineHeight:1.6}}>Sem conta business ainda? Sem problema — escolhe como os participantes entram nos mercados agora.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {id:"gratuito",t:"🎯 Totalmente Gratuito",d:"Pontos simbólicos, sem dinheiro real. Ideal para validar a ideia."},
                  {id:"comprovativo",t:"📤 Por Comprovativo",d:"Participante envia e-Mola e partilha print. Tu confirmas manualmente."},
                ].map(opt=>(
                  <div key={opt.id} onClick={()=>setECfg(p=>({...p,modoPagamento:opt.id}))} style={{cursor:"pointer",padding:"14px 16px",borderRadius:13,border:`2px solid ${eCfg.modoPagamento===opt.id?P.esmeralda:"rgba(255,255,255,0.06)"}`,background:eCfg.modoPagamento===opt.id?`${P.esmeralda}10`:"transparent",transition:"all .2s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontWeight:700,color:eCfg.modoPagamento===opt.id?P.esmeralda:P.textoP,fontSize:13.5,fontFamily:F.body}}>{opt.t}</span>
                      {eCfg.modoPagamento===opt.id&&<span style={{color:P.esmeralda}}>✓</span>}
                    </div>
                    <p style={{fontSize:11.5,color:P.textoS,margin:"5px 0 0",fontFamily:F.body}}>{opt.d}</p>
                  </div>
                ))}
              </div>
            </Box>

            <Box>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
                <h3 style={{color:"#FFB020",fontSize:16,margin:0,fontFamily:F.body}}>📲 e-Mola (Movitel)</h3>
                <Badge cor={eEmola?"#FFB020":P.textoS}>{eEmola?"ACTIVO":"SEM NÚMERO"}</Badge>
              </div>
              <label style={LBL}>NÚMERO e-MOLA</label>
              <input value={eEmola} onChange={e=>setEEmola(e.target.value)} placeholder="87XXXXXXX" style={{...INP,fontSize:22,fontWeight:800,letterSpacing:2,marginBottom:13}}/>
              <label style={LBL}>TITULAR</label>
              <input value={CFG_BASE.owner} readOnly style={{...INP,opacity:.6}}/>
            </Box>

            <Box>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
                <h3 style={{color:"#FF7AA8",fontSize:16,margin:0,fontFamily:F.body}}>📱 M-Pesa (Vodacom)</h3>
                <Badge cor={eMpesa?"#FF7AA8":P.textoS}>{eMpesa?"ACTIVO":"INACTIVO"}</Badge>
              </div>
              <label style={LBL}>NÚMERO M-PESA</label>
              <input value={eMpesa} onChange={e=>setEMpesa(e.target.value)} placeholder="84XXXXXXX (opcional)" style={{...INP,fontSize:22,fontWeight:800,letterSpacing:2}}/>
            </Box>

            <Btn v="verde" onClick={()=>{guardarPay();guardarCfg();}} largo style={{padding:14,fontSize:14.5}}>💾 Guardar Configuração de Pagamentos</Btn>
          </div>
        )}

        {/* ═══ VALORES ═══ */}
        {aba==="valores"&&(
          <Box glow>
            <h3 style={{color:P.ouro,fontSize:19,marginBottom:7,fontFamily:F.display}}>⚙️ Valores & Taxas</h3>
            <p style={{color:P.textoS,fontSize:12.5,marginBottom:24,fontFamily:F.body,lineHeight:1.6}}>Define as regras financeiras da plataforma.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <label style={LBL}>TAXA DA PLATAFORMA (%)</label>
                <input type="number" value={eCfg.taxa} min={5} max={50} onChange={e=>setECfg(p=>({...p,taxa:Math.max(5,Math.min(50,+e.target.value))}))} style={{...INP,fontSize:23,fontWeight:800}}/>
                <div style={{fontSize:10,color:P.textoS,marginTop:5,fontFamily:F.body}}>{eCfg.taxa}% → Plataforma · {100-eCfg.taxa}% → Ganhadores</div>
              </div>
              <div>
                <label style={LBL}>MÍNIMO (pts/MZN)</label>
                <input type="number" value={eCfg.minVal} min={10} onChange={e=>setECfg(p=>({...p,minVal:Math.max(10,+e.target.value)}))} style={{...INP,fontSize:23,fontWeight:800}}/>
              </div>
              <div>
                <label style={LBL}>MÁXIMO (pts/MZN)</label>
                <input type="number" value={eCfg.maxVal} min={1000} onChange={e=>setECfg(p=>({...p,maxVal:Math.max(1000,+e.target.value)}))} style={{...INP,fontSize:23,fontWeight:800}}/>
              </div>
            </div>
            <Box style={{marginTop:22,background:"rgba(0,230,118,0.04)"}}>
              <div style={{fontSize:10,color:P.esmeralda,fontWeight:800,letterSpacing:1.2,marginBottom:11,fontFamily:F.body}}>📐 SIMULAÇÃO COM TAXA {eCfg.taxa}%</div>
              <div style={{fontSize:12.5,color:P.textoS,fontFamily:F.body,lineHeight:2.2}}>
                <div>SIM: 100 × 500 = <b style={{color:P.textoP}}>50.000 pts</b></div>
                <div>NÃO: 50 × 500 = <b style={{color:P.textoP}}>25.000 pts</b></div>
                <div style={{color:P.esmeralda}}>→ Ganhadores SIM: {fmt(Math.round(25000*(1-eCfg.taxa/100)))} pts</div>
                <div style={{color:P.ouro}}>→ Plataforma: {fmt(Math.round(25000*(eCfg.taxa/100)))} pts</div>
              </div>
            </Box>
            <Btn v="verde" onClick={guardarCfg} largo style={{marginTop:22,padding:14,fontSize:14.5}}>💾 Guardar Valores</Btn>
          </Box>
        )}

        {/* ═══ SISTEMA ═══ */}
        {aba==="sistema"&&(
          <div style={{display:"flex",flexDirection:"column",gap:15}}>
            <Box>
              <h3 style={{color:P.ouro,fontSize:16,marginBottom:15,fontFamily:F.body}}>📊 Estado do Sistema</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
                {[["Proprietário",CFG_BASE.owner],["e-Mola",emola||"Não configurado"],["Modo Pagamento",cfg.modoPagamento==="gratuito"?"Gratuito (Beta)":"Comprovativo"],["Taxa",`${cfg.taxa}%`],["Mín.",`${fmt(cfg.minVal)}`],["Máx.",`${fmt(cfg.maxVal)}`],["Mercados Abertos",mercados.filter(m=>m.status==="aberto").length],["Pool Total",`${fmt(totalPool)} pts`]].map(([k,v])=>(
                  <div key={k} style={{background:"rgba(255,255,255,.025)",borderRadius:11,padding:"11px 13px"}}>
                    <div style={{fontSize:9,color:P.textoS,letterSpacing:1,marginBottom:4,fontFamily:F.body}}>{k.toUpperCase()}</div>
                    <div style={{fontSize:13.5,fontWeight:700,color:P.textoP,fontFamily:F.body}}>{v}</div>
                  </div>
                ))}
              </div>
            </Box>
            <Box style={{background:`${P.esmeralda}06`,border:`1px solid ${P.esmeralda}25`}}>
              <h3 style={{color:P.esmeralda,fontSize:15,marginBottom:13,fontFamily:F.body}}>💾 Base de Dados</h3>
              <p style={{color:P.textoS,fontSize:12.5,lineHeight:1.7,fontFamily:F.body,marginBottom:14}}>
                Dados guardados automaticamente neste dispositivo. Para multi-utilizador real (qualquer pessoa em Moçambique acede e os dados sincronizam), liga ao Supabase com o ficheiro SQL fornecido.
              </p>
            </Box>
            <Box>
              <h3 style={{color:P.ouro,fontSize:15,marginBottom:13,fontFamily:F.body}}>🔒 Credenciais</h3>
              <div style={{background:`${P.ouro}08`,border:`1px solid ${P.ouro}25`,borderRadius:11,padding:15,fontSize:12.5,color:P.textoS,fontFamily:F.body,lineHeight:1.8}}>
                Utilizador: <b style={{color:P.textoP}}>alberto</b><br/>
                Palavra-passe: <b style={{color:P.textoP}}>MzPrediz@2026</b>
              </div>
            </Box>
            <Box>
              <h3 style={{color:P.esmeralda,fontSize:15,marginBottom:17,fontFamily:F.body}}>🚀 Para Lançar no Mercado Real</h3>
              {[["🏢","Registo Legal","Regista MzPrediz Lda no APIE. «Mercado de previsão», não apostas."],["📲","e-Mola Business","Movitel Business para limites de transacção superiores."],["🌐","Domínio","mzprediz.co.mz (UTIC) ou mzprediz.com."],["💻","Base de Dados","Supabase já configurado — falta correr o SQL fornecido."],["⚖️","Legal","Consulta um advogado em Maputo antes do lançamento público."],["📢","Marketing","WhatsApp, Facebook MZ, podcasts, TVM, jornais online."]].map(([i,t,d])=>(
                <div key={t} style={{display:"flex",gap:13,marginBottom:14,alignItems:"flex-start"}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:`${P.esmeralda}12`,border:`1px solid ${P.esmeralda}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{i}</div>
                  <div><div style={{fontSize:13.5,fontWeight:700,color:P.textoP,marginBottom:4,fontFamily:F.body}}>{t}</div><div style={{fontSize:11.5,color:P.textoS,fontFamily:F.body,lineHeight:1.5}}>{d}</div></div>
                </div>
              ))}
            </Box>
          </div>
        )}
      </div>

      {resolverM&&(
        <Overlay fechar={()=>setResolverM(null)}>
          <h3 style={{color:P.ouro,marginBottom:9,fontSize:18,fontFamily:F.display}}>Resolver Previsão</h3>
          <p style={{color:P.textoS,fontSize:13,marginBottom:15,lineHeight:1.5,fontFamily:F.body}}>{resolverM.emoji} {resolverM.q}</p>
          <Box style={{marginBottom:17}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,fontSize:12,fontFamily:F.body}}>
              {[["SIM",resolverM.sim,P.esmeralda],["NÃO",resolverM.nao,P.rubi]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:11,color:c,fontWeight:700}}>{l}</div>
                  <div style={{fontSize:19,fontWeight:800,color:c}}>{fmt(v)} pts</div>
                  <div style={{fontSize:10,color:P.textoS}}>{pct(v,resolverM.sim+resolverM.nao-v)}% do consenso</div>
                </div>
              ))}
            </div>
          </Box>
          <p style={{color:P.textoS,fontSize:12.5,marginBottom:15,textAlign:"center",fontFamily:F.body}}>Resultado real, baseado em fontes verificadas:</p>
          <div style={{display:"flex",gap:10}}>
            <Btn v="sim" onClick={()=>resolver(resolverM.id,"sim")} style={{flex:1,padding:14}}>✓ SIM Aconteceu</Btn>
            <Btn v="nao" onClick={()=>resolver(resolverM.id,"nao")} style={{flex:1,padding:14}}>✗ NÃO Aconteceu</Btn>
          </div>
          <Btn v="ghost" onClick={()=>setResolverM(null)} largo style={{marginTop:11,padding:11}}>Cancelar</Btn>
        </Overlay>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SECÇÃO INÍCIO — pública, vibrante
// ═══════════════════════════════════════════════════════════
function SecaoInicio({mercados,cfg,totalPool,totalPart,abertos,irParaMercados,setPartic,setDetalhe,setPartilhar}) {
  const destaques=abertos.filter(m=>m.destaque).slice(0,3);
  return (
    <div>
      <div style={{textAlign:"center",padding:"64px 0 40px"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:9,background:`${P.ouro}12`,border:`1px solid ${P.ouro}35`,borderRadius:22,padding:"7px 18px",marginBottom:22,boxShadow:`0 0 24px ${P.ouro}15`}}>
          <span style={{fontSize:10.5,color:P.ouro,fontWeight:800,letterSpacing:1.6,fontFamily:F.body}}>🇲🇿 PLATAFORMA NACIONAL DE PREVISÕES · BETA</span>
        </div>
        <h1 style={{fontSize:"clamp(32px,6.5vw,60px)",fontWeight:700,lineHeight:1.1,marginBottom:16,fontFamily:F.display}}>
          <span style={{background:`linear-gradient(120deg,${P.esmeralda} 0%,${P.ouroBrilho} 50%,${P.terracota} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 30px rgba(0,230,118,0.25))"}}>O povo prevê</span><br/>
          <span style={{color:P.textoP}}>o futuro de Moçambique.</span>
        </h1>
        <p style={{color:P.textoS,fontSize:15.5,maxWidth:540,margin:"0 auto 34px",lineHeight:1.8,fontFamily:F.body}}>Mercados de previsão responsáveis onde cidadãos e analistas participam com base em dados, metodologia e análise rigorosa.</p>
        <div style={{display:"flex",gap:13,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn v="verde" onClick={irParaMercados} style={{padding:"15px 32px",fontSize:15.5}}>Ver Previsões →</Btn>
          <Btn v="dark" onClick={()=>window.scrollTo({top:560,behavior:"smooth"})} style={{padding:"15px 24px",fontSize:14.5}}>Como Funciona</Btn>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:48}}>
        {[{i:"💰",v:`${fmt(totalPool)}`,l:"Pontos em jogo"},{i:"👥",v:fmt(totalPart+1240),l:"Participantes"},{i:"📊",v:abertos.length,l:"Previsões abertas"},{i:"🌍",v:"SADC",l:"Expansão"}].map(s=>(
          <Box key={s.l} style={{textAlign:"center",padding:"18px 11px"}} glow>
            <div style={{fontSize:23,marginBottom:7}}>{s.i}</div>
            <div style={{fontSize:"clamp(13px,2.3vw,18px)",fontWeight:800,color:P.ouro,fontFamily:F.body}}>{s.v}</div>
            <div style={{fontSize:9.5,color:P.textoS,marginTop:4,letterSpacing:.7,fontFamily:F.body}}>{s.l.toUpperCase()}</div>
          </Box>
        ))}
      </div>

      {destaques.length>0&&(
        <div style={{marginBottom:48}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{color:P.ouro,fontSize:21,margin:0,fontFamily:F.display}}>🔥 Em Destaque</h2>
            <button onClick={irParaMercados} style={{background:"none",border:`1px solid ${P.borda}`,borderRadius:9,padding:"7px 15px",color:P.esmeralda,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F.body}}>Ver Todos →</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {destaques.map(m=><CardPrevisao key={m.id} m={m} taxa={cfg.taxa} onParticipar={(m2,l)=>setPartic({m:m2,lado:l})} onDetalhe={setDetalhe} onPartilhar={setPartilhar}/>)}
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:48}}>
        {[{i:"📐",t:"Análise Rigorosa",d:"Cada previsão tem metodologia, fontes e contexto. Decisões baseadas em dados.",c:P.esmeralda},{i:"🎓",t:"Compromisso Educativo",d:"Cada mercado é uma lição de análise crítica. Aprendes enquanto participas.",c:P.ouro},{i:"🔒",t:"Transparência Total",d:"Todos os valores e resultados são públicos e verificáveis.",c:P.terracota}].map(p=>(
          <Box key={p.t} style={{textAlign:"center",border:`1px solid ${p.c}25`}}>
            <div style={{fontSize:32,marginBottom:11,filter:`drop-shadow(0 0 10px ${p.c}40)`}}>{p.i}</div>
            <h3 style={{color:p.c,fontSize:14,marginBottom:8,fontFamily:F.body}}>{p.t}</h3>
            <p style={{color:P.textoS,fontSize:12,margin:0,lineHeight:1.6,fontFamily:F.body}}>{p.d}</p>
          </Box>
        ))}
      </div>

      <div style={{marginBottom:48}}>
        <h2 style={{color:P.ouro,fontSize:23,marginBottom:26,fontFamily:F.display}}>Como Funciona?</h2>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {[{n:"01",t:"Escolhe uma Previsão",d:"Navega pelos mercados. Lê a metodologia e as fontes antes de participar.",i:"🔍"},{n:"02",t:"Analisa os Dados",d:"Estuda o histórico e o consenso do mercado. Não participes por emoção.",i:"🧠"},{n:"03",t:"Escolhe SIM ou NÃO",d:"Com base na tua análise, decide. O multiplicador mostra o retorno em tempo real.",i:"📊"},{n:"04",t:"Participa",d:cfg.modoPagamento==="gratuito"?"Participação gratuita em pontos durante a fase Beta.":"Envia o comprovativo via e-Mola com a referência fornecida.",i:"💰"},{n:"05",t:"Acompanha",d:"O consenso e o multiplicador actualizam-se com cada nova participação.",i:"🔄"},{n:"06",t:"Retorno",d:`Correctos recebem o pool + ${100-cfg.taxa}% do pool errado.`,i:"🏆"}].map(s=>(
            <Box key={s.n} style={{display:"flex",gap:17,padding:"17px 19px",alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:`${P.esmeralda}14`,border:`2px solid ${P.esmeralda}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,boxShadow:`0 0 16px ${P.esmeralda}25`}}>{s.i}</div>
              <div>
                <div style={{fontSize:10,color:P.esmeralda,fontWeight:800,letterSpacing:1.6,marginBottom:4,fontFamily:F.body}}>PASSO {s.n}</div>
                <div style={{fontSize:15,fontWeight:700,color:P.textoP,marginBottom:5,fontFamily:F.display}}>{s.t}</div>
                <div style={{fontSize:12.5,color:P.textoS,lineHeight:1.6,fontFamily:F.body}}>{s.d}</div>
              </div>
            </Box>
          ))}
        </div>
      </div>

      <Box style={{marginBottom:48,textAlign:"center"}} glow>
        <div style={{fontSize:44,marginBottom:14}}>🇲🇿</div>
        <h2 style={{color:P.ouro,fontSize:22,marginBottom:12,fontFamily:F.display}}>Sobre a MzPrediz</h2>
        <p style={{color:P.textoS,fontSize:14.5,maxWidth:560,margin:"0 auto 18px",lineHeight:1.8,fontFamily:F.body}}>Nascemos em Moçambique com uma missão: usar a inteligência colectiva do povo para iluminar o futuro do país. Não somos uma plataforma de apostas — somos um instrumento de análise cívica, económica e social.</p>
        <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:5}}>
          <div style={{fontSize:14,fontWeight:700,color:P.textoP,fontFamily:F.body}}>{CFG_BASE.owner}</div>
          <div style={{fontSize:11.5,color:P.esmeralda,fontFamily:F.body}}>Fundador & CEO</div>
        </div>
      </Box>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECÇÃO MERCADOS
// ═══════════════════════════════════════════════════════════
function SecaoMercados({mercados,cfg,totalPool,abertos,setPartic,setDetalhe,setPartilhar}) {
  const [cat,setCat]=useState("todos");
  const [pesq,setPesq]=useState("");
  const [ordem,setOrdem]=useState("destaque");
  const cats=["todos",...new Set(abertos.map(m=>m.cat))];
  const filtrados=abertos.filter(m=>(cat==="todos"||m.cat===cat)&&(!pesq||m.q.toLowerCase().includes(pesq.toLowerCase())));
  const ordenados={destaque:[...filtrados].sort((a,b)=>(b.destaque?1:0)-(a.destaque?1:0)),volume:[...filtrados].sort((a,b)=>(b.sim+b.nao)-(a.sim+a.nao)),recentes:[...filtrados].sort((a,b)=>b.criado.localeCompare(a.criado))}[ordem]||filtrados;

  return (
    <div style={{padding:"34px 0 22px"}}>
      <h2 style={{color:P.ouro,fontSize:26,marginBottom:5,fontFamily:F.display}}>Mercados de Previsão</h2>
      <p style={{color:P.textoS,fontSize:13.5,marginBottom:22,fontFamily:F.body}}>{abertos.length} previsões abertas · {fmt(totalPool)} pts em análise colectiva</p>
      <div style={{display:"flex",gap:11,marginBottom:15,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,color:P.textoS}}>🔍</span>
          <input value={pesq} onChange={e=>setPesq(e.target.value)} placeholder="Pesquisar previsões..." style={{...INP,paddingLeft:38,borderRadius:12}}/>
        </div>
        <select value={ordem} onChange={e=>setOrdem(e.target.value)} style={{...INP,width:"auto",padding:"12px 15px",cursor:"pointer"}}>
          <option value="destaque">🔥 Destaque</option>
          <option value="volume">💰 Maior Volume</option>
          <option value="recentes">🆕 Mais Recentes</option>
        </select>
      </div>
      <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:5,marginBottom:20}}>
        {cats.map(c=>{const ac=c===cat,cc=CAT_C[c]||P.esmeralda;return <button key={c} onClick={()=>setCat(c)} style={{padding:"8px 14px",borderRadius:24,fontSize:11.5,fontWeight:800,whiteSpace:"nowrap",border:`1px solid ${ac?cc:"rgba(255,255,255,0.06)"}`,background:ac?`${cc}22`:"transparent",color:ac?cc:P.textoS,cursor:"pointer",fontFamily:F.body,boxShadow:ac?`0 0 16px ${cc}25`:"none"}}>{c==="todos"?"🌍 TODOS":`${CAT_I[c]||""} ${c.toUpperCase()}`}</button>;})}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,paddingBottom:44}}>
        {ordenados.length===0&&<p style={{textAlign:"center",color:P.textoS,padding:50,fontFamily:F.body}}>Nenhuma previsão encontrada.</p>}
        {ordenados.map(m=><CardPrevisao key={m.id} m={m} taxa={cfg.taxa} onParticipar={(m2,l)=>setPartic({m:m2,lado:l})} onDetalhe={setDetalhe} onPartilhar={setPartilhar}/>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECÇÃO RANKING — competição social, motor de retenção
// ═══════════════════════════════════════════════════════════
function SecaoRanking({parts}) {
  const confirmadas = parts.filter(p=>p.status==="confirmado");
  const porUser = {};
  confirmadas.forEach(p=>{
    const nome = p.user||"Anónimo";
    if(!porUser[nome]) porUser[nome]={nome,total:0,participacoes:0};
    porUser[nome].total += Number(p.val)||0;
    porUser[nome].participacoes += 1;
  });
  const ranking = Object.values(porUser).sort((a,b)=>b.total-a.total).slice(0,20);
  const medalha = i => i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}º`;

  return (
    <div style={{padding:"34px 0 22px"}}>
      <h2 style={{color:P.ouro,fontSize:26,marginBottom:5,fontFamily:F.display}}>🏆 Ranking de Previsores</h2>
      <p style={{color:P.textoS,fontSize:13.5,marginBottom:26,fontFamily:F.body}}>Os participantes mais activos da MzPrediz. Convida amigos e sobe no ranking!</p>

      {ranking.length===0?(
        <Box style={{textAlign:"center",padding:50}}>
          <div style={{fontSize:36,marginBottom:12}}>🌱</div>
          <p style={{color:P.textoS,fontFamily:F.body}}>Ainda não há participações confirmadas. Sê o primeiro no ranking!</p>
        </Box>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {ranking.map((r,i)=>(
            <div key={r.nome} style={{display:"flex",alignItems:"center",gap:16,background:i<3?`linear-gradient(90deg, ${P.ouro}10, transparent)`:"rgba(255,255,255,0.025)",border:`1px solid ${i<3?P.ouro+"35":P.borda}`,borderRadius:16,padding:"16px 18px",boxShadow:i===0?`0 0 24px ${P.ouro}20`:"none"}}>
              <div style={{fontSize:i<3?24:15,fontWeight:800,color:i<3?P.ouro:P.textoS,minWidth:36,textAlign:"center",fontFamily:F.body}}>{medalha(i)}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14.5,fontWeight:700,color:P.textoP,fontFamily:F.body}}>{r.nome}</div>
                <div style={{fontSize:11,color:P.textoS,fontFamily:F.body}}>{r.participacoes} previsões feitas</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:16,fontWeight:800,color:P.esmeralda,fontFamily:F.body}}>{fmt(r.total)}</div>
                <div style={{fontSize:9,color:P.textoS,fontFamily:F.body,letterSpacing:.5}}>PONTOS</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Box style={{marginTop:28,textAlign:"center",background:`${P.esmeralda}08`,border:`1px solid ${P.esmeralda}25`}}>
        <p style={{color:P.textoP,fontSize:13.5,margin:0,fontFamily:F.body,lineHeight:1.7}}>💡 <b>Quanto mais participas e convidas amigos, mais sobes no ranking.</b><br/>Os melhores previsores do mês podem vir a ganhar prémios reais.</p>
      </Box>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// SUPABASE — base de dados real, multi-utilizador
// ═══════════════════════════════════════════════════════════
const SUPA_URL = "https://vmnnrtrosummwvxrcjcq.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtbm5ydHJvc3VtbXd2eHJjamNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMTM2NjQsImV4cCI6MjA5Njg4OTY2NH0.ti4sRQT0fV8sF3O46D3CZwLZed6NEIkiaSaeT5QI-5g";

const db = {
  get: async (tabela, filtros={}) => {
    try {
      let url = `${SUPA_URL}/rest/v1/${tabela}?select=*`;
      Object.entries(filtros).forEach(([k,v]) => { url += `&${k}=eq.${v}`; });
      const r = await fetch(url, { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } });
      if (!r.ok) return [];
      return await r.json();
    } catch { return []; }
  },
  inserir: async (tabela, dados) => {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${tabela}`, {
        method: "POST",
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(dados)
      });
      if (!r.ok) return null;
      const res = await r.json();
      return Array.isArray(res) ? res[0] : res;
    } catch { return null; }
  },
  actualizar: async (tabela, id, dados) => {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${tabela}?id=eq.${id}`, {
        method: "PATCH",
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      return r.ok;
    } catch { return false; }
  },
  apagar: async (tabela, id) => {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/${tabela}?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
      });
      return r.ok;
    } catch { return false; }
  },
  cfg: async () => {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/configuracao?id=eq.1`, {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
      });
      if (!r.ok) return null;
      const data = await r.json();
      return data[0] || null;
    } catch { return null; }
  },
  guardarCfg: async (dados) => {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/configuracao?id=eq.1`, {
        method: "PATCH",
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      return r.ok;
    } catch { return false; }
  }
};

// Fallback local quando Supabase não está disponível
const storageGet = async (key) => { try { return await window.storage.get(key); } catch { return null; } };
const storageSet = async (key, val) => { try { await window.storage.set(key, JSON.stringify(val)); } catch {} };


// ═══════════════════════════════════════════════════════════
// CONTADOR DE TEMPO RESTANTE
// ═══════════════════════════════════════════════════════════
function ContadorPrazo({prazo, tamanho="normal"}) {
  const [agr,setAgr] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setAgr(new Date()),60000); return ()=>clearInterval(t); },[]);

  const calcRest = () => {
    if(!prazo) return null;
    let fim;
    // Suporta ISO (2026-12-31), texto (31 Dez 2026), ou datetime
    if(/^\d{4}-\d{2}-\d{2}/.test(prazo)) {
      fim = new Date(prazo);
    } else {
      const meses={"Jan":"01","Fev":"02","Mar":"03","Abr":"04","Mai":"05","Jun":"06","Jul":"07","Ago":"08","Set":"09","Out":"10","Nov":"11","Dez":"12"};
      const partes = prazo.split(" ");
      if(partes.length>=3) fim = new Date(`${partes[2]}-${meses[partes[1]]||"01"}-${partes[0].padStart(2,"0")}`);
      else return null;
    }
    const diff = fim - agr;
    if(diff<=0) return {txt:"Encerrado",cor:P.rubi,urgente:false,encerrado:true};
    const mins  = Math.floor(diff/60000);
    const horas = Math.floor(diff/3600000);
    const dias  = Math.floor(diff/86400000);
    const meses = Math.floor(dias/30);
    if(mins<60)  return {txt:`${mins}min restantes`,cor:P.rubi,urgente:true,encerrado:false};
    if(horas<24) return {txt:`${horas}h restantes`,cor:P.rubi,urgente:true,encerrado:false};
    if(dias<=3)  return {txt:`${dias} dias restantes`,cor:P.rubi,urgente:true,encerrado:false};
    if(dias<=7)  return {txt:`${dias} dias restantes`,cor:"#FFB020",urgente:false,encerrado:false};
    if(meses<1)  return {txt:`${dias} dias restantes`,cor:"#FFB020",urgente:false,encerrado:false};
    return {txt:`${meses} ${meses===1?"mês":"meses"} restantes`,cor:P.textoS,urgente:false,encerrado:false};
  };

  const r = calcRest();
  if(!r) return null;
  const fs = tamanho==="grande" ? 12 : 10;
  return (
    <span style={{
      fontSize:fs, color:r.cor, fontFamily:F.body, fontWeight:r.urgente?800:400,
      animation:r.urgente?"pulse 1.5s infinite":"none",
      display:"inline-flex", alignItems:"center", gap:4
    }}>
      ⏰ {r.txt}
    </span>
  );
}

// Badge de estado do mercado — mostra claramente se está aberto, encerrado ou resolvido
function BadgeEstado({m}) {
  const prazoPassado = m.prazo && (() => {
    let fim;
    if(/^\d{4}-\d{2}-\d{2}/.test(m.prazo)) fim = new Date(m.prazo);
    else {
      const meses={"Jan":"01","Fev":"02","Mar":"03","Abr":"04","Mai":"05","Jun":"06","Jul":"07","Ago":"08","Set":"09","Out":"10","Nov":"11","Dez":"12"};
      const p=m.prazo.split(" ");
      if(p.length>=3) fim=new Date(`${p[2]}-${meses[p[1]]||"01"}-${p[0].padStart(2,"0")}`);
    }
    return fim && fim < new Date();
  })();

  if(m.status==="resolvido") return <Badge cor={P.esmeralda} glow>✓ {m.venc?.toUpperCase()} GANHOU</Badge>;
  if(prazoPassado) return <Badge cor={P.rubi}>🔒 ENCERRADO</Badge>;
  return <Badge cor={P.esmeralda}>🟢 ABERTO</Badge>;
}



// ═══════════════════════════════════════════════════════════
// SECÇÃO SOBRE
// ═══════════════════════════════════════════════════════════
function SecaoSobre() {
  return (
    <div style={{padding:"34px 0 22px"}}>
      <h2 style={{color:P.ouro,fontSize:26,marginBottom:5,fontFamily:F.display}}>🇲🇿 Sobre a MzPrediz</h2>
      <p style={{color:P.textoS,fontSize:13.5,marginBottom:28,fontFamily:F.body}}>A primeira plataforma nacional de mercados de previsão de Moçambique.</p>

      <Box glow style={{marginBottom:18,textAlign:"center",padding:"32px 24px"}}>
        <div style={{fontSize:48,marginBottom:14}}>🇲🇿</div>
        <h3 style={{color:P.ouro,fontSize:22,marginBottom:12,fontFamily:F.display}}>A Nossa Missão</h3>
        <p style={{color:P.textoS,fontSize:14.5,maxWidth:540,margin:"0 auto",lineHeight:1.8,fontFamily:F.body}}>
          Nascemos em Moçambique com uma missão: usar a inteligência colectiva do povo para iluminar o futuro do país. Não somos uma plataforma de apostas — somos um instrumento de análise cívica, económica e social que ajuda cidadãos, decisores e investidores a compreender o que a maioria realmente acredita.
        </p>
      </Box>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:18}}>
        {[
          {i:"🎯",t:"Visão 2030",d:"Ser a plataforma de referência para mercados de previsão em toda a África Austral, começando por Moçambique.",c:P.esmeralda},
          {i:"🌍",t:"Expansão SADC",d:"Moçambique → Tanzânia → Zimbabué → África do Sul. Um mercado africano unificado de previsões.",c:P.ouro},
          {i:"📈",t:"Para Investidores",d:"Dados únicos sobre o sentimento do mercado moçambicano. Indicadores antecipados que não existem em nenhum outro lugar.",c:P.terracota},
          {i:"🏛️",t:"Para o País",d:"Cada previsão é um termómetro da opinião pública. Apoia decisores, jornalistas e organizações da sociedade civil.",c:"#B388FF"},
        ].map(p=>(
          <Box key={p.t} style={{textAlign:"center",border:`1px solid ${p.c}25`}}>
            <div style={{fontSize:28,marginBottom:10}}>{p.i}</div>
            <h3 style={{color:p.c,fontSize:14,marginBottom:8,fontFamily:F.body}}>{p.t}</h3>
            <p style={{color:P.textoS,fontSize:12,margin:0,lineHeight:1.6,fontFamily:F.body}}>{p.d}</p>
          </Box>
        ))}
      </div>

      <Box style={{textAlign:"center",background:`${P.esmeralda}06`,border:`1px solid ${P.esmeralda}25`}}>
        <div style={{fontSize:20,marginBottom:8}}>👤</div>
        <h3 style={{color:P.textoP,fontSize:17,margin:"0 0 4px",fontFamily:F.display}}>Alberto Tomás Guambe</h3>
        <p style={{color:P.esmeralda,fontSize:12,margin:"0 0 12px",fontFamily:F.body}}>Fundador & CEO</p>
        <p style={{color:P.textoS,fontSize:13,lineHeight:1.8,fontFamily:F.body,maxWidth:420,margin:"0 auto 16px"}}>
          Empreendedor moçambicano que acredita que o povo de Moçambique tem a sabedoria colectiva para prever e moldar o futuro do país. A MzPrediz é o instrumento para tornar essa sabedoria visível e útil.
        </p>
        <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:P.esmeralda,background:`${P.esmeralda}15`,padding:"5px 14px",borderRadius:20,fontFamily:F.body,border:`1px solid ${P.esmeralda}30`}}>📲 e-Mola: 879937763</span>
          <span style={{fontSize:11,color:P.ouro,background:`${P.ouro}15`,padding:"5px 14px",borderRadius:20,fontFamily:F.body,border:`1px solid ${P.ouro}30`}}>🇲🇿 Maputo, Moçambique</span>
        </div>
      </Box>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECÇÃO COMO FUNCIONA
// ═══════════════════════════════════════════════════════════
function SecaoComo({cfg}) {
  return (
    <div style={{padding:"34px 0 22px"}}>
      <h2 style={{color:P.ouro,fontSize:26,marginBottom:5,fontFamily:F.display}}>🎓 Como Funciona?</h2>
      <p style={{color:P.textoS,fontSize:13.5,marginBottom:28,fontFamily:F.body}}>MzPrediz é um <b style={{color:P.textoP}}>mercado de previsão</b> — diferente das apostas tradicionais. Cada mercado é uma pergunta sobre o futuro com resposta SIM ou NÃO, baseada em análise e dados.</p>

      <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:28}}>
        {[
          {n:"01",t:"Escolhe uma Previsão",d:"Navega pelos mercados abertos. Lê a metodologia e as fontes antes de participar. Toma uma decisão informada.",i:"🔍"},
          {n:"02",t:"Analisa os Dados",d:"Estuda o histórico, as fontes indicadas e o consenso do mercado. Não participes por emoção — participa por análise.",i:"🧠"},
          {n:"03",t:"Escolhe SIM ou NÃO",d:"Com base na tua análise, decide. O multiplicador mostra o teu retorno potencial em tempo real.",i:"📊"},
          {n:"04",t:"Participa",d:cfg?.modoPagamento==="gratuito"?"Fase Beta: participação gratuita com pontos simbólicos. Sem dinheiro real ainda.":"Envia via e-Mola com a referência única fornecida. O admin confirma em 30 minutos.",i:"💰"},
          {n:"05",t:"Acompanha o Mercado",d:"O consenso e o multiplicador actualizam-se com cada nova participação. Vê como a tua previsão se compara com a maioria.",i:"🔄"},
          {n:"06",t:"Resolução & Retorno",d:`Quando o evento acontece, declaramos o vencedor com base em fontes verificáveis. Correctos recebem o pool + ${100-(cfg?.taxa||25)}% do pool errado.`,i:"🏆"},
        ].map(s=>(
          <Box key={s.n} style={{display:"flex",gap:17,padding:"17px 19px",alignItems:"flex-start"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`${P.esmeralda}14`,border:`2px solid ${P.esmeralda}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0,boxShadow:`0 0 16px ${P.esmeralda}25`}}>{s.i}</div>
            <div>
              <div style={{fontSize:10,color:P.esmeralda,fontWeight:800,letterSpacing:1.6,marginBottom:4,fontFamily:F.body}}>PASSO {s.n}</div>
              <div style={{fontSize:15,fontWeight:700,color:P.textoP,marginBottom:5,fontFamily:F.display}}>{s.t}</div>
              <div style={{fontSize:12.5,color:P.textoS,lineHeight:1.6,fontFamily:F.body}}>{s.d}</div>
            </div>
          </Box>
        ))}
      </div>

      <Box style={{marginBottom:20,background:"rgba(0,230,118,0.04)"}}>
        <h3 style={{color:P.ouro,fontSize:15,marginBottom:12,fontFamily:F.body}}>📐 Fórmula de Distribuição</h3>
        <div style={{background:"rgba(0,0,0,.35)",borderRadius:10,padding:14,fontFamily:F.mono,fontSize:12,color:P.textoP,lineHeight:2}}>
          <div style={{color:P.esmeralda}}>Retorno = (Pool_Ganhador + Pool_Perdedor × {(100-(cfg?.taxa||25))/100}) ÷ Pool_Ganhador</div>
          <div style={{color:P.ouro}}>Plataforma retém {cfg?.taxa||25}% do pool perdedor</div>
        </div>
        <p style={{fontSize:12,color:P.textoS,marginTop:12,lineHeight:1.6,fontFamily:F.body}}>
          <b>Exemplo:</b> 100 participantes em SIM (10.000 pts) e 50 em NÃO (5.000 pts). SIM ganha: cada participante SIM recebe o seu valor × 1,375. A plataforma retém 1.250 pts.
        </p>
      </Box>

      <Box style={{background:`${P.ouro}07`,border:`1px solid ${P.ouro}20`}}>
        <h3 style={{color:P.ouro,fontSize:15,marginBottom:12,fontFamily:F.body}}>🎓 Porque Somos Diferentes das Apostas</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            ["Não é um casino","Cada mercado tem base analítica e fontes verificáveis. Não existem mercados aleatórios."],
            ["Educação primeiro","Antes de participar, tens acesso à metodologia. Aprendes enquanto participas."],
            ["Transparência total","Todos os pools, participações e resultados são públicos e auditáveis."],
            ["Responsabilidade","Limites de participação. Avisos claros de risco. Compromisso com o participante."],
          ].map(([t,d])=>(
            <div key={t} style={{background:"rgba(0,0,0,.2)",borderRadius:10,padding:12}}>
              <div style={{fontSize:12,fontWeight:700,color:P.textoP,marginBottom:5,fontFamily:F.body}}>✓ {t}</div>
              <div style={{fontSize:11,color:P.textoS,lineHeight:1.5,fontFamily:F.body}}>{d}</div>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [vista,setVista]       = useState("publica");
  const [secao,setSecao]       = useState("inicio");
  const [mercados,setMercados] = useState(MERCADOS_BASE);
  const [parts,setParts]       = useState(PART_BASE);
  const [emola,setEmola]       = useState(CFG_BASE.emola);
  const [mpesa,setMpesa]       = useState(CFG_BASE.mpesa);
  const [cfg,setCfg]           = useState({taxa:25,minVal:10,maxVal:50000,modoPagamento:"gratuito"});
  const [carregando,setCarreg] = useState(true);
  const [toast,setToast]       = useState("");
  const [participar,setPartic] = useState(null);
  const [detalhe,setDetalhe]   = useState(null);
  const [partilhar,setPartilhar] = useState(null);
  const [notifFechadas,setNotifFechadas] = useState([]);
  const [notificacoes,setNotifs] = useState([]);
  const [ticker,setTicker]     = useState(0);

  const notif = m => { setToast(m); setTimeout(()=>setToast(""),3000); };
  const addNotif = n => setNotifs(p=>[n,...p].slice(0,5));
  const fecharNotif = i => setNotifs(p=>p.filter((_,j)=>j!==i));

  // Carrega dados do Supabase
  useEffect(()=>{
    const carregar = async () => {
      try {
        // Tenta Supabase primeiro
        const [mData, pData, cData] = await Promise.all([
          db.get("mercados"),
          db.get("participacoes"),
          db.cfg()
        ]);

        if (mData && mData.length > 0) {
          // Converte formato Supabase para formato da app
          const mercadosFormatados = mData.map(m => ({
            id: m.id,
            cat: m.categoria,
            q: m.pergunta,
            emoji: m.emoji || "❓",
            prazo: m.prazo ? new Date(m.prazo).toLocaleDateString("pt-PT",{day:"numeric",month:"short",year:"numeric"}) : "",
            sim: Number(m.sim) || 0,
            nao: Number(m.nao) || 0,
            destaque: m.destaque || false,
            status: m.status || "aberto",
            criado: m.criado_em ? m.criado_em.slice(0,10) : hoje(),
            vol: [Number(m.sim)||0],
            met: m.metodologia || "",
            fontes: m.fontes || "",
            venc: m.vencedor || null,
          }));
          setMercados(mercadosFormatados);
        } else {
          // Supabase vazio — usa dados base e insere-os
          for (const m of MERCADOS_BASE) {
            await db.inserir("mercados", {
              categoria: m.cat, pergunta: m.q, emoji: m.emoji,
              prazo: "2026-12-31", sim: m.sim, nao: m.nao,
              destaque: m.destaque, status: m.status,
              metodologia: m.met, fontes: m.fontes
            });
          }
        }

        if (pData && pData.length > 0) {
          const partsFormatadas = pData.map(p => ({
            id: p.id,
            user: p.nome_user,
            contacto: p.contacto || "",
            val: Number(p.valor) || 0,
            lado: p.lado,
            mId: p.mercado_id,
            status: p.status,
            met: p.metodo || "Gratuito",
            hora: p.criado_em ? new Date(p.criado_em).toLocaleTimeString("pt",{hour:"2-digit",minute:"2-digit"}) : "",
            data: p.criado_em ? p.criado_em.slice(0,10) : hoje(),
          }));
          setParts(partsFormatadas);
        }

        if (cData) {
          if (cData.emola) setEmola(cData.emola);
          if (cData.mpesa) setMpesa(cData.mpesa);
          setCfg({
            taxa: Number(cData.taxa_plataforma) || 25,
            minVal: Number(cData.valor_minimo) || 10,
            maxVal: Number(cData.valor_maximo) || 50000,
            modoPagamento: cData.modo_pagamento || "gratuito"
          });
        }
      } catch(e) {
        // Fallback para storage local se Supabase falhar
        try {
          const m = await storageGet("mz_mercados");
          const p = await storageGet("mz_parts");
          const c = await storageGet("mz_cfg");
          if(m) setMercados(JSON.parse(m.value));
          if(p) setParts(JSON.parse(p.value));
          if(c) {
            const conf = JSON.parse(c.value);
            if(conf.emola!==undefined) setEmola(conf.emola);
            if(conf.mpesa!==undefined) setMpesa(conf.mpesa);
            if(conf.taxa) setCfg({taxa:conf.taxa,minVal:conf.minVal||10,maxVal:conf.maxVal||50000,modoPagamento:conf.modoPagamento||"gratuito"});
          }
        } catch {}
      }
      setCarreg(false);
    };
    carregar();
  },[]);

  // Guardar configuração no Supabase quando muda
  useEffect(()=>{
    if(carregando) return;
    db.guardarCfg({
      emola, mpesa,
      taxa_plataforma: cfg.taxa,
      valor_minimo: cfg.minVal,
      valor_maximo: cfg.maxVal,
      modo_pagamento: cfg.modoPagamento
    });
    // Fallback local
    storageSet("mz_cfg",{emola,mpesa,...cfg});
  },[emola,mpesa,cfg,carregando]);



  useEffect(()=>{
    const t=setInterval(()=>setTicker(i=>(i+1)%Math.max(1,mercados.length)),3800);
    return ()=>clearInterval(t);
  },[mercados.length]);

  const handleParticipar = (val,lado,mId,met,ref,nome,contacto) => {
    setMercados(p=>p.map(m=>{
      if(m.id!==mId) return m;
      const ns=lado==="sim"?m.sim+val:m.sim;
      const nn=lado==="nao"?m.nao+val:m.nao;
      return {...m,sim:ns,nao:nn,vol:[...(m.vol||[]),ns]};
    }));
    setParts(p=>[{id:ref,user:nome||"Anónimo",contacto:contacto||"",val,lado,mId,status:cfg.modoPagamento==="gratuito"?"confirmado":"pendente",met:met==="gratuito"?"Gratuito":"Comprovativo",hora:agora(),data:hoje()},...p]);
    notif(cfg.modoPagamento==="gratuito"?"✅ Participação confirmada!":"✅ Participação registada! Aguarda confirmação.");
  };

  if(carregando) return (
    <div style={{minHeight:"100vh",background:P.bgVoid,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:18}}>
      <FaixaCapulana/>
      <div style={{width:54,height:54,borderRadius:14,background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:19,color:"#04140A",fontFamily:F.body,boxShadow:`0 0 30px ${P.esmeralda}50`,animation:"pulse 1.5s infinite"}}>MZ</div>
      <p style={{color:P.textoS,fontSize:13,fontFamily:F.body}}>A carregar MzPrediz…</p>
    </div>
  );

  if(vista==="login")  return <LoginAdmin entrar={()=>setVista("admin")} voltar={()=>setVista("publica")}/>;
  if(vista==="admin")  return <PainelAdmin mercados={mercados} setMercados={setMercados} parts={parts} setParts={setParts} emola={emola} setEmola={setEmola} mpesa={mpesa} setMpesa={setMpesa} cfg={cfg} setCfg={setCfg} sair={()=>setVista("publica")}/>;

  const tickerM = mercados[ticker];
  const abertos = mercados.filter(m=>m.status==="aberto");
  const totalPool = mercados.reduce((s,m)=>s+m.sim+m.nao,0);
  const totalPart = mercados.reduce((s,m)=>s+Math.round((m.sim+m.nao)/120),0);

  return (
    <div style={{minHeight:"100vh",background:P.bgVoid,color:P.textoP,fontFamily:F.display}}>
      <style>{`
        @keyframes shimmer { 0%{background-position:0% 0;} 100%{background-position:200% 0;} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes popIn { from{opacity:0;transform:scale(.96);} to{opacity:1;transform:scale(1);} }
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,10px);} to{opacity:1;transform:translate(-50%,0);} }
        ::-webkit-scrollbar { width:8px; }
        ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background:rgba(0,230,118,0.2); border-radius:4px; }
      `}</style>
      <FaixaCapulana/>
      <Toast msg={toast}/>
      <BannerNotificacoes
        parts={parts.filter(p=>!notifFechadas.includes(p.id))}
        mercados={mercados}
        onFechar={id=>setNotifFechadas(p=>[...p,id])}
      />
      <div style={{position:"fixed",inset:0,pointerEvents:"none",background:`radial-gradient(ellipse 75% 45% at 50% -5%, rgba(0,230,118,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 30% at 100% 100%, rgba(255,199,0,0.05) 0%, transparent 60%)`,zIndex:0}}/>

      <header style={{position:"sticky",top:0,zIndex:200,background:"rgba(5,8,10,0.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${P.borda}`}}>
        <div style={{background:`${P.esmeralda}0c`,borderBottom:`1px solid ${P.borda}`,padding:"6px 16px",fontSize:11,fontFamily:F.body,color:P.textoS,overflow:"hidden",whiteSpace:"nowrap"}}>
          <span style={{color:P.rubi,fontWeight:700,marginRight:11}}>● AO VIVO</span>
          {tickerM&&<><span style={{marginRight:9}}>{tickerM.emoji} {tickerM.q.slice(0,55)}…</span><span style={{color:P.esmeralda,fontWeight:700}}>SIM {pct(tickerM.sim,tickerM.nao)}%</span><span style={{color:P.textoS,margin:"0 11px"}}>·</span><span style={{color:P.ouro}}>{fmt(tickerM.sim+tickerM.nao)} pts</span></>}
        </div>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,padding:"0 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:13,cursor:"pointer"}} onClick={()=>setSecao("inicio")}>
            <div style={{position:"relative",width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"#04140A",fontFamily:F.body,boxShadow:`0 4px 16px ${P.esmeralda}40`}}>
              MZ<div style={{position:"absolute",bottom:-2,right:-2,width:10,height:10,background:P.ouro,borderRadius:"50%",border:"2px solid #05080A",boxShadow:`0 0 8px ${P.ouro}`}}/>
            </div>
            <div>
              <div style={{fontWeight:800,fontSize:18,letterSpacing:"-.5px"}}>MzPrediz</div>
              <div style={{fontSize:9,color:P.textoS,letterSpacing:1.3,fontFamily:F.body}}>PREVISÕES · MOÇAMBIQUE 🇲🇿</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {[{id:"inicio",l:"🏠 Início"},{id:"mercados",l:"📊 Previsões"},{id:"ranking",l:"🏆 Ranking"},{id:"como",l:"🎓 Como Funciona"},{id:"sobre",l:"🇲🇿 Sobre"}].map(n=>(
              <button key={n.id} onClick={()=>setSecao(n.id)} style={{padding:"7px 13px",borderRadius:22,border:`1px solid ${secao===n.id?P.esmeralda:"rgba(255,255,255,0.06)"}`,background:secao===n.id?`${P.esmeralda}22`:"transparent",color:secao===n.id?P.esmeralda:P.textoS,fontWeight:700,fontSize:11.5,cursor:"pointer",fontFamily:F.body}}>{n.l}</button>
            ))}
            <button onClick={()=>setVista("login")} style={{padding:"7px 14px",borderRadius:22,border:`1px solid ${P.ouro}35`,background:`${P.ouro}12`,color:P.ouro,cursor:"pointer",fontSize:11.5,fontWeight:800,fontFamily:F.body,marginLeft:5}}>⚙ Admin</button>
          </div>
        </div>
      </header>

      <div style={{maxWidth:980,margin:"0 auto",padding:"0 16px",position:"relative",zIndex:1}}>
        {secao==="inicio"&&<SecaoInicio mercados={mercados} cfg={cfg} totalPool={totalPool} totalPart={totalPart} abertos={abertos} irParaMercados={()=>setSecao("mercados")} setPartic={setPartic} setDetalhe={setDetalhe} setPartilhar={setPartilhar}/>}
        {secao==="mercados"&&<SecaoMercados mercados={mercados} cfg={cfg} totalPool={totalPool} abertos={abertos} setPartic={setPartic} setDetalhe={setDetalhe} setPartilhar={setPartilhar}/>}
        {secao==="ranking"&&<SecaoRanking parts={parts}/>}
        {secao==="como"&&<SecaoComo cfg={cfg}/>}
        {secao==="sobre"&&<SecaoSobre/>}

        {/* FOOTER */}
        <div style={{borderTop:`1px solid ${P.borda}`,marginTop:32,paddingTop:28,paddingBottom:24}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:24}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${P.esmeraldaXD},${P.esmeralda})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"#04140A",fontFamily:F.body}}>MZ</div>
                <span style={{fontWeight:800,fontSize:15,color:P.textoP}}>MzPrediz</span>
              </div>
              <p style={{color:P.textoS,fontSize:11.5,lineHeight:1.7,fontFamily:F.body,margin:0}}>O povo prevê o futuro de Moçambique. Plataforma responsável de mercados de previsão.</p>
            </div>
            <div>
              <h4 style={{color:P.textoP,fontSize:13,marginBottom:12,fontFamily:F.body}}>Navegação</h4>
              {[["🏠 Início","inicio"],["📊 Previsões","mercados"],["🏆 Ranking","ranking"],["🎓 Como Funciona","como"],["🇲🇿 Sobre","sobre"]].map(([l,id])=>(
                <button key={id} onClick={()=>setSecao(id)} style={{display:"block",background:"none",border:"none",color:P.textoS,fontSize:12,cursor:"pointer",fontFamily:F.body,padding:"3px 0",textAlign:"left"}}>{l}</button>
              ))}
            </div>
            <div>
              <h4 style={{color:P.textoP,fontSize:13,marginBottom:12,fontFamily:F.body}}>Contacto & Suporte</h4>
              <p style={{color:P.textoS,fontSize:12,lineHeight:1.8,fontFamily:F.body,margin:0}}>
                <b style={{color:P.textoP}}>Alberto Tomás Guambe</b><br/>
                Fundador & CEO<br/>
                📲 e-Mola: <b style={{color:P.esmeralda}}>879937763</b><br/>
                🇲🇿 Maputo, Moçambique
              </p>
              <a href="https://wa.me/258879937763" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:10,padding:"7px 14px",background:`${P.esmeralda}18`,border:`1px solid ${P.esmeralda}35`,borderRadius:10,color:P.esmeralda,fontSize:11,fontWeight:700,fontFamily:F.body,textDecoration:"none"}}>💬 WhatsApp</a>
            </div>
          </div>
          <div style={{borderTop:`1px solid rgba(255,255,255,0.05)`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{fontSize:11,color:P.textoM,fontFamily:F.body,margin:0}}>© 2026 MzPrediz · {CFG_BASE.owner} · Todos os direitos reservados</p>
            <p style={{fontSize:11,color:P.textoM,fontFamily:F.body,margin:0}}>🇲🇿 Moçambique · Plataforma Responsável de Previsões</p>
          </div>
        </div>
      </div>

      {participar&&<ModalParticipar m={participar.m} lado={participar.lado} modoPagamento={cfg.modoPagamento} emola={emola} taxa={cfg.taxa} minVal={cfg.minVal} maxVal={cfg.maxVal} fechar={()=>setPartic(null)} concluir={handleParticipar}/>}
      {detalhe&&<ModalDetalhe m={detalhe} taxa={cfg.taxa} fechar={()=>setDetalhe(null)} participar={(m,l)=>{setDetalhe(null);setPartic({m,lado:l});}} partilhar={setPartilhar}/>}
      {partilhar&&<ModalPartilhar m={partilhar} taxa={cfg.taxa} fechar={()=>setPartilhar(null)}/>}
    </div>
  );
}
