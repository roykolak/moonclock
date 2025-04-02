(()=>{var e={};e.id=662,e.ids=[662],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79646:e=>{"use strict";e.exports=require("child_process")},29021:e=>{"use strict";e.exports=require("fs")},33873:e=>{"use strict";e.exports=require("path")},45913:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>d,routeModule:()=>m,tree:()=>c});var s=n(70260),r=n(28203),o=n(25155),i=n.n(o),a=n(67292),l={};for(let e in a)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);n.d(t,l);let c=["",{children:["settings",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(n.bind(n,56153)),"/Users/roykolak/Projects/moonclock/src/app/settings/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(n.bind(n,71354)),"/Users/roykolak/Projects/moonclock/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(n.t.bind(n,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(n.t.bind(n,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(n.t.bind(n,41485,23)),"next/dist/client/components/unauthorized-error"]}],d=["/Users/roykolak/Projects/moonclock/src/app/settings/page.tsx"],u={require:n,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/settings/page",pathname:"/settings",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},59456:(e,t,n)=>{"use strict";n.r(t),n.d(t,{"40a013e540cf35b66699f950460cd47299756f0a4e":()=>d});var s=n(21590);n(70376);var r=n(47735),o=n(63601),i=n(84384),a=n(68726),l=n(99344);let c=[i.TS.Brightness,i.TS.GpioSlowdown,i.TS.PwnLsbNanoseconds,i.TS.PwmBits];async function d(e){let{panel:t}=(0,o.bQ)();(0,o.XO)({panel:{...e,updatedAt:new Date().toJSON()}}),(0,r.revalidatePath)("/panel"),c.some(n=>e[n]!==t[n])&&(0,a.yY)()}(0,l.D)([d]),(0,s.A)(d,"40a013e540cf35b66699f950460cd47299756f0a4e",null)},3191:(e,t,n)=>{"use strict";n.r(t),n.d(t,{"003cea0d5ad419b7db89820aea65799cf884b0983f":()=>s.V8,"00778c6ed4a46b3cc6deb54d95f46a80fe20e8653b":()=>s.zn,"007c97be3c926b2f0462d6d909c13ece0073520f76":()=>s.cR});var s=n(41824)},44463:(e,t,n)=>{Promise.resolve().then(n.bind(n,46648)),Promise.resolve().then(n.bind(n,24062))},27591:(e,t,n)=>{Promise.resolve().then(n.bind(n,56572)),Promise.resolve().then(n.bind(n,96444))},56572:(e,t,n)=>{"use strict";n.d(t,{default:()=>v});var s=n(45512),r=n(40528),o=n(62148),i=n(78954),a=n(48376),l=n(23726),c=n(15436),d=n(52669),u=n(28500),m=n(11526),p=n(33563),f=n(36857),h=n(81346),g=n(45869),x=n(28531),b=n.n(x),S=n(79334),j=n(71709);let v=function({children:e}){let[t,{toggle:n}]=(0,u.useDisclosure)(),x=(0,S.usePathname)();return(0,s.jsxs)(r.AppShell,{header:{height:60},navbar:{width:300,breakpoint:"sm",collapsed:{mobile:!t}},padding:"md",children:[(0,s.jsx)(r.AppShell.Header,{children:(0,s.jsxs)(o.Group,{align:"center",h:"100%",px:"md",children:[(0,s.jsx)(i.Burger,{opened:t,onClick:n,hiddenFrom:"sm",size:"sm","data-testid":"app-menu"}),(0,s.jsx)(a.Text,{flex:1,children:"Moon Clock"})]})}),(0,s.jsxs)(r.AppShell.Navbar,{p:"md",children:[(0,s.jsx)(l.NavLink,{component:b(),href:"/",label:"Panel",active:x.includes("/panel"),leftSection:(0,s.jsx)(c.ActionIcon,{variant:"light",children:(0,s.jsx)(m.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,s.jsx)(l.NavLink,{component:b(),href:"/presets",label:"Presets","data-testid":"nav-presets",active:x.includes("/presets"),leftSection:(0,s.jsx)(c.ActionIcon,{variant:"light",children:(0,s.jsx)(p.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,s.jsx)(l.NavLink,{component:b(),href:"/composer",label:"Composer",active:x.includes("/composer"),leftSection:(0,s.jsx)(c.ActionIcon,{variant:"light",children:(0,s.jsx)(f.A,{style:{width:"70%",height:"70%"},stroke:1.5})})}),(0,s.jsx)(l.NavLink,{component:b(),href:"/settings",label:"Settings",active:x.includes("/settings"),leftSection:(0,s.jsx)(c.ActionIcon,{variant:"light",children:(0,s.jsx)(h.A,{style:{width:"70%",height:"70%"},stroke:1.5})})})]}),(0,s.jsx)(r.AppShell.Main,{children:(0,s.jsx)(j.tH,{fallbackRender:({error:e})=>(console.log(e.stack),(0,s.jsx)(d.Alert,{title:"There was a problem!",color:"red",icon:(0,s.jsx)(g.A,{}),children:e.message})),children:e})})]})}},96444:(e,t,n)=>{"use strict";n.d(t,{Settings:()=>S});var s=n(45512),r=n(26248);let o=(0,r.createServerReference)("40a013e540cf35b66699f950460cd47299756f0a4e",r.callServer,void 0,r.findSourceMapURL,"updatePanel");var i=n(29571),a=n(74222),l=n(31824),c=n(388),d=n(63938),u=n(62148),m=n(45841),p=n(48376),f=n(29405),h=n(15992),g=n(15166),x=n(55705),b=n(99553);function S({panel:e,customSceneNames:t}){let n=(0,x.m)({initialValues:{...e}});return(0,s.jsxs)("form",{onSubmit:n.onSubmit(e=>{o(e),(0,b.showNotification)({message:"Successfully updated settings!"})}),"data-testid":"preset-form",children:[(0,s.jsx)(a.Title,{order:2,mb:"md",children:"Panel Settings"}),(0,s.jsxs)(l.Stack,{children:[(0,s.jsx)(c.TextInput,{placeholder:"",variant:"filled",style:{flex:1},label:"Name",required:!0,"data-testid":"panel-name-input",...n.getInputProps(i.TS.Name)},n.key(i.TS.Name)),(0,s.jsx)(d.Select,{placeholder:"Time increment",variant:"filled",style:{flex:1},label:"Time increment",description:"Adjust +/- controls for time amounts",data:[{label:"1 minute",value:"1"},{label:"5 minutes",value:"5"},{label:"10 minutes",value:"10"},{label:"20 minutes",value:"20"},{label:"30 minutes",value:"30"},{label:"1 hour",value:"60"}],"data-testid":"time-adjustment-select",required:!0,...n.getInputProps(i.TS.TimeAdjustmentAmount)},n.key(i.TS.TimeAdjustmentAmount)),n.getValues().defaultPreset.scenes.map((e,r)=>(0,s.jsx)(u.Group,{w:"100%",children:(0,s.jsx)(d.Select,{placeholder:"Scene",variant:"filled",style:{flex:1},label:"Default Scene",description:"What will be shown when nothing is active",data:[{group:"Built-in Scenes",items:[i.eU.Blank,i.eU.Moon,i.eU.Countdown,i.eU.Twinkle]},{group:"Custom Scenes",items:t}],"data-testid":"default-scene-select",required:!0,...n.getInputProps(`defaultPreset.scenes.${r}.sceneName`)},n.key(`defaultPreset.scenes.${r}.sceneName`))},r)),(0,s.jsx)(m.Divider,{}),(0,s.jsx)(a.Title,{order:5,mt:"md",children:"Hardware Settings"}),(0,s.jsxs)(l.Stack,{gap:4,children:[(0,s.jsx)(p.Text,{size:"sm",children:"Display Brightness"}),(0,s.jsx)(f.Slider,{label:null,...n.getInputProps(i.TS.Brightness)},n.key(i.TS.Brightness))]}),(0,s.jsx)(h.Accordion,{variant:"separated",mt:"md",children:(0,s.jsxs)(h.Accordion.Item,{value:"advanced",children:[(0,s.jsx)(h.Accordion.Control,{children:(0,s.jsx)(p.Text,{size:"sm",c:"dimmed",children:"Advanced Settings"})}),(0,s.jsx)(h.Accordion.Panel,{children:(0,s.jsxs)(l.Stack,{gap:"lg",children:[(0,s.jsxs)(l.Stack,{gap:4,children:[(0,s.jsxs)(l.Stack,{gap:0,children:[(0,s.jsx)(p.Text,{size:"sm",children:"LED PWN LSB nanoseconds"}),(0,s.jsx)(p.Text,{c:"dimmed",size:"xs",children:"Higher values will provide better image quality (more accurate color, less ghosting) at the expense of frame rate."})]}),(0,s.jsx)(f.Slider,{max:1e3,...n.getInputProps(i.TS.PwnLsbNanoseconds)},n.key(i.TS.PwnLsbNanoseconds))]}),(0,s.jsxs)(l.Stack,{gap:4,children:[(0,s.jsxs)(l.Stack,{gap:0,children:[(0,s.jsx)(p.Text,{size:"sm",children:"GPIO Slowdown"}),(0,s.jsx)(p.Text,{c:"dimmed",size:"xs",children:"If you have a Raspberry Pi with a slower processor (Model A, A+, B+, Zero), then a value of 0 (zero) might work and is desirable. A Raspberry Pi 3 or Pi4 might even need higher values for the panels to be."})]}),(0,s.jsx)(f.Slider,{max:4,min:0,...n.getInputProps(i.TS.GpioSlowdown)},n.key(i.TS.GpioSlowdown))]}),(0,s.jsxs)(l.Stack,{gap:4,children:[(0,s.jsxs)(l.Stack,{gap:0,children:[(0,s.jsx)(p.Text,{size:"sm",children:"PWN Bits"}),(0,s.jsx)(p.Text,{c:"dimmed",size:"xs",children:"Lower values will increase performance at the expense of color precision."})]}),(0,s.jsx)(f.Slider,{max:11,min:1,...n.getInputProps(i.TS.PwmBits)},n.key(i.TS.PwmBits))]})]})})]},"hardware")}),(0,s.jsx)(g.Button,{type:"submit",fullWidth:!0,mt:"md",children:"Save"})]})]})}},29571:(e,t,n)=>{"use strict";n.d(t,{M8:()=>r,TS:()=>s,eU:()=>o});var s=function(e){return e.Name="name",e.TimeAdjustmentAmount="timeAdjustmentAmount",e.Brightness="brightness",e.PwnLsbNanoseconds="pwnLsbNanoseconds",e.GpioSlowdown="gpioSlowdown",e.PwmBits="pwmBits",e}({}),r=function(e){return e.Name="name",e.Scenes="scenes",e.Mode="mode",e.UntilDay="untilDay",e.UntilHour="untilHour",e.UntilMinute="untilMinute",e.ForTime="forTime",e.TimeAdjustmentAmount="timeAdjustmentAmount",e}({}),o=function(e){return e.Blank="blank",e.Moon="moon",e.Countdown="countdown",e.Twinkle="twinkle",e.Ripple="ripple",e.Marquee="marquee",e.Emoji="emoji",e}({})},56153:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>c,dynamic:()=>l});var s=n(62740),r=n(46648),o=n(24062),i=n(20304),a=n(41824);let l="force-dynamic";async function c(){let{panel:e}=await (0,i.bQ)(),t=await (0,a.cR)();return(0,s.jsx)(r.default,{children:(0,s.jsx)(o.Settings,{panel:e,customSceneNames:t})})}},46648:(e,t,n)=>{"use strict";n.d(t,{default:()=>s});let s=(0,n(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/roykolak/Projects/moonclock/src/components/App.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/roykolak/Projects/moonclock/src/components/App.tsx","default")},24062:(e,t,n)=>{"use strict";n.d(t,{Settings:()=>s});let s=(0,n(46760).registerClientReference)(function(){throw Error("Attempted to call Settings() from the server but Settings is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/roykolak/Projects/moonclock/src/components/Settings.tsx","Settings")},63601:(e,t,n)=>{"use strict";n.d(t,{XO:()=>m,bQ:()=>u});var s=n(29021),r=n.n(s),o=n(84384),i=n(68726);let a={name:"Default",scenes:[{sceneName:o.eU.Blank,sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"00",forTime:"0:00"},l={panel:{name:"My Moonclock",timeAdjustmentAmount:"5",defaultPreset:a,brightness:30,pwnLsbNanoseconds:130,gpioSlowdown:4,pwmBits:11},scheduledPreset:{preset:null,endTime:null},hardware:{preset:a},presets:[{name:"Sleep Mode",scenes:[{sceneName:o.eU.Moon,sceneConfig:{}}],mode:"until",untilDay:"1",untilHour:"7",untilMinute:"00",forTime:""},{name:"Nap Mode",scenes:[{sceneName:"bunny",sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"0",forTime:"2:00"},{name:"Timeout",scenes:[{sceneName:o.eU.Countdown,sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"0",forTime:"0:05"}]};function c(){return"test"===process.env.APP_ENV?"./database-test.json":(0,i.G3)()}function d(){let e=c();try{let t=r().readFileSync(e).toString();return JSON.parse(t)}catch{return console.log(`trouble loading ${e}, loading default data`),JSON.parse(JSON.stringify(l))}}function u(){return d()}function m(e){var t;t={...d(),...e},r().writeFileSync(c(),JSON.stringify(t,null,2),{mode:510})}},20304:(e,t,n)=>{"use strict";n.d(t,{bQ:()=>u,XO:()=>m});var s=n(29021),r=n.n(s),o=function(e){return e.Blank="blank",e.Moon="moon",e.Countdown="countdown",e.Twinkle="twinkle",e.Ripple="ripple",e.Marquee="marquee",e.Emoji="emoji",e}({}),i=n(28081);let a={name:"Default",scenes:[{sceneName:o.Blank,sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"00",forTime:"0:00"},l={panel:{name:"My Moonclock",timeAdjustmentAmount:"5",defaultPreset:a,brightness:30,pwnLsbNanoseconds:130,gpioSlowdown:4,pwmBits:11},scheduledPreset:{preset:null,endTime:null},hardware:{preset:a},presets:[{name:"Sleep Mode",scenes:[{sceneName:o.Moon,sceneConfig:{}}],mode:"until",untilDay:"1",untilHour:"7",untilMinute:"00",forTime:""},{name:"Nap Mode",scenes:[{sceneName:"bunny",sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"0",forTime:"2:00"},{name:"Timeout",scenes:[{sceneName:o.Countdown,sceneConfig:{}}],mode:"for",untilDay:"0",untilHour:"0",untilMinute:"0",forTime:"0:05"}]};function c(){return"test"===process.env.APP_ENV?"./database-test.json":(0,i.G3)()}function d(){let e=c();try{let t=r().readFileSync(e).toString();return JSON.parse(t)}catch{return console.log(`trouble loading ${e}, loading default data`),JSON.parse(JSON.stringify(l))}}function u(){return d()}function m(e){var t;t={...d(),...e},r().writeFileSync(c(),JSON.stringify(t,null,2),{mode:510})}},41824:(e,t,n)=>{"use strict";n.d(t,{V8:()=>a,cR:()=>l,zn:()=>c});var s=n(88977);n(98063);var r=n(29021),o=n.n(r),i=n(28081);async function a(){try{return o().readFileSync((0,i.rV)()).toString()}catch{return null}}async function l(){return o().readdirSync((0,i.gx)()).map(e=>e.split(".")[0])}async function c(){return o().readdirSync((0,i.gx)()).map(e=>{let t=e.split(".")[0],n=JSON.parse(o().readFileSync(`${(0,i.gx)()}/${t}.json`).toString());return{name:t,coordinates:n}})}(0,n(56215).D)([a,l,c]),(0,s.A)(a,"003cea0d5ad419b7db89820aea65799cf884b0983f",null),(0,s.A)(l,"007c97be3c926b2f0462d6d909c13ece0073520f76",null),(0,s.A)(c,"00778c6ed4a46b3cc6deb54d95f46a80fe20e8653b",null)},68726:(e,t,n)=>{"use strict";n.d(t,{G3:()=>a,gx:()=>o,rV:()=>i,yY:()=>r});var s=n(79646);function r(){console.log("[APP] Triggering hardware restart"),(0,s.exec)("systemctl restart moonclock-hardware")}function o(){return"/var/lib/moonclock/custom_scenes"}function i(){return"/var/lib/moonclock/lastHeartbeat.txt"}function a(){return"/var/lib/moonclock/database.json"}},28081:(e,t,n)=>{"use strict";function s(){return"/var/lib/moonclock/custom_scenes"}function r(){return"/var/lib/moonclock/lastHeartbeat.txt"}function o(){return"/var/lib/moonclock/database.json"}n.d(t,{G3:()=>o,gx:()=>s,rV:()=>r}),n(79646)},84384:(e,t,n)=>{"use strict";n.d(t,{TS:()=>s,eU:()=>r});var s=function(e){return e.Name="name",e.TimeAdjustmentAmount="timeAdjustmentAmount",e.Brightness="brightness",e.PwnLsbNanoseconds="pwnLsbNanoseconds",e.GpioSlowdown="gpioSlowdown",e.PwmBits="pwmBits",e}({}),r=function(e){return e.Blank="blank",e.Moon="moon",e.Countdown="countdown",e.Twinkle="twinkle",e.Ripple="ripple",e.Marquee="marquee",e.Emoji="emoji",e}({})}};var t=require("../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),s=t.X(0,[281,700,801,735,912],()=>n(45913));module.exports=s})();