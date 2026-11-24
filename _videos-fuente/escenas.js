const W=1280,H=720,cv=document.getElementById('c'),g=cv.getContext('2d');
const F='"Montserrat","Segoe UI",Arial,sans-serif';
const azul='#1f3a5f', tinta='#12233a', teal='#1d8a94';
const ease=x=>x<0?0:x>1?1:x*x*(3-2*x), clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const rampa=(t,a,b)=>ease((t-a)/(b-a));
function rr(x,y,w,h,r,fill,stroke,lw){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.lineWidth=lw||1.5;g.strokeStyle=stroke;g.stroke();}}
function tx(s,x,y,sz,col,o={}){g.font=`${o.w||500} ${sz}px ${o.f||F}`;g.fillStyle=col;g.textAlign=o.a||'left';g.textBaseline='middle';g.fillText(s,x,y);}
function ancho(s,sz,w){g.font=`${w||500} ${sz}px ${F}`;return g.measureText(s).width;}
function sombra(on){g.shadowColor=on?'rgba(10,25,45,.35)':'transparent';g.shadowBlur=on?22:0;g.shadowOffsetY=on?7:0;}
function escribir(s,t,a,b){return s.slice(0,Math.floor(clamp((t-a)/(b-a),0,1)*s.length+1e-6));}
const paso=t=>Math.floor(t*2)%2===0;
function foco(t,x,y,w,h,a,b){if(t<a||t>b)return;const p=.5+.5*Math.sin(t*6);g.save();g.lineWidth=4+2*p;g.strokeStyle='#ffc400';g.beginPath();g.roundRect(x-6,y-6,w+12,h+12,10);g.stroke();g.restore();}
function etiqueta(t,s,x,y,a,b){if(t<a||t>b)return;const k=Math.min(rampa(t,a,a+.3),1-rampa(t,b-.3,b));g.save();g.globalAlpha=k;const w=ancho(s,24,700)+40;sombra(true);rr(x,y,w,52,26,'#ffe9a3');sombra(false);rr(x,y,w,52,26,null,'#e0b100',2);tx(s,x+20,y+27,24,'#3a3000',{w:700});g.restore();}
function cursor(t,K,C){
  let x=K[0][1],y=K[0][2];
  for(let i=1;i<K.length;i++){if(t>=K[i][0]){x=K[i][1];y=K[i][2];}else{const a=K[i-1],b=K[i],ini=Math.max(a[0],b[0]-1);const k=ease((t-ini)/(b[0]-ini));x=a[1]+(b[1]-a[1])*k;y=a[2]+(b[2]-a[2])*k;break;}}
  C.forEach(c=>{const d=t-c;if(d>=0&&d<.55){g.lineWidth=4;g.strokeStyle=`rgba(0,140,255,${1-d/.55})`;g.beginPath();g.arc(x,y,8+d*60,0,7);g.stroke();}});
  g.save();g.translate(x,y);g.beginPath();[[0,0],[0,30],[7,23.5],[12,35],[17.5,32.5],[12.6,21.5],[22,21.5]].forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();sombra(true);g.fillStyle='#fff';g.fill();sombra(false);g.lineWidth=2.4;g.strokeStyle=tinta;g.stroke();g.restore();
}
function sub(t,S){
  g.fillStyle=tinta;g.fillRect(0,640,W,80);g.fillStyle=teal;g.fillRect(0,640,W,4);
  const s=S.find(s=>t>=s[0]&&t<s[1]);if(!s)return;
  const ls=[''];g.font=`600 25px ${F}`;
  s[2].split(' ').forEach(p=>{const u=(ls[ls.length-1]+' '+p).trim();if(g.measureText(u).width>1180)ls.push(p);else ls[ls.length-1]=u;});
  ls.forEach((l,i)=>tx(l,W/2,683+(i-(ls.length-1)/2)*31,25,'#fff',{w:600,a:'center'}));
}
function portada(t,titulo,fin){
  if(t>fin)return;g.save();g.globalAlpha=1-rampa(t,fin-.5,fin);
  const gr=g.createLinearGradient(0,0,W,640);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#dcecf3');g.fillStyle=gr;g.fillRect(0,0,W,640);
  g.setLineDash([10,8]);g.strokeStyle='#b5cfdd';g.lineWidth=2;g.beginPath();g.moveTo(-20,580);g.bezierCurveTo(300,460,500,660,820,560);g.bezierCurveTo(1000,490,1150,600,1320,460);g.stroke();g.setLineDash([]);
  const lh=Math.min(300,460*logo.height/logo.width),lw=lh*logo.width/logo.height;g.globalCompositeOperation='multiply';g.drawImage(logo,(W-lw)/2,50,lw,lh);g.globalCompositeOperation='source-over';
  tx('Antes de empezar',W/2,lh+110,26,teal,{w:700,a:'center'});tx(titulo,W/2,lh+170,52,azul,{w:800,a:'center'});g.restore();
}
/* ---------- Íconos ---------- */
function carpeta(x,y,s){g.fillStyle='#e9a92f';g.beginPath();g.roundRect(x,y,s*.45,s*.3,s*.06);g.fill();rr(x,y+s*.1,s,s*.68,s*.07,'#f6c453');g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x+s*.06,y+s*.2,s*.88,s*.06);}
function hojaTxt(x,y,s){rr(x+s*.14,y,s*.66,s*.86,s*.06,'#fff','#7b8ba0',2);g.strokeStyle='#9fb0c4';g.lineWidth=2;for(let i=0;i<4;i++){g.beginPath();g.moveTo(x+s*.26,y+s*(.22+i*.15));g.lineTo(x+s*.68,y+s*(.22+i*.15));g.stroke();}}
/* ---------- Carpetas ---------- */
function escritorio(solo){const gr=g.createLinearGradient(0,0,W,640);gr.addColorStop(0,'#234b78');gr.addColorStop(1,'#2b8a94');g.fillStyle=gr;g.fillRect(0,0,W,640);if(solo)tx('Escritorio',34,40,26,'rgba(255,255,255,.8)',{w:700});}
function ventana(ruta){
  const x=70,y=40,w=1140,h=560;sombra(true);rr(x,y,w,h,14,'#fff');sombra(false);
  g.save();g.beginPath();g.roundRect(x,y,w,h,14);g.clip();g.fillStyle='#e3ecf3';g.fillRect(x,y,w,64);g.restore();
  carpeta(x+22,y+16,36);let px=x+76;ruta.forEach((r,i)=>{if(i){tx('›',px,y+33,26,'#5c7188');px+=26;}tx(r,px,y+33,25,tinta,{w:i===ruta.length-1?700:500});px+=ancho(r,25,700)+12;});
  ['#f2b84b','#69b38a','#d9645a'].forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.arc(x+w-92+i*30,y+32,9,0,7);g.fill();});
  tx('Nombre',x+90,y+92,20,'#6c8095',{w:600});g.strokeStyle='#dbe4ec';g.lineWidth=2;g.beginPath();g.moveTo(x+24,y+114);g.lineTo(x+w-24,y+114);g.stroke();
}
function fila(t,i,tipo,nombre,edit,sel){const x=100,y=166+i*70;if(sel||edit)rr(x-6,y-4,1082,62,8,'#d8ecfa','#8cc4e8',1.5);
  (tipo==='txt'?hojaTxt:carpeta)(x+10,y+7,46);campo(t,nombre,x+80,y+27,26,edit);}
