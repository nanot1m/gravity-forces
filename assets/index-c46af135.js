var W=Object.defineProperty;var j=(t,e,s)=>e in t?W(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var a=(t,e,s)=>(j(t,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(n){if(n.ep)return;n.ep=!0;const l=s(n);fetch(n.href,l)}})();class d{constructor(e,s,r){a(this,"pos");a(this,"vel");a(this,"mass");this.pos=e,this.vel=s,this.mass=r}applyForce(e,s){const r=e.div(this.mass);this.vel=this.vel.add(r.mul(s)),this.pos=this.pos.add(this.vel.mul(s))}}class o{constructor(e,s){this.x=e,this.y=s}add(e){return new o(this.x+e.x,this.y+e.y)}sub(e){return new o(this.x-e.x,this.y-e.y)}mul(e){return new o(this.x*e,this.y*e)}div(e){return new o(this.x/e,this.y/e)}mag(){return Math.sqrt(this.x*this.x+this.y*this.y)}norm(){const e=this.mag();return e===0?new o(0,0):this.div(e)}}class A{constructor(e,s){a(this,"bodies");a(this,"G");this.bodies=e,this.G=s}calcForce(e,s){const r=s.pos.sub(e.pos),n=r.mag(),l=this.G*e.mass*s.mass/n**2;return r.norm().mul(l)}step(e){for(let s=0;s<this.bodies.length;s++){const r=this.bodies[s];let n=new o(0,0);for(let l=0;l<this.bodies.length;l++)if(s!==l){const c=this.bodies[l];n=n.add(this.calcForce(r,c))}r.applyForce(n,e)}}}function O(t,e,s,r){const n=window.devicePixelRatio;t.width=s*n,t.height=r*n,t.style.width=`${s}px`,t.style.height=`${r}px`,e(n)}let w=window.innerWidth,f=window.innerHeight,y=1e-7,g=new o(0,0);function X(t,e,s){t.save(),t.translate(w/2,f/2);const r=e.pos.sub(g);t.beginPath(),t.arc(r.x*y,r.y*y,e.radius,0,2*Math.PI),s.fillStyle&&(t.fillStyle=s.fillStyle,t.fill()),s.strokeStyle&&(t.strokeStyle=s.strokeStyle,s.lineWidth&&(t.lineWidth=s.lineWidth),t.stroke()),t.restore()}function q(t,e){t.save(),t.fillStyle=e,t.fillRect(0,0,t.canvas.width,t.canvas.height),t.restore()}function M(t,e){for(const s of e)X(t,{pos:s.body.pos,radius:s.radius},{fillStyle:s.color,strokeStyle:"white",lineWidth:1})}const b=[{body:new d(new o(0,0),new o(0,0),1.989*10**30),radius:20,color:"yellow"},{body:new d(new o(5.79*10**10,0),new o(0,47870),3.285*10**23),radius:2,color:"gray"},{body:new d(new o(1.082*10**11,0),new o(0,35020),4.867*10**24),radius:3,color:"orange"},{body:new d(new o(1.496*10**11,0),new o(0,29783),5.972*10**24),radius:5,color:"blue"},{body:new d(new o(1.496*10**11+3.84*10**8,0),new o(0,29783+1022),7.34767309*10**22),radius:1,color:"gray"},{body:new d(new o(2.279*10**11,0),new o(0,24130),6.39*10**23),radius:3,color:"red"},{body:new d(new o(2.279*10**11+9.378*10**7,0),new o(0,24130+700),1.0659*10**16),radius:1,color:"gray"},{body:new d(new o(2.279*10**11+2.326*10**8,0),new o(0,24130+400),1.4762*10**15),radius:1,color:"gray"},{body:new d(new o(7.785*10**11,0),new o(0,13070),1.898*10**27),radius:10,color:"brown"},{body:new d(new o(1.433*10**12,0),new o(0,9690),5.683*10**26),radius:8,color:"yellow"},{body:new d(new o(2.873*10**12,0),new o(0,6810),8.681*10**25),radius:6,color:"lightblue"},{body:new d(new o(4.495*10**12,0),new o(0,5430),1.024*10**26),radius:6,color:"blue"}];function G(t){window.addEventListener("resize",()=>{w=window.innerWidth,f=window.innerHeight,O(t,i=>e.scale(i,i),w,f)});const e=t.getContext("2d");O(t,i=>e.scale(i,i),w,f);const s=new A(b.map(i=>i.body),6.6743*10**-11);let r=b[5].body,n=10,l=360;function c(){g=r.pos;for(let i=0;i<l;i++)s.step(n);q(e,"#1b2b34"),M(e,b),requestAnimationFrame(c)}c(),t.addEventListener("wheel",i=>{i.preventDefault(),y*=1+i.deltaY/1e3});let m=0;t.addEventListener("touchstart",i=>{if(i.touches.length===2){const[u,h]=Array.from(i.touches);m=u.clientX-h.clientX}}),t.addEventListener("touchmove",i=>{if(i.touches.length===2){const[u,h]=Array.from(i.touches),p=u.clientX-h.clientX;y*=1+(p-m)/1e3,m=p}}),t.addEventListener("click",i=>{const u=i.offsetX,h=i.offsetY,p=new o(u,h),E=new o(w/2,f/2),F=p.sub(E).div(y).add(g),v=b.reduce((S,P)=>{const L=P.body.pos.sub(F).mag();return L<S.dist?{dist:L,obj:P}:S},{dist:1/0,obj:null});v.obj&&(r=v.obj.body)})}const C=document.createElement("canvas");document.querySelector("#app").appendChild(C);G(C);