(()=>{var e={};e.id=307,e.ids=[307],e.modules={88044:e=>{"use strict";e.exports=require("canvas")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79646:e=>{"use strict";e.exports=require("child_process")},29021:e=>{"use strict";e.exports=require("fs")},33873:e=>{"use strict";e.exports=require("path")},23245:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>m,tree:()=>l});var n=r(70260),s=r(28203),a=r(25155),i=r.n(a),d=r(67292),o={};for(let e in d)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>d[e]);r.d(t,o);let l=["",{children:["panel",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,59184)),"/Users/roykolak/Projects/moonclock/src/app/panel/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,71354)),"/Users/roykolak/Projects/moonclock/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,41485,23)),"next/dist/client/components/unauthorized-error"]}],c=["/Users/roykolak/Projects/moonclock/src/app/panel/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},m=new n.AppPageRouteModule({definition:{kind:s.RouteKind.APP_PAGE,page:"/panel/page",pathname:"/panel",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},28313:(e,t,r)=>{"use strict";r.r(t),r.d(t,{"0066b73584b724951cc5743f2dab479a8afaca2be4":()=>p,"4015575036528a4d8595c42573fc54f9f528ccf8d0":()=>n.q,"401683108c0dd7e55348fbe273d1a80d416bb6a6e4":()=>l,"405cb49bf264bc79adb2a8031a152b397d8cf45160":()=>u,"40c14260ce2b230a9d73f41998d1bf4a15c4c425ee":()=>c});var n=r(51170),s=r(21590);r(70376);var a=r(47735),i=r(63601),d=r(67296),o=r(99344);async function l(e){(0,i.XO)({scheduledPreset:{updatedAt:new Date().toJSON(),preset:null,endTime:null,...e}}),(0,a.revalidatePath)("/panel")}async function c(e){let{scheduledPreset:t}=await (0,i.bQ)();if(!t)return(0,a.revalidatePath)("/panel");if(null===t.endTime)return;let r=new Date(t.endTime);r.setMinutes(r.getMinutes()+e),await (0,i.XO)({scheduledPreset:{...t,endTime:r.toJSON(),updatedAt:new Date().toJSON()}}),(0,a.revalidatePath)("/panel")}async function u(e){let t=(0,d.W)(e);(0,i.XO)({scheduledPreset:{preset:{...e,name:"Custom"},endTime:t?t.toJSON():null,updatedAt:new Date().toJSON()}}),(0,a.revalidatePath)("/panel")}(0,o.D)([l,c,u]),(0,s.A)(l,"401683108c0dd7e55348fbe273d1a80d416bb6a6e4",null),(0,s.A)(c,"40c14260ce2b230a9d73f41998d1bf4a15c4c425ee",null),(0,s.A)(u,"405cb49bf264bc79adb2a8031a152b397d8cf45160",null);var m=r(68726);async function p(){(0,m.yY)()}(0,o.D)([p]),(0,s.A)(p,"0066b73584b724951cc5743f2dab479a8afaca2be4",null)},3191:(e,t,r)=>{"use strict";r.r(t),r.d(t,{"003cea0d5ad419b7db89820aea65799cf884b0983f":()=>n.V8,"00778c6ed4a46b3cc6deb54d95f46a80fe20e8653b":()=>n.zn,"007c97be3c926b2f0462d6d909c13ece0073520f76":()=>n.cR});var n=r(41824)},28158:(e,t,r)=>{Promise.resolve().then(r.bind(r,46648)),Promise.resolve().then(r.bind(r,15535))},19910:(e,t,r)=>{Promise.resolve().then(r.bind(r,56572)),Promise.resolve().then(r.bind(r,240))},240:(e,t,r)=>{"use strict";r.d(t,{default:()=>N});var n=r(45512),s=r(74164),a=r(44914),i=r(62148),d=r(48376),o=r(23464),l=r(15436),c=r(31824),u=r(15166),m=r(27521),p=r(89465),f=r(7423),h=r(79692),x=r(29571),b=r(28676),j=r(28500),v=r(72590),g=r(26248);let w=(0,g.createServerReference)("405cb49bf264bc79adb2a8031a152b397d8cf45160",g.callServer,void 0,g.findSourceMapURL,"createCustomScheduledPreset"),y=(0,g.createServerReference)("401683108c0dd7e55348fbe273d1a80d416bb6a6e4",g.callServer,void 0,g.findSourceMapURL,"updateScheduledPreset"),P=(0,g.createServerReference)("40c14260ce2b230a9d73f41998d1bf4a15c4c425ee",g.callServer,void 0,g.findSourceMapURL,"changeEndTime");var S=r(15992),k=r(27240);function C({hardwarePreset:e,formattedLastHeartbeat:t,formattedHardwareRenderedAt:r}){return(0,n.jsx)(S.Accordion,{defaultValue:"Apples",variant:"filled",mt:"xs",children:(0,n.jsxs)(S.Accordion.Item,{value:"hardware",children:[(0,n.jsx)(S.Accordion.Control,{children:(0,n.jsx)(d.Text,{size:"sm",c:"dimmed",children:"Hardware Details"})}),(0,n.jsx)(S.Accordion.Panel,{children:(0,n.jsx)(c.Stack,{children:(0,n.jsxs)(k.Grid,{gutter:0,children:[(0,n.jsx)(k.Grid.Col,{span:4,children:(0,n.jsx)(d.Text,{c:"dimmed",size:"sm",fw:"bold",children:"Scene:"})}),(0,n.jsx)(k.Grid.Col,{span:8,children:(0,n.jsxs)(d.Text,{c:"dimmed",size:"sm",children:[e.scenes[0].sceneName," scene"]})}),(0,n.jsx)(k.Grid.Col,{span:4,children:(0,n.jsx)(d.Text,{c:"dimmed",size:"sm",fw:"bold",children:"Rendered at:"})}),(0,n.jsx)(k.Grid.Col,{span:8,children:(0,n.jsx)(d.Text,{c:"dimmed",size:"sm",children:r})}),(0,n.jsx)(k.Grid.Col,{span:4,children:(0,n.jsx)(d.Text,{c:"dimmed",size:"sm",mb:"xs",fw:"bold",children:"Last loop run:"})}),(0,n.jsx)(k.Grid.Col,{span:8,children:(0,n.jsx)(d.Text,{c:"dimmed",size:"sm",mb:"xs",children:t})})]})})})]},"hardware")})}var T=(0,r(74774).A)("outline","dots","IconDots",[["path",{d:"M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-1"}],["path",{d:"M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-2"}]]);let M=(0,g.createServerReference)("0066b73584b724951cc5743f2dab479a8afaca2be4",g.callServer,void 0,g.findSourceMapURL,"reloadHardwareScene");var A=r(99553);function D(e){let t=Math.abs(e);return`${e>0?"+":"-"}${t<60?t:t/60} ${t<60?"min":"hour"}`}function N({panel:e,hardwarePreset:t,scheduledPreset:r,formattedEndTime:g,formattedLastHeartbeat:S,formattedHardwareRenderedAt:k,presets:N,customSceneNames:H}){let[R,_]=(0,j.useDisclosure)(),O=parseInt(r?.preset?.[x.M8.TimeAdjustmentAmount]||e.timeAdjustmentAmount,10);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.Modal,{opened:R,title:"Set custom preset",onClose:_.close,children:(0,n.jsx)(v.PresetForm,{customSceneNames:H,preset:{name:"Custom Preset"},action:async e=>{await w(e),_.close()},submitLabel:"Apply now"})}),(0,n.jsxs)(a.Card,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,style:{maxWidth:500},children:[(0,n.jsx)(a.Card.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:(0,n.jsxs)(i.Group,{justify:"space-between",children:[(0,n.jsx)(d.Text,{fw:700,"data-testid":"panel-name",children:e.name}),(0,n.jsxs)(o.Menu,{withinPortal:!0,position:"bottom-end",shadow:"sm",children:[(0,n.jsx)(o.Menu.Target,{children:(0,n.jsx)(l.ActionIcon,{variant:"subtle",color:"gray","data-testid":"panel-menu",children:(0,n.jsx)(T,{size:16})})}),(0,n.jsxs)(o.Menu.Dropdown,{children:[(0,n.jsx)(o.Menu.Item,{disabled:!r?.preset,onClick:()=>{y({preset:null,endTime:null})},children:"Clear Scene"}),(0,n.jsx)(o.Menu.Item,{onClick:async()=>{(0,A.showNotification)({message:"Hardware Scene reloading..."}),await M()},children:"Reload Hardware"})]})]})]})}),(0,n.jsxs)(a.Card.Section,{children:[(0,n.jsxs)("div",{style:{position:"relative"},children:[(0,n.jsx)(b.K,{preset:r?.preset||e.defaultPreset,isDefaultPreset:!r?.preset}),!r?.preset&&(0,n.jsxs)(c.Stack,{style:{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%, -50%)"},children:[N.map((e,t)=>(0,n.jsx)(u.Button,{variant:"filled",fullWidth:!0,onClick:()=>{let t=function(e){let t=new Date;if("until"===e.mode){let r=parseInt(e.untilDay,10),n=parseInt(e.untilHour,10),s=parseInt(e.untilMinute,10);t.setDate(t.getDate()+r),t.setHours(n,s,0,0)}else if("for"===e.mode){let[r,n]=e.forTime.split(":"),s=parseInt(r,10),a=parseInt(n,10);if(0===s&&0===a)return null;t.setHours(t.getHours()+s,t.getMinutes()+a,0,0)}return t}(e);y({preset:e,endTime:t?.toJSON()||null})},children:e.name},`preset-${t}`)),(0,n.jsx)(u.Button,{variant:"light",fullWidth:!0,onClick:_.open,children:"Custom..."})]})]}),r?.preset&&(0,n.jsxs)(m.Flex,{p:"lg",children:[(0,n.jsx)(p.Box,{children:(0,n.jsxs)(c.Stack,{gap:4,children:[(0,n.jsx)(f.Center,{children:(0,n.jsxs)(d.Text,{children:[r.preset.name," until..."]})}),(0,n.jsx)(h.Badge,{color:"gray",radius:"sm",style:{height:50,padding:"8px 16px",fontSize:38,lineHeight:38},styles:{label:{color:"#CCC"}},"data-testid":"end-time",children:g})]})}),(0,n.jsx)(p.Box,{flex:"auto"}),(0,n.jsx)(m.Flex,{gap:"lg",children:(0,n.jsxs)(c.Stack,{gap:8,children:[(0,n.jsx)(u.Button,{variant:"filled",disabled:null===r.endTime,onClick:()=>{P(O)},children:D(O)}),(0,n.jsx)(u.Button,{variant:"filled",disabled:null===r.endTime,onClick:()=>P(-O),children:D(-O)})]})})]})]})]}),(0,n.jsx)(C,{hardwarePreset:t,formattedLastHeartbeat:S,formattedHardwareRenderedAt:k})]})}},59184:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>c,dynamic:()=>o,generateMetadata:()=>l});var n=r(62740),s=r(46648),a=r(41824),i=r(15535),d=r(20304);let o="force-dynamic";async function l(){let{panel:e}=(0,d.bQ)();return{title:e.name}}async function c(){let{scheduledPreset:e,panel:t,presets:r,hardware:o}=(0,d.bQ)(),l=await (0,a.V8)(),c=await (0,a.cR)(),u=null,m=null,p=null;return e&&(u=e.endTime?new Date(e.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):"forever"),l&&(m=new Date(l).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",second:"2-digit"})),o.renderedAt&&(p=new Date(o.renderedAt).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",second:"2-digit"})),(0,n.jsx)(s.default,{children:(0,n.jsx)(i.default,{panel:t,scheduledPreset:e,hardwarePreset:o.preset,formattedEndTime:u,formattedLastHeartbeat:m,formattedHardwareRenderedAt:p,presets:r,customSceneNames:c})})}},15535:(e,t,r)=>{"use strict";r.d(t,{default:()=>n});let n=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/roykolak/Projects/moonclock/src/components/Panel.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/roykolak/Projects/moonclock/src/components/Panel.tsx","default")},63601:(e,t,r)=>{"use strict";r.d(t,{XO:()=>m,bQ:()=>u});var n=r(29021),s=r.n(n),a=r(84384),i=r(68726);let d={name:"Default",scenes:[{sceneName:a.eU.Blank,sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"00",forTime:"0:00"},o={panel:{name:"My Moonclock",timeAdjustmentAmount:"5",defaultPreset:d,brightness:30,pwnLsbNanoseconds:130,gpioSlowdown:4,pwmBits:11},scheduledPreset:{preset:null,endTime:null},hardware:{preset:d},presets:[{name:"Sleep Mode",scenes:[{sceneName:a.eU.Moon,sceneConfig:{}}],mode:"until",untilDay:"1",untilHour:"7",untilMinute:"00",forTime:""},{name:"Nap Mode",scenes:[{sceneName:"bunny",sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"0",forTime:"2:00"},{name:"Timeout",scenes:[{sceneName:a.eU.Countdown,sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"0",forTime:"0:05"}]};function l(){return"test"===process.env.APP_ENV?"./database-test.json":(0,i.G3)()}function c(){let e=l();try{let t=s().readFileSync(e).toString();return JSON.parse(t)}catch{return console.log(`trouble loading ${e}, loading default data`),JSON.parse(JSON.stringify(o))}}function u(){return c()}function m(e){var t;t={...c(),...e},s().writeFileSync(l(),JSON.stringify(t,null,2),{mode:510})}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[281,700,801,968,735,912,764,521],()=>r(23245));module.exports=n})();