var E=Object.defineProperty;var W=(t,e,s)=>e in t?E(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var c=(t,e,s)=>(W(t,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();class d{constructor(e,s,l){c(this,"pos");c(this,"vel");c(this,"mass");this.pos=e,this.vel=s,this.mass=l}applyForce(e,s){const l=e.div(this.mass);this.vel=this.vel.add(l.mul(s)),this.pos=this.pos.add(this.vel.mul(s))}}class o{constructor(e,s){this.x=e,this.y=s}add(e){return new o(this.x+e.x,this.y+e.y)}sub(e){return new o(this.x-e.x,this.y-e.y)}mul(e){return new o(this.x*e,this.y*e)}div(e){return new o(this.x/e,this.y/e)}mag(){return Math.sqrt(this.x*this.x+this.y*this.y)}norm(){const e=this.mag();return e===0?new o(0,0):this.div(e)}}class j{constructor(e,s){c(this,"bodies");c(this,"G");this.bodies=e,this.G=s}calcForce(e,s){const l=s.pos.sub(e.pos),n=l.mag(),r=this.G*e.mass*s.mass/n**2;return l.norm().mul(r)}step(e){for(let s=0;s<this.bodies.length;s++){const l=this.bodies[s];let n=new o(0,0);for(let r=0;r<this.bodies.length;r++)if(s!==r){const i=this.bodies[r];n=n.add(this.calcForce(l,i))}l.applyForce(n,e)}}}function L(t,e,s,l){const n=window.devicePixelRatio;t.width=s*n,t.height=l*n,t.style.width=`${s}px`,t.style.height=`${l}px`,e(n)}let h=window.innerWidth,w=window.innerHeight,f=1e-9,b=new o(0,0);function F(t,e,s){t.save(),t.translate(h/2,w/2);const l=e.pos.sub(b);t.beginPath(),t.arc(l.x*f,l.y*f,e.radius,0,2*Math.PI),s.fillStyle&&(t.fillStyle=s.fillStyle,t.fill()),s.strokeStyle&&(t.strokeStyle=s.strokeStyle,s.lineWidth&&(t.lineWidth=s.lineWidth),t.stroke()),t.restore()}function A(t,e){t.save(),t.fillStyle=e,t.fillRect(0,0,t.canvas.width,t.canvas.height),t.restore()}function X(t,e){for(const s of e)F(t,{pos:s.body.pos,radius:s.radius},{fillStyle:s.color,strokeStyle:"white",lineWidth:1})}const p=[{body:new d(new o(0,0),new o(0,0),1.989*10**30),radius:20,color:"yellow"},{body:new d(new o(5.79*10**10,0),new o(0,47870),3.285*10**23),radius:2,color:"gray"},{body:new d(new o(1.082*10**11,0),new o(0,35020),4.867*10**24),radius:3,color:"orange"},{body:new d(new o(1.496*10**11,0),new o(0,29783),5.972*10**24),radius:5,color:"blue"},{body:new d(new o(1.496*10**11+3.84*10**8,0),new o(0,29783+1022),7.34767309*10**22),radius:1,color:"gray"},{body:new d(new o(2.279*10**11,0),new o(0,24130),6.39*10**23),radius:3,color:"red"},{body:new d(new o(7.785*10**11,0),new o(0,13070),1.898*10**27),radius:10,color:"brown"},{body:new d(new o(1.433*10**12,0),new o(0,9690),5.683*10**26),radius:8,color:"yellow"},{body:new d(new o(2.873*10**12,0),new o(0,6810),8.681*10**25),radius:6,color:"lightblue"},{body:new d(new o(4.495*10**12,0),new o(0,5430),1.024*10**26),radius:6,color:"blue"}];function q(t){window.addEventListener("resize",()=>{h=window.innerWidth,w=window.innerHeight,L(t,i=>e.scale(i,i),h,w)});const e=t.getContext("2d");L(t,i=>e.scale(i,i),h,w);const s=new j(p.map(i=>i.body),6.6743*10**-11);let l=p[0].body;function n(){b=l.pos,s.step(60*60),A(e,"#1b2b34"),X(e,p),requestAnimationFrame(n)}n(),t.addEventListener("wheel",i=>{i.preventDefault(),f*=1+i.deltaY/1e3});let r=0;t.addEventListener("touchstart",i=>{if(i.touches.length===2){const[a,u]=Array.from(i.touches);r=a.clientX-u.clientX}}),t.addEventListener("touchmove",i=>{if(i.touches.length===2){const[a,u]=Array.from(i.touches),y=a.clientX-u.clientX;f*=1+(y-r)/1e3,r=y}}),t.addEventListener("click",i=>{const a=i.offsetX,u=i.offsetY,y=new o(a,u),O=new o(h/2,w/2),C=y.sub(O).div(f).add(b),m=p.reduce((g,v)=>{const S=v.body.pos.sub(C).mag();return S<g.dist?{dist:S,obj:v}:g},{dist:1/0,obj:null});m.obj&&(l=m.obj.body)})}const P=document.createElement("canvas");document.querySelector("#app").appendChild(P);q(P);
