(()=>{var e={};e.id=933,e.ids=[933],e.modules={88044:e=>{"use strict";e.exports=require("canvas")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79646:e=>{"use strict";e.exports=require("child_process")},29021:e=>{"use strict";e.exports=require("fs")},33873:e=>{"use strict";e.exports=require("path")},56681:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d});var s=t(70260),n=t(28203),o=t(25155),i=t.n(o),a=t(67292),l={};for(let e in a)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);t.d(r,l);let d=["",{children:["presets",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,15572)),"/Users/roykolak/Projects/moonclock/src/app/presets/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,71354)),"/Users/roykolak/Projects/moonclock/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,41485,23)),"next/dist/client/components/unauthorized-error"]}],c=["/Users/roykolak/Projects/moonclock/src/app/presets/page.tsx"],u={require:t,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:n.RouteKind.APP_PAGE,page:"/presets/page",pathname:"/presets",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},31957:(e,r,t)=>{"use strict";t.r(r),t.d(r,{"4015575036528a4d8595c42573fc54f9f528ccf8d0":()=>s.q});var s=t(51170)},82151:(e,r,t)=>{Promise.resolve().then(t.bind(t,46648)),Promise.resolve().then(t.bind(t,62993))},12415:(e,r,t)=>{Promise.resolve().then(t.bind(t,56572)),Promise.resolve().then(t.bind(t,75031))},75031:(e,r,t)=>{"use strict";t.d(r,{PresetsList:()=>h});var s=t(45512),n=t(74222),o=t(31824),i=t(15166),a=t(44914),l=t(62148),d=t(27521),c=t(89465),u=t(48376),p=t(28676),m=t(28531),x=t.n(m);function f({index:e,preset:r,formattedEndTime:t}){return(0,s.jsx)(a.Card,{padding:"xs","data-testid":"preset-item",children:(0,s.jsxs)(l.Group,{justify:"space-between",children:[(0,s.jsxs)(d.Flex,{align:"center",gap:"sm",children:[(0,s.jsx)(c.Box,{w:"46",children:(0,s.jsx)(p.K,{preset:r})}),(0,s.jsxs)(c.Box,{children:[(0,s.jsx)(u.Text,{fw:"bold",children:r.name}),(0,s.jsx)(u.Text,{size:"sm",c:"dimmed",children:t})]})]}),(0,s.jsx)(d.Flex,{align:"center",gap:"xs",children:(0,s.jsx)(i.Button,{size:"sm",variant:"light",href:`/presets/${e}/edit`,component:x(),children:"Edit"})})]})},r.name)}function h({presets:e,formattedEndTimes:r}){return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.Title,{order:2,mb:"md",children:"Presets"}),(0,s.jsx)(o.Stack,{children:e.map((e,t)=>(0,s.jsx)(f,{preset:e,index:t,formattedEndTime:r[t]},t))}),(0,s.jsx)(i.Button,{variant:"light",fullWidth:!0,mt:"lg",size:"md",href:"/presets/new",component:x(),children:"New Preset"})]})}},15572:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>l,dynamic:()=>a});var s=t(62740),n=t(46648),o=t(62993),i=t(20304);let a="force-dynamic";async function l(){let{presets:e}=await (0,i.bQ)(),r=e.map(e=>(function(e){let{mode:r}=e;if("until"===r){let r=function(e){let r=new Date;if("until"===e.mode){let t=parseInt(e.untilDay,10),s=parseInt(e.untilHour,10),n=parseInt(e.untilMinute,10);r.setDate(r.getDate()+t),r.setHours(s,n,0,0)}else if("for"===e.mode){let[t,s]=e.forTime.split(":"),n=parseInt(t,10),o=parseInt(s,10);if(0===n&&0===o)return null;r.setHours(r.getHours()+n,r.getMinutes()+o,0,0)}return r}(e);return`Until ${r?.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})} tomorrow`}if("for"===r){let[r,t]=e.forTime.split(":"),s=parseInt(r,10),n=parseInt(t,10);return 0===s&&0===n?"Forever":0===s?`For ${n} minutes`:0===n?`For ${s} hours`:`For ${s} hours & ${n} mins`}return""})(e));return(0,s.jsx)(n.default,{children:(0,s.jsx)(o.PresetsList,{presets:e,formattedEndTimes:r})})}},62993:(e,r,t)=>{"use strict";t.d(r,{PresetsList:()=>s});let s=(0,t(46760).registerClientReference)(function(){throw Error("Attempted to call PresetsList() from the server but PresetsList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/roykolak/Projects/moonclock/src/components/PresetsList.tsx","PresetsList")}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[281,700,912,764],()=>t(56681));module.exports=s})();