function campo(t,nombre,x,y,sz,edit){if(edit){const w=Math.max(230,ancho(nombre,sz,600)+26);rr(x-10,y-21,w,42,4,'#fff',tinta,2);if(edit==='sel'){g.fillStyle='#bfe0fa';g.fillRect(x-4,y-16,ancho(nombre,sz,600)+8,32);}}
  tx(nombre,x,y,sz,tinta,{w:600});if(edit==='escribe'&&paso(t)){const a=ancho(nombre,sz,600);g.fillStyle=tinta;g.fillRect(x+a+3,y-15,2.5,30);}}
function menuCtx(x,y,items,act){const h=items.length*48+16;sombra(true);rr(x,y,290,h,10,'#f7fafc');sombra(false);rr(x,y,290,h,10,null,'#c3d0db');
  items.forEach((it,i)=>{const ic=it==='Carpeta'||it==='Documento de texto';if(it===act)rr(x+6,y+8+i*48,278,48,7,'#cfe6f7');if(it==='Carpeta')carpeta(x+18,y+22+i*48,26);else if(ic)hojaTxt(x+14,y+20+i*48,30);tx(it,x+(ic?56:22),y+33+i*48,22,tinta,{w:it===act?700:500});if(it==='Nuevo')tx('›',x+264,y+32+i*48,24,tinta);});}
