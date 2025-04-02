"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[500],{12532:(t,e,n)=>{n.d(e,{default:()=>D});var F=n(95155),a=n(49522),l=n(58830),r=n(89547),o=n(19371),i=n(56668),h=n(72750),s=n(95809),c=n(95786),d=n(78194),f=n(73553),u=n(16343),g=n(64012),p=n(61075),C=n(48173),A=n.n(C),m=n(76046),x=n(63297);let D=function(t){let{children:e}=t,[n,{toggle:C}]=(0,c.useDisclosure)(),D=(0,m.usePathname)();return(0,F.jsxs)(a.AppShell,{header:{height:60},navbar:{width:300,breakpoint:"sm",collapsed:{mobile:!n}},padding:"md",children:[(0,F.jsx)(a.AppShell.Header,{children:(0,F.jsxs)(l.Group,{align:"center",h:"100%",px:"md",children:[(0,F.jsx)(r.Burger,{opened:n,onClick:C,hiddenFrom:"sm",size:"sm","data-testid":"app-menu"}),(0,F.jsx)(o.Text,{flex:1,children:"Moon Clock"})]})}),(0,F.jsxs)(a.AppShell.Navbar,{p:"md",children:[(0,F.jsx)(i.NavLink,{component:A(),href:"/",label:"Panel",active:D.includes("/panel"),leftSection:(0,F.jsx)(h.ActionIcon,{variant:"light",children:(0,F.jsx)(d.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,F.jsx)(i.NavLink,{component:A(),href:"/presets",label:"Presets","data-testid":"nav-presets",active:D.includes("/presets"),leftSection:(0,F.jsx)(h.ActionIcon,{variant:"light",children:(0,F.jsx)(f.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,F.jsx)(i.NavLink,{component:A(),href:"/composer",label:"Composer",active:D.includes("/composer"),leftSection:(0,F.jsx)(h.ActionIcon,{variant:"light",children:(0,F.jsx)(u.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,F.jsx)(i.NavLink,{component:A(),href:"/settings",label:"Settings",active:D.includes("/settings"),leftSection:(0,F.jsx)(h.ActionIcon,{variant:"light",children:(0,F.jsx)(g.A,{style:{width:"70%",height:"70%"},stroke:1.5})})})]}),(0,F.jsx)(a.AppShell.Main,{children:(0,F.jsx)(x.tH,{fallbackRender:t=>{let{error:e}=t;return console.log(e.stack),(0,F.jsx)(s.Alert,{title:"There was a problem!",color:"red",icon:(0,F.jsx)(p.A,{}),children:e.message})},children:e})})]})}},3091:(t,e,n)=>{n.d(e,{K:()=>L});var F=n(95155),a=n(12115),l=n(4553);function r(t,e){let n=[];for(let F=0;F<e.height;F++)for(let a=0;a<e.width;a++){let{data:e}=t.getImageData(a,F,1,1);n.push({x:a,y:F,rgba:0===e[3]?null:e})}return n}let o=async t=>{let{macroConfig:e,dimensions:n,ctx:F,index:a,updatePixels:l}=t,o={backgroundColor:"#ffffff",startingColumn:0,startingRow:0,width:n.width,height:n.height,borderWidth:0,borderColor:"#fff",...e};return F.fillStyle=function(t,e,n){if("string"==typeof t)return t;let{direction:F,colorStops:a}=t,l=n.createLinearGradient(0,0,"horizontal"===F?e.width:0,e.height);for(let t of a)l.addColorStop(t.offset,t.color);return l}(o.backgroundColor,n,F),F.fillRect(o.startingColumn,o.startingRow,o.width,o.height),o.borderWidth&&(F.strokeStyle=o.borderColor,F.strokeRect(o.startingColumn,o.startingRow,o.width,o.height)),l(r(F,n),a),()=>{}},i=async t=>{let{macroConfig:e,dimensions:n,ctx:F,index:a,updatePixels:l}=t,o={color:"#fff",text:"Replace with marquee text!",font:"Arial",fontSize:12,speed:50,width:n.width,height:n.height,startingColumn:0,startingRow:0,direction:"vertical",...e};F.textBaseline="top",F.font="".concat(o.fontSize,"px ").concat(o.font),F.fillStyle=o.color;let i=F.measureText(o.text),h="horizontal"===o.direction?-o.width:-o.height,s=setInterval(()=>{if(F.clearRect(0,0,o.width,o.height),F.textBaseline="top",F.font="16px ".concat(o.font),F.fillStyle=o.color,F.textDrawingMode="glyph",F.fillText(o.text,"horizontal"===o.direction?o.startingColumn-h:o.startingColumn,"vertical"===o.direction?o.startingRow-h:o.startingRow),l(r(F,n),a),"horizontal"===o.direction)h>o.width+i.width&&(h=-o.width);else if("vertical"===o.direction){let t=i.actualBoundingBoxAscent+i.actualBoundingBoxDescent;h>o.height+t&&(h=-o.height)}h+=1},100-o.speed);return()=>clearInterval(s)},h=1e3/60,s=0;function c(t){return setTimeout(()=>{t(s=performance.now())},Math.max(0,h-(performance.now()-s)))}function d(t){clearTimeout(t)}function f(t){if(t.includes("rgb")){let e=t.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);if(e)return{r:parseInt(e[1],10),g:parseInt(e[2],10),b:parseInt(e[3],10),a:parseInt(e[4],10)||255}}else{let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);if(e)return{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16),a:255}}return null}let u=async t=>{let e,{macroConfig:n,dimensions:F,ctx:a,index:l,updatePixels:o}=t,{height:i,width:h,speed:s,waveHeight:u,color:g}={width:F.width,height:F.height,speed:5,waveHeight:5,color:"#ffffff",...n},p=a.createImageData(1,1),C=p.data,A=performance.now();return!function t(n){let d=(n-A)/(240-20*s);for(let t=0;t<i;t++)for(let e=0;e<h;e++){let n=60*Math.sin((Math.hypot(-(h-e-h/2),i-t-i/2)-d)/u)+50,F=f(g);C[0]=null==F?void 0:F.r,C[1]=null==F?void 0:F.g,C[2]=null==F?void 0:F.b,C[3]=n/100*(null==F?void 0:F.a),a.putImageData(p,e,t)}o(r(a,F),l),e=c(t)}(A),()=>{d(e)}},g=async t=>{let{macroConfig:e,dimensions:n,index:F,ctx:a,updatePixels:l}=t,o={color:"#FFFFFF",meteorCount:40,maxTailLength:20,minTailLength:5,maxDepth:10,minSpeed:100,maxSpeed:10,width:n.width,height:n.height,...e},i=f(o.color),h=[],s=[];for(let t=0;t<o.width+o.height;t++)s.push(t);let c=()=>{let t=Math.floor(Math.random()*(o.maxTailLength-o.minTailLength))+o.minTailLength,e=Math.floor(Math.random()*o.maxDepth)+1,n=s[Math.floor(Math.random()*s.length)];return{tailLength:t,speed:Math.floor(Math.random()*(o.minSpeed-o.maxSpeed))+o.maxSpeed,depth:e,moveCount:0,complete:!1,startingX:n,path:[{x:n,y:0}]}},d=()=>{let t=c();h.push(t);let e=s.indexOf(t.path[0].x);s.splice(e,1)};for(let t=0;t<o.meteorCount;t++)d();let u=setInterval(()=>{let t=h.filter(function(t){return!1==t.complete});for(let e=t.length;e<o.meteorCount;e++)d();h.forEach((t,e)=>{if(h[e].moveCount+=10,h[e].moveCount>t.speed){h[e].moveCount=0,o.height+t.tailLength>t.path[0].y?(h[e].path.unshift({x:t.path[0].x-1,y:t.path[0].y+1}),h[e].path.length>t.tailLength&&h[e].path.pop()):(h[e].complete=!0,s.push(t.startingX));let n=t.depth/o.maxDepth;t.path.forEach((e,F)=>{let l=(t.tailLength-F)/t.tailLength,r=a.createImageData(1,1),o=r.data;o[0]=null==i?void 0:i.r,o[1]=null==i?void 0:i.g,o[2]=null==i?void 0:i.b,o[3]=l*n*(null==i?void 0:i.a),a.putImageData(r,e.x,e.y)})}}),l(r(a,n),F)},10);return()=>clearInterval(u)},p=async t=>{let{macroConfig:e,dimensions:n,ctx:F,index:a,updatePixels:l}=t,o={color:"#fff",text:"hello WORLD!",font:"Arial",fontSize:12,alignment:"left",spaceBetweenLetters:1,spaceBetweenLines:1,startingColumn:0,startingRow:0,width:n.width,...e};F.textBaseline="top",F.font="".concat(o.fontSize,"px ").concat(o.font),F.fillStyle=o.color;let i=F.measureText(o.text);return"left"===o.alignment?F.fillText(o.text,o.startingColumn,o.startingRow):"right"===o.alignment?F.fillText(o.text,o.width-i.width,o.startingRow):"center"===o.alignment&&F.fillText(o.text,o.width/2-i.width/2,o.startingRow),l(r(F,n),a),()=>{}},C=async t=>{let e,{macroConfig:n,dimensions:F,ctx:a,index:l,updatePixels:o}=t,{color:i,speed:h,amount:s,height:u,width:g}={color:"#FFFFFF",speed:10,amount:50,width:F.width,height:F.height,...n},p=[];for(let t=0;t<s;t++){let e=Math.floor(Math.random()*(u-1-0+1))+0,n=Math.floor(Math.random()*(g-1-0+1))+0,F=Math.floor(255*Math.random())+0;p.push({x:n,y:e,a:F,peaked:t%2})}let C=Math.floor(255/h);return!function t(){let n=s-p.length;for(let t=0;t<n;t++){let t=Math.floor(Math.random()*(u-1-0+1))+0,e=Math.floor(Math.random()*(g-1-0+1))+0;p.push({x:e,y:t,a:0})}for(let t=0;t<p.length;t++){let{x:e,y:n,a:F,peaked:l}=p[t],r=f(i),o=a.createImageData(1,1),h=o.data;if(h[0]=null==r?void 0:r.r,h[1]=null==r?void 0:r.g,h[2]=null==r?void 0:r.b,h[3]=F,a.putImageData(o,e,n),F<=-1){p.splice(t,1);continue}p[t]={...p[t],x:e,y:n,a:F+(l?-C:C),...!l&&F>255?{peaked:!0}:{}}}o(r(a,F),l),e=c(t)}(),()=>{d(e)}};var A=function(t){return t.Box="box",t.Text="text",t.Twinkle="twinkle",t.Meteors="meteors",t.Marquee="marquee",t.Image="image",t.Ripple="ripple",t.Custom="custom",t.Coordinates="coordinates",t.Moon="moon",t.Countdown="countdown",t}({});let m=async t=>{let{macroConfig:e,dimensions:n,ctx:F,index:a,updatePixels:o}=t,i={url:"data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7",speed:50,width:n.width,height:n.height,startingColumn:0,startingRow:0,...e},h=await (0,l.yt)(i.url);return null==F||F.drawImage(h,0,0),o(r(F,n),a),h.src=i.url,()=>{}},x=async t=>{let{macroConfig:e,dimensions:n,ctx:F,index:a,updatePixels:l}=t;return e.customFunc(F,n),l(r(F,n),a),()=>{}},D=async t=>{let{macroConfig:e,ctx:n,dimensions:F,index:a,updatePixels:l}=t,o={coordinates:{"1:1":"#ffffff"},...e};for(let t in o.coordinates){n.fillStyle=o.coordinates[t];let[e,F]=t.split(":");n.fillRect(parseInt(e,10),parseInt(F,10),1,1)}return l(r(n,F),a),()=>{}},w={"0:0":"#000000","1:0":"#000000","2:0":"#000000","3:0":"#000000","4:0":"#000000","5:0":"#000000","6:0":"#000000","7:0":"#000000","8:0":"#000000","9:0":"#000000","10:0":"#000000","11:0":"#000000","12:0":"#000000","13:0":"#000000","14:0":"#000000","15:0":"#000000","16:0":"#000000","17:0":"#000000","18:0":"#000000","19:0":"#000000","20:0":"#000000","21:0":"#000000","22:0":"#000000","23:0":"#000000","24:0":"#000000","25:0":"#000000","26:0":"#000000","27:0":"#000000","28:0":"#000000","29:0":"#000000","30:0":"#000000","31:0":"#000000","0:1":"#000000","1:1":"#000000","2:1":"#000000","3:1":"#000000","4:1":"#000000","5:1":"#000000","6:1":"#000000","7:1":"#000000","8:1":"#000000","9:1":"#000000","10:1":"#000000","11:1":"#000000","12:1":"#000000","13:1":"#000000","14:1":"#000000","15:1":"#000000","16:1":"#000000","17:1":"#FFF5FA","18:1":"#000000","19:1":"#000000","20:1":"#000000","21:1":"#000000","22:1":"#000000","23:1":"#000000","24:1":"#000000","25:1":"#000000","26:1":"#000000","27:1":"#000000","28:1":"#000000","29:1":"#000000","30:1":"#000000","31:1":"#000000","0:2":"#000000","1:2":"#000000","2:2":"#000000","3:2":"#000000","4:2":"#000000","5:2":"#000000","6:2":"#000000","7:2":"#000000","8:2":"#000000","9:2":"#000000","10:2":"#000000","11:2":"#000000","12:2":"#000000","13:2":"#000000","14:2":"#000000","15:2":"#000000","16:2":"#000000","17:2":"#000000","18:2":"#000000","19:2":"#000000","20:2":"#000000","21:2":"#000000","22:2":"#000000","23:2":"#000000","24:2":"#000000","25:2":"#000000","26:2":"#000000","27:2":"#000000","28:2":"#000000","29:2":"#000000","30:2":"#000000","31:2":"#000000","0:3":"#000000","1:3":"#000000","2:3":"#000000","3:3":"#000000","4:3":"#000000","5:3":"#000000","6:3":"#000000","7:3":"#000000","8:3":"#000000","9:3":"#000000","10:3":"#000000","11:3":"#000000","12:3":"#000000","13:3":"#000000","14:3":"#000000","15:3":"#000000","16:3":"#000000","17:3":"#000000","18:3":"#000000","19:3":"#000000","20:3":"#000000","21:3":"#000000","22:3":"#000000","23:3":"#000000","24:3":"#000000","25:3":"#000000","26:3":"#000000","27:3":"#000000","28:3":"#000000","29:3":"#000000","30:3":"#000000","31:3":"#000000","0:4":"#000000","1:4":"#000000","2:4":"#000000","3:4":"#000000","4:4":"#000000","5:4":"#000000","6:4":"#000000","7:4":"#000000","8:4":"#000000","9:4":"#000000","10:4":"#000000","11:4":"#000000","12:4":"#000000","13:4":"#000000","14:4":"#000000","15:4":"#000000","16:4":"#000000","17:4":"#000000","18:4":"#000000","19:4":"#000000","20:4":"#000000","21:4":"#000000","22:4":"#000000","23:4":"#000000","24:4":"#000000","25:4":"#000000","26:4":"#000000","27:4":"#000000","28:4":"#000000","29:4":"#000000","30:4":"#000000","31:4":"#000000","0:5":"#000000","1:5":"#000000","2:5":"#000000","3:5":"#000000","4:5":"#000000","5:5":"#000000","6:5":"#000000","7:5":"#000000","8:5":"#000000","9:5":"#000000","10:5":"#000000","11:5":"#000000","12:5":"#000000","13:5":"#000000","14:5":"#000000","15:5":"#000000","16:5":"#000000","17:5":"#000000","18:5":"#000000","19:5":"#000000","20:5":"#000000","21:5":"#000000","22:5":"#000000","23:5":"#000000","24:5":"#000000","25:5":"#000000","26:5":"#000000","27:5":"#000000","28:5":"#000000","29:5":"#000000","30:5":"#000000","31:5":"#000000","0:6":"#000000","1:6":"#000000","2:6":"#000000","3:6":"#000000","4:6":"#000000","5:6":"#969696","6:6":"#000000","7:6":"#000000","8:6":"#000000","9:6":"#000000","10:6":"#000000","11:6":"#000000","12:6":"#000000","13:6":"#000000","14:6":"#000000","15:6":"#000000","16:6":"#000000","17:6":"#000000","18:6":"#000000","19:6":"#000000","20:6":"#000000","21:6":"#000000","22:6":"#000000","23:6":"#000000","24:6":"#000000","25:6":"#FFF5FA","26:6":"#000000","27:6":"#000000","28:6":"#000000","29:6":"#000000","30:6":"#000000","31:6":"#000000","0:7":"#000000","1:7":"#000000","2:7":"#000000","3:7":"#000000","4:7":"#000000","5:7":"#000000","6:7":"#000000","7:7":"#000000","8:7":"#000000","9:7":"#000000","10:7":"#000000","11:7":"#000000","12:7":"#000000","13:7":"#000000","14:7":"#000000","15:7":"#000000","16:7":"#000000","17:7":"#000000","18:7":"#000000","19:7":"#000000","20:7":"#000000","21:7":"#000000","22:7":"#000000","23:7":"#000000","24:7":"#000000","25:7":"#000000","26:7":"#000000","27:7":"#000000","28:7":"#000000","29:7":"#000000","30:7":"#000000","31:7":"#000000","0:8":"#000000","1:8":"#000000","2:8":"#000000","3:8":"#000000","4:8":"#000000","5:8":"#000000","6:8":"#000000","7:8":"#000000","8:8":"#000000","9:8":"#000000","10:8":"#000000","11:8":"#000000","12:8":"#000000","13:8":"#000000","14:8":"#000000","15:8":"#000000","16:8":"#000000","17:8":"#000000","18:8":"#000000","19:8":"#000000","20:8":"#FFD700","21:8":"#FFD700","22:8":"#000000","23:8":"#000000","24:8":"#000000","25:8":"#000000","26:8":"#000000","27:8":"#000000","28:8":"#000000","29:8":"#000000","30:8":"#000000","31:8":"#000000","0:9":"#000000","1:9":"#000000","2:9":"#000000","3:9":"#000000","4:9":"#000000","5:9":"#000000","6:9":"#000000","7:9":"#000000","8:9":"#000000","9:9":"#000000","10:9":"#000000","11:9":"#000000","12:9":"#000000","13:9":"#000000","14:9":"#000000","15:9":"#969696","16:9":"#000000","17:9":"#000000","18:9":"#000000","19:9":"#000000","20:9":"#000000","21:9":"#FFD700","22:9":"#FFC125","23:9":"#FFC125","24:9":"#000000","25:9":"#000000","26:9":"#000000","27:9":"#000000","28:9":"#000000","29:9":"#000000","30:9":"#000000","31:9":"#000000","0:10":"#000000","1:10":"#000000","2:10":"#000000","3:10":"#000000","4:10":"#000000","5:10":"#000000","6:10":"#000000","7:10":"#000000","8:10":"#000000","9:10":"#000000","10:10":"#000000","11:10":"#000000","12:10":"#000000","14:10":"#000000","15:10":"#000000","16:10":"#000000","17:10":"#000000","18:10":"#000000","19:10":"#000000","20:10":"#000000","21:10":"#FFC125","22:10":"#FFD700","23:10":"#FFD700","24:10":"#FFC125","25:10":"#000000","26:10":"#000000","27:10":"#000000","28:10":"#000000","29:10":"#000000","30:10":"#000000","31:10":"#000000","0:11":"#000000","1:11":"#000000","2:11":"#000000","3:11":"#000000","4:11":"#000000","5:11":"#000000","6:11":"#000000","8:11":"#000000","9:11":"#000000","10:11":"#000000","11:11":"#000000","12:11":"#000000","13:11":"#000000","14:11":"#000000","15:11":"#000000","16:11":"#000000","17:11":"#000000","18:11":"#000000","19:11":"#000000","20:11":"#000000","21:11":"#000000","22:11":"#FFC125","23:11":"#FFC125","24:11":"#FFC125","25:11":"#FFC125","26:11":"#000000","27:11":"#000000","28:11":"#000000","29:11":"#000000","30:11":"#000000","31:11":"#000000","0:12":"#000000","1:12":"#000000","2:12":"#000000","3:12":"#000000","4:12":"#000000","5:12":"#000000","7:12":"#FFFFFF","9:12":"#000000","10:12":"#000000","11:12":"#000000","12:12":"#000000","13:12":"#000000","14:12":"#000000","15:12":"#000000","16:12":"#000000","17:12":"#000000","18:12":"#000000","19:12":"#000000","20:12":"#000000","21:12":"#000000","22:12":"#FFD700","23:12":"#FFD700","24:12":"#FFC125","25:12":"#FFC125","26:12":"#FFC125","27:12":"#000000","28:12":"#000000","29:12":"#FFE5EA","30:12":"#000000","31:12":"#000000","0:13":"#000000","1:13":"#000000","2:13":"#000000","3:13":"#000000","4:13":"#000000","5:13":"#000000","6:13":"#000000","8:13":"#000000","9:13":"#000000","10:13":"#000000","11:13":"#000000","12:13":"#000000","13:13":"#000000","14:13":"#000000","15:13":"#000000","16:13":"#000000","17:13":"#000000","18:13":"#000000","19:13":"#000000","20:13":"#000000","21:13":"#000000","22:13":"#FFD700","23:13":"#FFD700","24:13":"#FFD700","25:13":"#FFD700","26:13":"#FFC125","27:13":"#000000","28:13":"#000000","29:13":"#000000","30:13":"#000000","31:13":"#000000","0:14":"#000000","1:14":"#000000","2:14":"#000000","3:14":"#000000","4:14":"#000000","5:14":"#000000","6:14":"#000000","7:14":"#000000","8:14":"#000000","9:14":"#000000","10:14":"#000000","11:14":"#000000","12:14":"#000000","13:14":"#000000","14:14":"#000000","15:14":"#000000","16:14":"#000000","17:14":"#000000","18:14":"#000000","19:14":"#000000","20:14":"#000000","21:14":"#000000","22:14":"#FFD700","23:14":"#FFD700","24:14":"#FFD700","25:14":"#FFD700","26:14":"#FFD700","27:14":"#FFC125","28:14":"#000000","29:14":"#000000","30:14":"#000000","31:14":"#000000","0:15":"#000000","1:15":"#000000","2:15":"#000000","3:15":"#000000","4:15":"#000000","5:15":"#000000","6:15":"#000000","7:15":"#000000","8:15":"#000000","9:15":"#000000","10:15":"#000000","11:15":"#000000","12:15":"#000000","13:15":"#000000","14:15":"#000000","15:15":"#000000","16:15":"#000000","17:15":"#000000","18:15":"#000000","19:15":"#000000","20:15":"#000000","21:15":"#FFE566","22:15":"#FFD700","23:15":"#FFE566","24:15":"#FFD700","25:15":"#FFD700","26:15":"#FFD700","27:15":"#FFC125","28:15":"#000000","29:15":"#000000","30:15":"#000000","31:15":"#000000","0:16":"#000000","1:16":"#000000","2:16":"#000000","3:16":"#000000","4:16":"#000000","5:16":"#000000","6:16":"#000000","7:16":"#000000","8:16":"#000000","9:16":"#000000","10:16":"#000000","11:16":"#000000","12:16":"#000000","13:16":"#000000","14:16":"#000000","15:16":"#000000","16:16":"#000000","17:16":"#000000","18:16":"#000000","19:16":"#000000","20:16":"#000000","21:16":"#FFE566","22:16":"#FFE566","23:16":"#FFD700","24:16":"#FFE566","25:16":"#FFD700","26:16":"#FFD700","27:16":"#FFC125","28:16":"#000000","29:16":"#000000","30:16":"#000000","31:16":"#000000","0:17":"#000000","1:17":"#000000","2:17":"#000000","3:17":"#000000","4:17":"#000000","5:17":"#000000","6:17":"#000000","7:17":"#000000","8:17":"#000000","9:17":"#000000","10:17":"#000000","11:17":"#000000","12:17":"#000000","13:17":"#000000","14:17":"#000000","15:17":"#000000","16:17":"#000000","17:17":"#000000","18:17":"#000000","19:17":"#000000","20:17":"#FFFCC0","21:17":"#FFFCC0","22:17":"#FFD700","23:17":"#FFD700","24:17":"#FFE566","25:17":"#FFD700","26:17":"#FFD700","27:17":"#FFC125","28:17":"#000000","29:17":"#000000","30:17":"#000000","31:17":"#000000","0:18":"#000000","1:18":"#000000","2:18":"#000000","3:18":"#000000","4:18":"#000000","5:18":"#000000","6:18":"#000000","7:18":"#000000","8:18":"#000000","9:18":"#000000","10:18":"#000000","11:18":"#000000","12:18":"#000000","13:18":"#000000","14:18":"#000000","15:18":"#000000","16:18":"#000000","17:18":"#000000","18:18":"#000000","19:18":"#FFD700","20:18":"#FFFCC0","21:18":"#FFFCC0","22:18":"#FFD700","23:18":"#FFE566","24:18":"#FFE566","25:18":"#FFD700","26:18":"#FFD700","27:18":"#FFC125","28:18":"#000000","29:18":"#000000","30:18":"#000000","31:18":"#000000","0:19":"#000000","1:19":"#000000","2:19":"#000000","3:19":"#000000","4:19":"#000000","5:19":"#000000","6:19":"#000000","7:19":"#000000","8:19":"#FFD700","9:19":"#000000","10:19":"#000000","11:19":"#000000","12:19":"#000000","13:19":"#000000","14:19":"#000000","15:19":"#000000","16:19":"#000000","17:19":"#000000","18:19":"#FFFCC0","19:19":"#FFFCC0","20:19":"#FFFCC0","21:19":"#FFFCC0","22:19":"#FFFCC0","23:19":"#FFE566","24:19":"#FFE566","25:19":"#FFD700","26:19":"#FFD700","27:19":"#000000","28:19":"#000000","29:19":"#000000","30:19":"#000000","31:19":"#000000","0:20":"#000000","1:20":"#000000","2:20":"#000000","3:20":"#000000","4:20":"#000000","5:20":"#000000","6:20":"#000000","7:20":"#000000","8:20":"#000000","9:20":"#FFD700","10:20":"#FFD700","11:20":"#FFD700","12:20":"#FFD700","13:20":"#FFD700","14:20":"#FFE566","15:20":"#FFD700","16:20":"#FFFCC0","17:20":"#FFFCC0","18:20":"#FFD700","19:20":"#FFD700","20:20":"#FFFCC0","21:20":"#FFFCC0","22:20":"#FFFCC0","23:20":"#FFE566","24:20":"#FFE566","25:20":"#FFD700","26:20":"#FFD700","27:20":"#000000","28:20":"#000000","29:20":"#000000","30:20":"#000000","31:20":"#000000","0:21":"#000000","1:21":"#000000","2:21":"#000000","3:21":"#000000","4:21":"#000000","5:21":"#000000","6:21":"#000000","7:21":"#000000","8:21":"#000000","9:21":"#FFD700","10:21":"#FFD700","11:21":"#FFD700","12:21":"#FFD700","13:21":"#FFD700","14:21":"#FFE566","15:21":"#FFE566","16:21":"#FFFCC0","17:21":"#FFD700","18:21":"#FFD700","19:21":"#FFD700","20:21":"#FFFCC0","21:21":"#FFFCC0","22:21":"#FFFCC0","23:21":"#FFE566","24:21":"#FFE566","25:21":"#FFD700","26:21":"#FFC125","27:21":"#000000","28:21":"#000000","29:21":"#000000","30:21":"#000000","31:21":"#000000","0:22":"#000000","1:22":"#000000","2:22":"#000000","3:22":"#000000","4:22":"#000000","5:22":"#000000","6:22":"#000000","7:22":"#000000","8:22":"#000000","9:22":"#000000","10:22":"#FFC125","11:22":"#FFC125","12:22":"#FFD700","13:22":"#FFD700","14:22":"#FFD700","15:22":"#FFD700","16:22":"#FFE566","17:22":"#FFFCC0","18:22":"#FFFCC0","19:22":"#FFFCC0","20:22":"#FFFCC0","21:22":"#FFFCC0","22:22":"#FFE566","23:22":"#FFE566","24:22":"#FFD700","25:22":"#FFD700","26:22":"#000000","27:22":"#000000","28:22":"#000000","29:22":"#000000","30:22":"#969696","31:22":"#000000","0:23":"#000000","1:23":"#000000","2:23":"#000000","3:23":"#000000","4:23":"#000000","5:23":"#000000","6:23":"#000000","7:23":"#000000","8:23":"#000000","9:23":"#000000","10:23":"#000000","11:23":"#FFC125","12:23":"#FFC125","13:23":"#FFD700","14:23":"#FFD700","15:23":"#FFE566","16:23":"#FFE566","17:23":"#FFE566","18:23":"#FFE566","19:23":"#FFFCC0","20:23":"#FFFCC0","21:23":"#FFE566","22:23":"#FFE566","23:23":"#FFE566","24:23":"#FFD700","25:23":"#000000","26:23":"#000000","27:23":"#000000","28:23":"#000000","29:23":"#000000","30:23":"#000000","31:23":"#000000","0:24":"#000000","1:24":"#000000","3:24":"#000000","4:24":"#000000","5:24":"#000000","6:24":"#000000","7:24":"#000000","8:24":"#000000","9:24":"#000000","10:24":"#000000","11:24":"#000000","12:24":"#000000","13:24":"#FFC125","14:24":"#FFD700","15:24":"#FFD700","16:24":"#FFE566","17:24":"#FFE566","18:24":"#FFE566","19:24":"#FFE566","20:24":"#FFE566","21:24":"#FFE566","22:24":"#FFE566","23:24":"#FFD700","24:24":"#000000","25:24":"#000000","26:24":"#000000","27:24":"#000000","28:24":"#000000","29:24":"#000000","30:24":"#000000","31:24":"#000000","0:25":"#000000","2:25":"#FFE5EA","4:25":"#000000","5:25":"#000000","6:25":"#000000","7:25":"#000000","8:25":"#000000","9:25":"#000000","10:25":"#000000","11:25":"#000000","12:25":"#000000","13:25":"#000000","14:25":"#FFC125","15:25":"#FFD700","16:25":"#FFD700","17:25":"#FFD700","18:25":"#FFE566","19:25":"#FFE566","20:25":"#FFE566","21:25":"#FFE566","22:25":"#000000","23:25":"#000000","24:25":"#000000","25:25":"#000000","26:25":"#000000","27:25":"#000000","28:25":"#000000","29:25":"#000000","30:25":"#000000","31:25":"#000000","0:26":"#000000","1:26":"#000000","3:26":"#000000","4:26":"#000000","5:26":"#000000","6:26":"#000000","7:26":"#000000","8:26":"#000000","9:26":"#000000","10:26":"#000000","11:26":"#000000","12:26":"#000000","13:26":"#000000","14:26":"#000000","15:26":"#000000","16:26":"#000000","17:26":"#000000","18:26":"#000000","19:26":"#000000","20:26":"#000000","21:26":"#000000","22:26":"#000000","23:26":"#000000","24:26":"#000000","25:26":"#000000","26:26":"#000000","27:26":"#000000","29:26":"#000000","30:26":"#000000","31:26":"#000000","0:27":"#000000","1:27":"#000000","2:27":"#000000","3:27":"#000000","4:27":"#000000","5:27":"#000000","6:27":"#000000","7:27":"#000000","8:27":"#000000","9:27":"#000000","10:27":"#000000","11:27":"#000000","12:27":"#000000","13:27":"#000000","14:27":"#000000","15:27":"#000000","16:27":"#000000","17:27":"#000000","18:27":"#000000","19:27":"#000000","20:27":"#000000","21:27":"#000000","22:27":"#000000","23:27":"#000000","24:27":"#000000","25:27":"#000000","26:27":"#000000","28:27":"#FFFFFF","30:27":"#000000","31:27":"#000000","0:28":"#000000","1:28":"#000000","2:28":"#000000","3:28":"#000000","4:28":"#000000","5:28":"#000000","6:28":"#000000","7:28":"#000000","8:28":"#FFFAFA","9:28":"#000000","10:28":"#000000","11:28":"#000000","12:28":"#000000","13:28":"#000000","14:28":"#000000","15:28":"#000000","16:28":"#000000","17:28":"#000000","18:28":"#000000","19:28":"#000000","20:28":"#000000","21:28":"#000000","22:28":"#000000","23:28":"#FFF5FA","24:28":"#000000","25:28":"#000000","26:28":"#000000","27:28":"#000000","30:28":"#000000","31:28":"#000000","0:29":"#000000","1:29":"#000000","2:29":"#000000","3:29":"#000000","4:29":"#000000","5:29":"#000000","6:29":"#000000","7:29":"#000000","8:29":"#000000","9:29":"#000000","10:29":"#000000","11:29":"#000000","12:29":"#969696","13:29":"#000000","14:29":"#000000","15:29":"#000000","16:29":"#000000","17:29":"#000000","18:29":"#000000","19:29":"#000000","20:29":"#000000","21:29":"#000000","22:29":"#000000","23:29":"#000000","24:29":"#000000","25:29":"#000000","26:29":"#000000","27:29":"#000000","31:29":"#000000","0:30":"#000000","1:30":"#000000","2:30":"#000000","3:30":"#000000","4:30":"#000000","5:30":"#000000","6:30":"#000000","7:30":"#000000","8:30":"#000000","9:30":"#000000","10:30":"#000000","11:30":"#000000","12:30":"#000000","13:30":"#000000","14:30":"#000000","15:30":"#000000","16:30":"#000000","17:30":"#000000","18:30":"#000000","19:30":"#000000","20:30":"#000000","21:30":"#000000","22:30":"#000000","23:30":"#000000","24:30":"#000000","25:30":"#000000","26:30":"#000000","27:30":"#000000","28:30":"#000000","30:30":"#000000","31:30":"#000000","0:31":"#000000","1:31":"#000000","2:31":"#000000","3:31":"#000000","4:31":"#000000","5:31":"#000000","6:31":"#000000","7:31":"#000000","8:31":"#000000","9:31":"#000000","10:31":"#000000","11:31":"#000000","12:31":"#000000","13:31":"#000000","14:31":"#000000","15:31":"#000000","16:31":"#000000","17:31":"#000000","18:31":"#000000","19:31":"#000000","20:31":"#000000","21:31":"#000000","22:31":"#000000","23:31":"#000000","24:31":"#000000","25:31":"#000000","26:31":"#000000","27:31":"#000000","28:31":"#000000","29:31":"#000000","30:31":"#000000","31:31":"#000000"},y=[15,10,222],v=[{y:6,x:5},{y:9,x:15},{y:22,x:30},{y:29,x:12}];function E(t){return t.map(t=>({...t,sort:Math.random()})).sort((t,e)=>t.sort-e.sort).map(t=>t)}let b=async t=>{let e,{dimensions:n,ctx:F,index:a,updatePixels:l}=t,r=!0,o=E(v),i=0,h=0;return D({dimensions:n,ctx:F,index:a,updatePixels:l,macroConfig:{coordinates:w}}),!function t(n){h>10&&(h=0,o=E(v));let F=(n-i)/1e3;i=n;let s=(h+=F)%10,d=[];for(let t=0;t<4;t++){let e=s-1*t;if(e<0||e>1||s>5){let e=new Uint8ClampedArray([255,255,255,0]),n=o[t];d.push({...n,rgba:e},{...n,y:n.y+1,rgba:e},{...n,y:n.y-1,rgba:e},{...n,x:n.x+1,rgba:e},{...n,x:n.x-1,rgba:e})}else{let n=255*Math.sin(e/1*Math.PI),F=o[t],a=new Uint8ClampedArray([255,255,255,n]),l=new Uint8ClampedArray([...y,n/2]);d.push({...F,rgba:a},{...F,y:F.y+1,rgba:l},{...F,y:F.y-1,rgba:l},{...F,x:F.x+1,rgba:l},{...F,x:F.x-1,rgba:l})}}r&&(l(d,a+1),e=c(t))}(performance.now()),()=>{r=!1,d(e)}},M=["#6aa84f","#fa6a31","#2e7fc8","#ffc332","#218787"],S=async t=>{let{macroConfig:e,dimensions:n,ctx:F,index:a,updatePixels:l}=t,o={color:"#fff",width:n.width,height:n.height,...e},i=setInterval(()=>{let t=Math.floor((new Date(o.endDate).getTime()-new Date().getTime())/6e4+1),e=F.measureText("".concat(t)),i=e.actualBoundingBoxAscent+e.actualBoundingBoxDescent;F.clearRect(0,0,o.width,o.height),F.fillStyle=M[t-1],F.fillRect(0,0,n.width,n.height),F.textBaseline="top",F.font="24px Arial",F.fillStyle=o.color,F.fillText("".concat(t),o.width/2-e.width/2,o.height/2-i/2),l(r(F,n),a)},250);return()=>clearInterval(i)};async function I(t){let{macros:e,dimensions:n,updatePixels:F}=t,a={[A.Box]:o,[A.Text]:p,[A.Marquee]:i,[A.Twinkle]:C,[A.Ripple]:u,[A.Image]:m,[A.Meteors]:g,[A.Custom]:x,[A.Coordinates]:D,[A.Moon]:b,[A.Countdown]:S},r=await Promise.all(e.map((t,e)=>{let{macroName:r,macroConfig:o}=t,{ctx:i}=function(t){let e=(0,l.Nw)(t.width,t.height),n=e.getContext("2d");return{canvas:e,ctx:n}}(n);return(0,a[r])({macroConfig:o,dimensions:n,ctx:i,index:e,updatePixels:F})}));return()=>{for(let t of r)t()}}let k=t=>{let{height:e,width:n}=t,F=[];for(let t=0;t<e;t++){let t=[];for(let e=0;e<n;e++)t.push([]);F.push(t)}return F};var R=n(75828);let j=(0,R.createServerReference)("4015575036528a4d8595c42573fc54f9f528ccf8d0",R.callServer,void 0,R.findSourceMapURL,"transformPresetToDisplayMacros");var B=n(11595);let T={height:32,width:32};function L(t){let{preset:e,isDefaultPreset:n=!1}=t,[r,o]=(0,a.useState)(),[i,h]=(0,a.useState)(),[s,c]=(0,a.useState)([]);(0,a.useEffect)(()=>{(async()=>{c(await j(e||null))})()},[JSON.stringify(e)]),(0,a.useEffect)(()=>{let t=(0,l.Nw)(T.width,T.height),e=t.getContext("2d"),n=function(t){let{dimensions:e,onPixelsChange:n}=t,F=()=>{};return{render:async t=>{F();let a=[];for(let t=0;t<32;t++)for(let e=0;e<32;e++)a.push({x:t,y:e,rgba:new Uint8ClampedArray([0,0,0,255])});n(a);let l=k(e);return F=await I({macros:t,dimensions:e,updatePixels:(t,e)=>{let F=[];t.forEach(t=>{var n;let{y:a,x:r}=t,o=null==l?void 0:null===(n=l[a])||void 0===n?void 0:n[r];if(!o)return;o[e]=t;let i=o.reduce((t,e)=>(function(t){let{newColor:e,baseColor:n}=t;if(null===e)return n;let F=n[3]/255,a=e[3]/255,l=[];return l[3]=1-(1-a)*(1-F),l[0]=Math.round(e[0]*a/l[3]+n[0]*F*(1-a)/l[3]),l[1]=Math.round(e[1]*a/l[3]+n[1]*F*(1-a)/l[3]),l[2]=Math.round(e[2]*a/l[3]+n[2]*F*(1-a)/l[3]),l[3]=255*l[3],new Uint8ClampedArray(l)})({newColor:e.rgba,baseColor:t}),new Uint8ClampedArray([0,0,0,255]));F.push({...t,rgba:i})}),n(F)}})},stop:()=>{F()}}}({dimensions:T,onPixelsChange:n=>{n.forEach(t=>{if(!t.rgba)return;let n=e.createImageData(1,1),F=n.data;F[0]=t.rgba[0],F[1]=t.rgba[1],F[2]=t.rgba[2],F[3]=t.rgba[3],e.putImageData(n,t.x,t.y)}),o(t.toDataURL("image/png"))}});return h(n),()=>n.stop()},[]),(0,a.useEffect)(()=>{d()},[i,JSON.stringify(s)]);let d=(0,a.useCallback)(()=>{i&&(null==i||i.render(s))},[i,JSON.stringify(s)]);return(0,F.jsxs)("div",{style:{width:"100%",aspectRatio:"1 / 1",background:"#000",display:"flex"},children:[r&&(0,F.jsx)("img",{alt:"".concat(null==e?void 0:e.scenes.map(t=>t.sceneName).join(", ")," scene"),src:r,style:{imageRendering:"pixelated"},width:"100%"}),n&&(0,F.jsx)(B.Overlay,{color:"#000",backgroundOpacity:.85,zIndex:0})]})}}}]);