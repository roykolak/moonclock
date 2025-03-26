(()=>{var e={};e.id=297,e.ids=[297],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},29021:e=>{"use strict";e.exports=require("fs")},33873:e=>{"use strict";e.exports=require("path")},71115:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>a.a,__next_app__:()=>u,pages:()=>d,routeModule:()=>p,tree:()=>c});var n=r(70260),s=r(28203),o=r(25155),a=r.n(o),i=r(67292),l={};for(let e in i)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>i[e]);r.d(t,l);let c=["",{children:["composer",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,75674)),"/Users/roykolak/Projects/moonclock/src/app/composer/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,71354)),"/Users/roykolak/Projects/moonclock/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,41485,23)),"next/dist/client/components/unauthorized-error"]}],d=["/Users/roykolak/Projects/moonclock/src/app/composer/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},p=new n.AppPageRouteModule({definition:{kind:s.RouteKind.APP_PAGE,page:"/composer/page",pathname:"/composer",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},17838:(e,t,r)=>{"use strict";r.r(t),r.d(t,{"40b5d2047e2757cff8c6d31ee1a9ab352e11e6bd08":()=>a});var n=r(21590);r(70376);var s=r(29021),o=r.n(s);async function a({name:e,coordinates:t}){let r=`./custom_scenes/${e}.json`;o().writeFileSync(r,JSON.stringify(t,null,2))}(0,r(99344).D)([a]),(0,n.A)(a,"40b5d2047e2757cff8c6d31ee1a9ab352e11e6bd08",null)},55263:(e,t,r)=>{"use strict";r.r(t),r.d(t,{"002aa21eceb7baff33c3b3104dca68851f89d867a1":()=>n.cR,"008fc986eaf43402eb796d17541d6759aa1c9a465b":()=>n.zn,"00b2b40489db12b9391a83fce66626def34a041379":()=>n.V8});var n=r(41824)},87131:(e,t,r)=>{Promise.resolve().then(r.bind(r,46648)),Promise.resolve().then(r.bind(r,31978))},63571:(e,t,r)=>{Promise.resolve().then(r.bind(r,56572)),Promise.resolve().then(r.bind(r,47352))},56572:(e,t,r)=>{"use strict";r.d(t,{default:()=>y});var n=r(45512),s=r(40528),o=r(62148),a=r(78954),i=r(48376),l=r(23726),c=r(15436),d=r(52669),u=r(28500),p=r(11526),h=r(33563),x=r(36857),m=r(81346),f=r(45869),b=r(28531),v=r.n(b),j=r(79334),g=r(71709);let y=function({children:e}){let[t,{toggle:r}]=(0,u.useDisclosure)(),b=(0,j.usePathname)();return(0,n.jsxs)(s.AppShell,{header:{height:60},navbar:{width:300,breakpoint:"sm",collapsed:{mobile:!t}},padding:"md",children:[(0,n.jsx)(s.AppShell.Header,{children:(0,n.jsxs)(o.Group,{align:"center",h:"100%",px:"md",children:[(0,n.jsx)(a.Burger,{opened:t,onClick:r,hiddenFrom:"sm",size:"sm","data-testid":"app-menu"}),(0,n.jsx)(i.Text,{flex:1,children:"Moon Clock"})]})}),(0,n.jsxs)(s.AppShell.Navbar,{p:"md",children:[(0,n.jsx)(l.NavLink,{component:v(),href:"/",label:"Panel",active:b.includes("/panel"),leftSection:(0,n.jsx)(c.ActionIcon,{variant:"light",children:(0,n.jsx)(p.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,n.jsx)(l.NavLink,{component:v(),href:"/presets",label:"Presets","data-testid":"nav-presets",active:b.includes("/presets"),leftSection:(0,n.jsx)(c.ActionIcon,{variant:"light",children:(0,n.jsx)(h.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,n.jsx)(l.NavLink,{component:v(),href:"/composer",label:"Composer",active:b.includes("/composer"),leftSection:(0,n.jsx)(c.ActionIcon,{variant:"light",children:(0,n.jsx)(x.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,n.jsx)(l.NavLink,{component:v(),href:"/settings",label:"Settings",active:b.includes("/settings"),leftSection:(0,n.jsx)(c.ActionIcon,{variant:"light",children:(0,n.jsx)(m.A,{style:{width:"70%",height:"70%"},stroke:1.5})})})]}),(0,n.jsx)(s.AppShell.Main,{children:(0,n.jsx)(g.tH,{fallbackRender:({error:e})=>(console.log(e.stack),(0,n.jsx)(d.Alert,{title:"There was a problem!",color:"red",icon:(0,n.jsx)(f.A,{}),children:e.message})),children:e})})]})}},47352:(e,t,r)=>{"use strict";r.d(t,{Editor:()=>C});var n=r(45512),s=r(58009),o=r(62148),a=r(15166),i=r(31824),l=r(63938),c=r(74164),d=r(388),u=r(9182),p=r(66816),h=r(52669),x=r(18870),m=r(28500),f=r(55705);function b({children:e,opacity:t}){return(0,n.jsx)("div",{style:{opacity:t,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"},children:e})}function v({y:e,x:t,children:r}){return(0,n.jsx)("div",{style:{width:20,textAlign:"center",display:"inline-flex",alignItems:"center",justifyContent:"center",aspectRatio:"1/1"},children:r},`row_${e}_col_${t}`)}function j({y:e,x:t,onClick:r,onMouseOver:s,matrix:o,showGrid:a}){return(0,n.jsx)("div",{"data-coordinates":`${t}:${e}`,onClick:r,onMouseOver:s,"data-testid":`dot-${t}-${e}`,style:{backgroundColor:o[`${t}:${e}`]||"#000",height:"90%",width:"90%",display:"inline-block",borderRadius:3,boxShadow:"1px 1px 1px #333",border:a&&(15===t||15===e)?"1px solid #aaa":"none"}})}function g({activeColor:e,matrix:t,setMatrix:r,showGrid:o}){let a=(0,s.useRef)(null),[i,l]=(0,s.useState)(!1);return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{ref:a,style:{background:"#000",position:"relative",touchAction:"none"},onMouseDown:()=>l(!0),onMouseUp:()=>l(!1),onTouchMove:n=>{let s=n.touches[0],o=document.elementFromPoint(s.clientX,s.clientY),{coordinates:a}=o?.dataset;a&&r({...t,[a]:e})},children:(0,n.jsx)("div",{style:{zIndex:1,position:"relative"},children:[...Array(32).keys()].map(s=>(0,n.jsx)(b,{y:s,opacity:1,children:[...Array(32).keys()].map(a=>(0,n.jsx)(v,{y:s,x:a,children:(0,n.jsx)(j,{y:s,x:a,matrix:t,onClick:()=>{r({...t,[`${a}:${s}`]:e})},showGrid:o,onMouseOver:()=>{i&&r({...t,[`${a}:${s}`]:e})}})},`row_${s}_col_${a}`))},`row_${s}`))})})})}var y=r(26248);let k=(0,y.createServerReference)("40b5d2047e2757cff8c6d31ee1a9ab352e11e6bd08",y.callServer,void 0,y.findSourceMapURL,"updateCustomSceneData");function S({color:e,setActiveColor:t,activeColor:r,index:s}){return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{style:{width:"25px",height:"25px",background:e||"#000",border:e===r?"2px solid red":"none"},"data-testid":`color-${s}`,onClick:()=>t(e)})})}let w=["#89CFF0","#facc0d"];function A({activeColor:e,setActiveColor:t,matrix:r}){let[i,l]=(0,s.useState)(w);return(0,s.useEffect)(()=>{let e=new Set;for(let t in r)e.add(r[t]);l([...w,...e])},[JSON.stringify(r)]),(0,n.jsxs)(o.Group,{justify:"space-between",w:"100%",children:[(0,n.jsx)(o.Group,{gap:0,children:i.map((r,s)=>(0,n.jsx)(S,{color:r,setActiveColor:t,activeColor:e,index:s},`${s}-${r}`))}),(0,n.jsx)("form",{onSubmit:e=>{e.preventDefault(),l([...i,e.target.elements.new_color.value])},children:(0,n.jsxs)(o.Group,{gap:"xs",children:[(0,n.jsx)("input",{type:"color",name:"new_color"}),(0,n.jsx)(a.Button,{type:"submit",size:"compact-sm",variant:"light",children:"Add"})]})})]})}function C({customScenes:e}){let[t,r]=(0,s.useState)(e[0]),[b,v]=(0,s.useState)(!1),[j,y]=(0,s.useState)(null),[S,w]=(0,s.useState)({}),[C,P]=(0,s.useState)(""),[_,{open:$,close:E}]=(0,m.useDisclosure)(),T=(0,f.m)({mode:"uncontrolled",initialValues:{name:""}});return(0,n.jsxs)(i.Stack,{children:[(0,n.jsx)(l.Select,{placeholder:"Select a scene...",variant:"filled",style:{flex:1},value:t?.name,"data-testid":"edit-scene-select",data:[{label:"New scene",value:"new-scene"},...e?.map(({name:e})=>({label:e,value:e}))],onChange:t=>{if("new-scene"===t)return $();let n=e.find(({name:e})=>e===t);n&&r(n)}}),(0,n.jsx)(c.Modal,{title:"New scene",opened:_,onClose:E,children:(0,n.jsxs)("form",{onSubmit:T.onSubmit(async({name:e})=>{let t={name:e,coordinates:{}};await k(t),r(t),E()}),children:[(0,n.jsx)(d.TextInput,{label:"Scene Name","data-testid":"new-scene-name",...T.getInputProps("name")},T.key("name")),(0,n.jsx)(o.Group,{justify:"flex-end",mt:"md",children:(0,n.jsx)(a.Button,{type:"submit",children:"Create"})})]})}),S&&t&&(0,n.jsxs)(u.Tabs,{defaultValue:"editor",variant:"outline",onChange:e=>{"raw-data"===e&&P(JSON.stringify(S,null,2))},children:[(0,n.jsxs)(u.Tabs.List,{mb:"md",children:[(0,n.jsx)(u.Tabs.Tab,{value:"editor","data-testid":"editor-tab",children:"Editor"}),(0,n.jsx)(u.Tabs.Tab,{value:"raw-data","data-testid":"raw-data-tab",children:"Raw Data"})]}),(0,n.jsx)(u.Tabs.Panel,{value:"editor",children:(0,n.jsxs)(i.Stack,{children:[(0,n.jsx)(A,{activeColor:j,setActiveColor:y,matrix:S}),(0,n.jsx)(g,{activeColor:j,matrix:S,setMatrix:w,showGrid:b}),(0,n.jsx)(p.Checkbox,{checked:b,onChange:()=>v(e=>!e),label:"Show grid lines"}),(0,n.jsx)(a.Button,{onClick:()=>{k({name:t.name,coordinates:S})},children:"Save Scene"})]})}),(0,n.jsxs)(u.Tabs.Panel,{value:"raw-data",children:[(0,n.jsx)(h.Alert,{variant:"light",color:"red",my:"sm",children:"Raw Data Mode is only useful for importing or exporting scene data... Be careful!"}),(0,n.jsx)(x.Textarea,{"data-testid":"raw-data-textarea",value:C,onChange:e=>{let{value:t}=e.currentTarget;P(t)},rows:20}),(0,n.jsx)(a.Button,{mt:"md",fullWidth:!0,onClick:()=>{try{let e=JSON.parse(C);w(e),k({name:t.name,coordinates:e})}catch(e){alert(e)}},children:"Save Scene"})]})]})]})}},75674:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l,dynamic:()=>i});var n=r(62740),s=r(41824),o=r(46648),a=r(31978);let i="force-dynamic";async function l(){let e=await (0,s.zn)();return(0,n.jsx)(o.default,{children:(0,n.jsx)(a.Editor,{customScenes:e})})}},46648:(e,t,r)=>{"use strict";r.d(t,{default:()=>n});let n=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/roykolak/Projects/moonclock/src/components/App.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/roykolak/Projects/moonclock/src/components/App.tsx","default")},31978:(e,t,r)=>{"use strict";r.d(t,{Editor:()=>n});let n=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call Editor() from the server but Editor is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/roykolak/Projects/moonclock/src/components/Editor.tsx","Editor")},41824:(e,t,r)=>{"use strict";r.d(t,{V8:()=>a,cR:()=>i,zn:()=>l});var n=r(88977);r(98063);var s=r(29021),o=r.n(s);async function a(){try{return o().readFileSync("./hardware/lastHeartbeat.txt").toString()}catch{return null}}async function i(){return o().readdirSync("./custom_scenes").map(e=>e.split(".")[0])}async function l(){return o().readdirSync("./custom_scenes").map(e=>{let t=e.split(".")[0],r=JSON.parse(o().readFileSync(`./custom_scenes/${t}.json`).toString());return{name:t,coordinates:r}})}(0,r(56215).D)([a,i,l]),(0,n.A)(a,"00b2b40489db12b9391a83fce66626def34a041379",null),(0,n.A)(i,"002aa21eceb7baff33c3b3104dca68851f89d867a1",null),(0,n.A)(l,"008fc986eaf43402eb796d17541d6759aa1c9a465b",null)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[281,700,801,912],()=>r(71115));module.exports=n})();