const CTX=['Ver','Ordenar por','Nuevo','Propiedades'], SUBM=['Carpeta','Acceso directo','Documento de texto'];
function ctx(t,x,y,t0,t1,t2,eleg){if(t<t0||t>t2+.15)return;menuCtx(x,y,CTX,t>=t1?'Nuevo':null);if(t>=t1)menuCtx(x+294,y+70,SUBM,t>=t2-.6?eleg:null);}
const posNuevo=(x,y)=>[x+90,y+130], posSub=(x,y,e)=>[x+380,y+70+32+SUBM.indexOf(e)*48];
/* ---------- Pantalla de práctica (estilo XILOVHA) ---------- */
const BAR=['Fichero','Edición','Hoja','Visualizar','Talla','Selección','Macro','Herramienta'];
const BX=[24,142,256,344,480,570,704,806], bx=i=>BX[i];
const PAN=[['Puntos, líneas','F1','#f6d2ae'],['Piquetes, orient.','F2','#f0b04a'],['Modificación','F3','#f8c3cf'],['Industrialización','F4','#cfcfcf'],['Piezas, pliegues','F5','#cdb6d8'],['Escalado','F6','#7fd0cc'],['Evolución','F7','#9fd39b'],['Medidas','F8','#ead98a']];
function pantalla(modelo,act,msg){
  g.fillStyle='#eef1f4';g.fillRect(0,0,W,56);g.fillStyle='#d5dae0';g.fillRect(0,56,W,40);g.fillStyle='#a3a7ae';g.fillRect(0,96,W,504);
  BAR.forEach((b,i)=>{if(b===act)rr(bx(i)-10,8,ancho(b,22,600)+20,40,8,azul);tx(b,bx(i),29,22,b===act?'#fff':tinta,{w:600});});
  tx('ref :',16,77,20,tinta,{w:700});tx(msg||'',74,77,20,'#123a9a',{w:600});if(modelo)tx(modelo,1262,77,20,tinta,{w:700,a:'right'});
  g.fillStyle='#c8ccd2';g.fillRect(1010,96,270,504);tx('Selección',1145,122,20,tinta,{w:700,a:'center'});
  PAN.forEach((p,i)=>{rr(1022,146+i*54,246,46,6,p[2],'#7d8791',1.2);tx(p[0],1034,170+i*54,19,tinta,{w:500});tx(p[1],1258,170+i*54,20,tinta,{w:800,a:'right'});});
  g.fillStyle='#5b616a';g.fillRect(0,600,W,40);['Piquete','Sin marcaje','Desplazado','Nada','1- Escalado'].forEach((s,i)=>tx(s,24+i*170,620,17,'#e9ecef'));
}
function desplegable(i,items,act){const w=300,x=bx(i)-10,y=56,h=items.length*44+14;sombra(true);rr(x,y,w,h,6,'#f7f9fb');sombra(false);rr(x,y,w,h,6,null,'#9aa6b2');
  items.forEach(([n,k],j)=>{if(n===act)rr(x+5,y+7+j*44,w-10,44,5,'#cfe0ff');tx(n,x+18,y+30+j*44,21,tinta,{w:n===act?700:500});if(k)tx(k,x+w-16,y+30+j*44,17,'#66788c',{a:'right'});});}
const yItem=j=>86+j*44;
function hoja(x,y,w,h,k){g.save();g.globalAlpha=k===undefined?1:k;rr(x,y,w,h,2,'#8d929a','#2a2d33',2.5);g.restore();}
function vestido(cx,cy,s){g.save();g.translate(cx,cy);g.scale(s,s);rr(-110,-95,220,190,8,'#d6dade');g.fillStyle='#fff';g.strokeStyle='#33404f';g.lineWidth=2;g.beginPath();g.moveTo(-20,-72);g.quadraticCurveTo(0,-52,20,-72);g.lineTo(38,-66);g.lineTo(28,-30);g.lineTo(24,-4);g.lineTo(62,76);g.quadraticCurveTo(0,90,-62,76);g.lineTo(-24,-4);g.lineTo(-28,-30);g.lineTo(-38,-66);g.closePath();g.fill();g.stroke();g.setLineDash([5,4]);g.beginPath();g.moveTo(-24,-4);g.lineTo(24,-4);g.moveTo(0,-4);g.lineTo(0,82);g.stroke();g.restore();}
function cartucho(x,y,w,h,k,nombre){g.save();g.globalAlpha=k;g.strokeStyle='#e9ec1a';g.lineWidth=2.2;const am='#f9fb9a';
  g.strokeRect(x+6,y+6,76,h-12);g.beginPath();g.moveTo(x+6,y+38);g.lineTo(x+82,y+38);g.moveTo(x+6,y+66);g.lineTo(x+82,y+66);g.stroke();tx('nombre: 1',x+10,y+23,14,am,{w:600});
  const bx0=x+82,bw=w-88,by=y+h-106;g.strokeRect(bx0,by,bw,100);g.beginPath();g.moveTo(bx0,by+44);g.lineTo(bx0+bw,by+44);[.56,.78].forEach(f=>{g.moveTo(bx0+bw*f,by);g.lineTo(bx0+bw*f,by+44);});g.moveTo(bx0+bw*.66,by+44);g.lineTo(bx0+bw*.66,by+100);g.stroke();
  tx(nombre,bx0+8,by+23,16,am,{w:700});tx('cda:',bx0+bw*.56+8,by+23,16,am);tx('ref:',bx0+bw*.78+8,by+23,16,am);tx('comentario:',bx0+8,by+66,16,am);tx('Prefijo:',bx0+bw*.66+8,by+62,15,am);tx('Sect:',bx0+bw*.66+8,by+84,15,am);g.restore();}
const FICH=[['Nuevo','Ctrl+N'],['Abrir Modelo','Ctrl+O'],['Insertar Modelo',''],['Grabar','Ctrl+E'],['Grabar como ...','Ctrl+T'],['Importar',''],['Exportar',''],['Salir','']];
const HOJ=[['Nueva hoja','N'],['Copiar',''],['Suprimir',''],['Elegir Hoja',''],['Desplazar hoja',''],['Ajustar todo',''],['Visualizar todo','']];
const VIS=[['Pts de curva',''],['Nombre puntos',''],['Ocultar medidas',''],['Piquetes',''],['Bézier',''],['Cartucho','Ctrl+U'],['Malla',''],['Escala','']];
const NUM=['numeric','4 2','*6','12'];
function bloc(lineas,x,y,w,h){sombra(true);rr(x,y,w,h,12,'#fffdf5');sombra(false);g.save();g.beginPath();g.roundRect(x,y,w,h,12);g.clip();g.fillStyle='#dfe7ee';g.fillRect(x,y,w,50);g.restore();hojaTxt(x+14,y+10,32);tx('NUMERIC',x+56,y+26,22,tinta,{w:700});lineas.forEach((l,i)=>tx(l,x+34,y+92+i*46,32,tinta,{w:600,f:'Consolas,monospace'}));}

const VID={
carpeta:{dur:44.486,f(t){
  const M=[430,150];
  if(t<13.3){escritorio(true);
    if(t>=8.2){const n=t<9?'Nueva carpeta':escribir('NIÑA',t,9,10.6),ed=t<9?'sel':t<11?'escribe':null;if(!ed)rr(580,250,150,150,10,'rgba(255,255,255,.22)');carpeta(605,262,100);
      if(ed)campo(t,n,570,372,25,ed);else tx('NIÑA',655,374,28,'#fff',{w:700,a:'center'});}
    ctx(t,...M,4.2,6.4,8,'Carpeta');
    cursor(t,[[0,900,480],[4,430,150],[6.2,...posNuevo(...M)],[7.8,...posSub(...M,'Carpeta')],[9.5,900,500],[12.6,655,315]],[4.2,8,12.7,13]);
  }else if(t<21.6){const N=[520,290];escritorio();ventana(['Escritorio','NIÑA']);
    if(t<16.1)tx('Esta carpeta está vacía',640,200,22,'#8496a8',{a:'center'});
    else fila(t,0,'c',t<17.3?'Nueva carpeta':escribir('TALLAS',t,17.3,19),t<17.3?'sel':t<19.5?'escribe':null,true);
    ctx(t,...N,14.3,15.1,16,'Carpeta');
    cursor(t,[[13.3,655,315],[14.2,520,290],[15,...posNuevo(...N)],[15.9,...posSub(...N,'Carpeta')],[17.6,900,450],[21,300,200]],[14.3,16,21.1,21.4]);
  }else if(t<35){const N=[520,290];escritorio();ventana(['Escritorio','NIÑA','TALLAS']);
    if(t<27.1)tx('Esta carpeta está vacía',640,200,22,'#8496a8',{a:'center'});
    else fila(t,0,'txt',t<30.6?'Nuevo documento de texto':escribir('NUMERIC',t,30.6,32.8),t<30.6?'sel':t<33.4?'escribe':null,true);
    ctx(t,...N,23.6,25,27,'Documento de texto');
    cursor(t,[[21.6,300,200],[23.5,520,290],[24.9,...posNuevo(...N)],[26.8,...posSub(...N,'Documento de texto')],[28.5,900,470],[34.4,320,200]],[23.6,27,34.5,34.8]);
  }else{escritorio();ventana(['Escritorio','NIÑA','TALLAS']);fila(t,0,'txt','NUMERIC',null,true);
    g.save();g.globalAlpha=rampa(t,35,35.4);const T=[[36,37.6],[38.4,39.2],[40,40.7],[41.4,42]],L=NUM.map((s,i)=>escribir(s,t,...T[i]));
    const a=T.findIndex(p=>t<p[1]);if(paso(t))L[a<0?3:a]+='|';
    bloc(L,180,150,430,400);
    sombra(true);rr(680,220,470,220,18,'#ffe9a3');sombra(false);rr(680,220,470,220,18,null,'#e0b100',2);tx('Ejemplo',915,262,28,'#3a3000',{w:800,a:'center'});tx('Mis tallas son 4, 6, 12, 14',915,318,26,'#3a3000',{w:600,a:'center'});tx('donde 6 es la talla',915,364,25,'#3a3000',{a:'center'});tx('con la que se trabajará',915,400,25,'#3a3000',{a:'center'});
    g.restore();foco(t,206,312,90,44,40.7,44.5);cursor(t,[[35,320,200],[36.2,560,490]],[]);
  }
  portada(t,'Creación de carpeta',2.8);
  sub(t,[[0,6.4,'En este video se enseñará a crear la carpeta para tu prenda, en donde realizarás el patronaje.'],[6.4,11.1,'Aquí se creará en el escritorio, pero tú puedes elegir dónde crearla.'],[11.1,17.2,'Una vez ya terminada, accederás a esta misma y volverás a crear una carpeta nueva.'],[17.2,20.5,'Esta se llamará TALLAS.'],[29.6,34.6,'Dentro de esta misma crearás un bloc de notas llamado NUMERIC.'],[38.4,43.2,'En este bloc introducirás las tallas que manejarás.']]);
}},
modelos:{dur:19.561,f(t){
  const N=[520,330];escritorio();ventana(['Escritorio','NIÑA']);
  let n=0;const f1=t>=6.2,f2=t>=12.2;
  if(f1)fila(t,n++,'c',t<6.7?'Nueva carpeta':escribir('MODELOS',t,6.7,8.5),t<6.7?'sel':t<9?'escribe':null,t<9.2);
  fila(t,n++,'c','TALLAS');
  if(f2)fila(t,n++,'c',t<12.8?'Nueva carpeta':escribir('TRAZOS',t,12.8,14.4),t<12.8?'sel':t<15?'escribe':null,t<15.2);
  etiqueta(t,'Aquí guardas el archivo de tu prenda',460,168,9.2,20.5);etiqueta(t,'También se llaman marcadas',460,308,15.2,20.5);
  ctx(t,...N,4.2,5.1,6.1,'Carpeta');ctx(t,...N,10.4,11.2,12.1,'Carpeta');
  cursor(t,[[0,800,500],[4.1,520,330],[5,...posNuevo(...N)],[6,...posSub(...N,'Carpeta')],[7.5,1000,500],[10.3,520,330],[11.1,...posNuevo(...N)],[12,...posSub(...N,'Carpeta')],[13.5,1000,520]],[4.2,6.1,10.4,12.1]);
  portada(t,'Modelos y trazos',2.6);
  sub(t,[[0,4.8,'Dentro de esta misma carpeta, de donde harás el patronaje de tu prenda,'],[4.8,8.9,'crea dos nuevas carpetas: una se llamará MODELOS,'],[8.9,12.7,'donde guardarás tu archivo de tu prenda patronada,'],[12.7,14.6,'y la otra se llamará TRAZOS,'],[14.6,19.6,'o también conocida como marcadas: aquí pondrás tus marcadores.']]);
}},
hoja:{dur:45.996,f(t){
  const m1=t>=8.9&&t<17.5,m2=t>=35.2&&t<41,hecho=t>=25.4;
  pantalla(hecho?'FALDA NIÑA T6':'',m1?'Fichero':m2?'Hoja':null,t<8.9?'Elige Fichero':t<17.5?'Elige Nuevo':t<25.4?'Escribe el nombre y presiona Enter':t<31?'Modelo creado':t<41?'Hoja › Nueva hoja':'Hoja nueva lista para trazar');
  if(!hecho){if(t<17.6)tx('Todavía no hay hoja abierta',505,470,26,'#2f343b',{w:700,a:'center'});}
  else{const d=rampa(t,41,42),x=255-215*d,w=455-25*d;hoja(x,190,w,340,rampa(t,25.4,25.9));g.save();g.globalAlpha=rampa(t,25.4,25.9);vestido(x+w/2,360,1.2);g.restore();
    if(d>0)hoja(530,190,430,340,d);
    etiqueta(t,'Hoja del modelo',x+110,122,26.3,34);etiqueta(t,'¡Hoja nueva!',640,122,42.2,46.5);}
  if(m1)desplegable(0,FICH,t>=15.8?'Nuevo':null);if(m2)desplegable(2,HOJ,t>=38.5?'Nueva hoja':null);
  foco(t,bx(0),12,ancho('Fichero',22,600),34,7.3,8.9);etiqueta(t,'En algunos dispositivos dice «Archivo»',340,130,10.6,13.4);foco(t,bx(0)-4,66,288,38,15.5,17.5);
  foco(t,bx(2),12,ancho('Hoja',22,600),34,32,35.2);foco(t,bx(2)-4,66,288,38,38,41);
  if(t>=17.6&&t<25.4){g.save();g.globalAlpha=rampa(t,17.6,18);sombra(true);rr(250,200,540,150,10,'#eceff1');sombra(false);g.save();g.beginPath();g.roundRect(250,200,540,150,10);g.clip();g.fillStyle=azul;g.fillRect(250,200,540,50);g.restore();tx('Nombre nuevo modelo',272,226,23,'#fff',{w:700});rr(274,272,492,56,5,'#fff','#6b7a8a',2);const s=escribir('FALDA NIÑA T6',t,19.8,24);tx(s+(paso(t)?'|':''),290,301,28,tinta,{w:600});g.restore();etiqueta(t,'Enter ⏎',455,430,24.1,25.5);}
  cursor(t,[[0,600,420],[8.7,bx(0)+44,32],[17.2,120,86],[19,850,470],[35,bx(2)+26,32],[40.8,bx(2)+80,86],[43.5,745,370]],[8.8,17.3,35.1,40.9]);
  portada(t,'Creación de hoja',4.6);
  sub(t,[[0,7.2,'En este video te enseñaré cómo introducir una nueva hoja en tu archivo, vital para tu patronaje digital.'],[7.2,13.3,'Primero elegirás la opción llamada Fichero (en algunos dispositivos, Archivo).'],[13.3,18,'Se te desplegará un menú: seleccionarás la opción Nuevo.'],[18,22.7,'Te saldrá un cuadro pequeño en donde pondrás el nombre de la prenda.'],[22.7,28,'Una vez ya puesto el nombre, te saldrá una nueva hoja.'],[31.1,35.9,'Para implementar hojas adicionales seleccionarás la opción Hoja.'],[35.9,42.4,'De la misma manera se desplegará un menú y seleccionarás la opción Nueva hoja.'],[42.4,46,'Así podrás adicionar hojas nuevas para tu prenda.']]);
}},
cartucho:{dur:20.653,f(t){
  const m=t>=9.6&&t<14.6,k=rampa(t,14.8,15.6);
  pantalla('FALDA NIÑA',m?'Visualizar':null,t<9.6?'Elige Visualizar':t<14.6?'Elige Cartucho':'Cartucho visible');
  hoja(40,140,430,420);vestido(300,300,1.05);hoja(530,140,430,420);
  if(k>0){cartucho(40,140,430,420,k,'nombre: FALDA NIÑA');cartucho(530,140,430,420,k,'');}
  if(t>3&&t<8){g.save();g.globalAlpha=Math.min(rampa(t,3,3.5),1-rampa(t,7.5,8));g.fillStyle='rgba(16,30,48,.55)';g.fillRect(0,0,W,640);bloc(NUM,330,170,380,320);etiqueta(t,'Tus tallas en NUMERIC',750,300,3,8.5);g.restore();}
  if(m)desplegable(3,VIS,t>=12.3?'Cartucho':null);
  foco(t,bx(3),12,ancho('Visualizar',22,600),34,8,9.6);foco(t,bx(3)-4,yItem(5)-20,288,38,12.2,14.6);
  foco(t,48,148,72,58,16,20.7);foco(t,124,456,338,96,16,20.7);
  cursor(t,[[0,700,480],[9.4,bx(3)+50,32],[14.1,bx(3)+90,yItem(5)],[16.2,620,590]],[9.5,14.3]);
  portada(t,'Visualizar cartucho',2.6);
  sub(t,[[0,7.6,'En este video te enseñaré a visualizar tus cartuchos con las tallas que pusiste en tu bloc de notas llamado NUMERIC.'],[7.6,10.3,'Eliges la opción Visualizar;'],[10.3,15,'se desplegará un menú, eliges la opción Cartucho'],[15,19.6,'y así podrás observar tus medidas o tallas.']]);
}}};
