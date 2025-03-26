"use strict";exports.id=48,exports.ids=[48],exports.modules={72590:(e,l,n)=>{n.d(l,{PresetForm:()=>T});var t=n(45512),s=n(74222),a=n(89465),i=n(31824),r=n(388),o=n(19939),u=n(62148),c=n(63938),d=n(15436),m=n(45841),p=n(79234),x=n(27521),h=n(48376),j=n(15166),f=n(44914),b=n(29405),v=n(69738),g=n(15992),S=n(29571),k=n(55705),w=n(45900),M=n(99985),y=n(28500);let A={mode:"for",name:"",scenes:[{sceneName:S.eU.Moon,sceneConfig:{}}],untilMinute:"0",untilDay:"0",untilHour:"0",forTime:"0:05"};function T({preset:e=A,customSceneNames:l,action:n,submitLabel:f,title:b}){let[v,g]=(0,y.useDisclosure)(),T=(0,k.m)({initialValues:{...A,...e}});return T.watch("scenes.0.sceneName",({value:e})=>{let l="scenes.0.sceneConfig";return e===S.eU.Twinkle?T.setFieldValue(l,{color:"#ffffff",speed:50,amount:50}):e===S.eU.Ripple?T.setFieldValue(l,{color:"#ffffff",speed:5,waveHeight:6}):void T.setFieldValue(l,{})}),(0,t.jsxs)("form",{onSubmit:T.onSubmit(n),"data-testid":"preset-form",children:[b&&(0,t.jsx)(s.Title,{order:2,children:b}),(0,t.jsx)(a.Box,{w:"50%",m:"auto",mb:"md",children:(0,t.jsx)(w.K,{preset:T.values})}),(0,t.jsxs)(i.Stack,{children:[(0,t.jsx)(r.TextInput,{placeholder:"",variant:"filled",style:{flex:1},label:"Name",required:!0,"data-testid":"preset-name",...T.getInputProps(S.M8.Name)},T.key(S.M8.Name)),(0,t.jsxs)(i.Stack,{gap:"2",children:[(0,t.jsx)(o.InputLabel,{children:"Scene"}),T.getValues().scenes.map((e,n)=>(0,t.jsxs)(u.Group,{w:"100%",children:[(0,t.jsxs)(u.Group,{w:"100%",children:[(0,t.jsx)(c.Select,{placeholder:"Scene",variant:"filled",style:{flex:"auto"},data:[{group:"Built-in Scenes",items:[S.eU.Moon,S.eU.Countdown,S.eU.Twinkle,S.eU.Ripple]},{group:"Custom Scenes",items:l}],"data-testid":"scene-select",required:!0,...T.getInputProps(`scenes.${n}.sceneName`)},T.key(`scenes.${n}.sceneName`)),(0,t.jsx)(d.ActionIcon,{variant:"light",onClick:g.toggle,size:"lg",children:(0,t.jsx)(M.A,{size:22})})]}),v&&(0,t.jsx)(C,{form:T,index:n})]},n))]}),(0,t.jsx)(m.Divider,{}),(0,t.jsx)(p.SegmentedControl,{fullWidth:!0,data:[{label:"For...",value:"for"},{label:"Until...",value:"until"}],...T.getInputProps("mode")},T.key("mode")),"for"===T.values.mode&&(0,t.jsx)(c.Select,{data:[{label:"5 minutes",value:"0:05"},{label:"15 minutes",value:"0:15"},{label:"30 minutes",value:"0:30"},{label:"1 hour",value:"1:00"},{label:"1 hour 30 minutes",value:"1:30"},{label:"2 hours",value:"2:00"},{label:"Forever",value:"0:00"}],"data-testid":"for-time-select",...T.getInputProps(S.M8.ForTime)},T.key(S.M8.ForTime)),"until"===T.values.mode&&(0,t.jsxs)(x.Flex,{gap:"xs",children:[(0,t.jsx)(c.Select,{placeholder:"Hour",data:[{label:"Today",value:"0"},{label:"Tomorrow",value:"1"}],"data-testid":"until-hour-select",...T.getInputProps(S.M8.UntilDay)},T.key(S.M8.UntilDay)),(0,t.jsx)(h.Text,{children:"@"}),(0,t.jsx)(c.Select,{placeholder:"Hour",data:[{label:"5 AM",value:"5"},{label:"6 AM",value:"6"},{label:"7 AM",value:"7"},{label:"8 AM",value:"8"},{label:"9 AM",value:"9"},{label:"10 AM",value:"10"},{label:"11 AM",value:"11"},{label:"12 PM",value:"12"},{label:"1 PM",value:"13"}],"data-testid":"until-hour-select",...T.getInputProps(S.M8.UntilHour)},T.key(S.M8.UntilHour)),(0,t.jsx)(h.Text,{children:":"}),(0,t.jsx)(c.Select,{placeholder:"Minute",data:[{label:"00",value:"00"},{label:"15",value:"15"},{label:"30",value:"30"},{label:"45",value:"45"}],"data-testid":"until-minute-select",...T.getInputProps(S.M8.UntilMinute)},T.key(S.M8.UntilMinute))]}),(0,t.jsx)(m.Divider,{}),(0,t.jsx)(I,{form:T}),(0,t.jsx)(x.Flex,{mt:"xs",children:(0,t.jsx)(j.Button,{type:"submit",fullWidth:!0,children:f||"Save"})})]})]})}function C({form:e,index:l}){let{sceneName:n}=e.getValues().scenes[0];return"twinkle"===n?(0,t.jsx)(f.Card,{w:"100%",children:(0,t.jsxs)(i.Stack,{children:[(0,t.jsxs)(i.Stack,{gap:4,children:[(0,t.jsx)(h.Text,{size:"sm",children:"Twinkle Speed"}),(0,t.jsx)(b.Slider,{label:null,...e.getInputProps(`scenes.${l}.sceneConfig.speed`)},e.key(`scenes.${l}.sceneConfig.speed`))]}),(0,t.jsxs)(i.Stack,{gap:4,children:[(0,t.jsx)(h.Text,{size:"sm",children:"Twinkle Amount"}),(0,t.jsx)(b.Slider,{label:null,...e.getInputProps(`scenes.${l}.sceneConfig.amount`)},e.key(`scenes.${l}.sceneConfig.amount`))]}),(0,t.jsx)(v.ColorInput,{placeholder:"Select a twinkle color",...e.getInputProps(`scenes.${l}.sceneConfig.color`)},e.key(`scenes.${l}.sceneConfig.color`))]})}):"ripple"===n?(0,t.jsx)(f.Card,{w:"100%",children:(0,t.jsxs)(i.Stack,{children:[(0,t.jsxs)(i.Stack,{gap:4,children:[(0,t.jsx)(h.Text,{size:"sm",children:"Speed"}),(0,t.jsx)(b.Slider,{label:null,...e.getInputProps(`scenes.${l}.sceneConfig.speed`)},e.key(`scenes.${l}.sceneConfig.speed`))]}),(0,t.jsxs)(i.Stack,{gap:4,children:[(0,t.jsx)(h.Text,{size:"sm",children:"Wave height"}),(0,t.jsx)(b.Slider,{label:null,...e.getInputProps(`scenes.${l}.sceneConfig.waveHeight`)},e.key(`scenes.${l}.sceneConfig.waveHeight`))]}),(0,t.jsx)(v.ColorInput,{placeholder:"Select a twinkle color",...e.getInputProps(`scenes.${l}.sceneConfig.color`)},e.key(`scenes.${l}.sceneConfig.color`))]})}):(0,t.jsx)(f.Card,{w:"100%",children:(0,t.jsx)(h.Text,{ta:"center",size:"xs",children:"No scene options available"})})}function I({form:e}){return(0,t.jsx)(g.Accordion,{defaultValue:"Apples",variant:"filled",children:(0,t.jsxs)(g.Accordion.Item,{value:"hardware",children:[(0,t.jsx)(g.Accordion.Control,{children:(0,t.jsx)(h.Text,{size:"sm",c:"dimmed",children:"Advanced Settings"})}),(0,t.jsx)(g.Accordion.Panel,{children:(0,t.jsx)(i.Stack,{children:(0,t.jsx)(c.Select,{label:"Time adjustment interval",description:"Configure a custom time adjustment interval in the UI",placeholder:"Select...",data:[{label:"1 minute",value:"1"},{label:"5 minutes",value:"5"},{label:"10 minutes",value:"10"},{label:"20 minutes",value:"20"},{label:"30 minutes",value:"30"},{label:"1 hour",value:"60"}],"data-testid":"time-adjustment-select",...e.getInputProps(S.M8.TimeAdjustmentAmount)},e.key(S.M8.TimeAdjustmentAmount))})})]},"hardware")})}},29571:(e,l,n)=>{n.d(l,{M8:()=>s,TS:()=>t,eU:()=>a});var t=function(e){return e.Name="name",e.TimeAdjustmentAmount="timeAdjustmentAmount",e.Brightness="brightness",e.PwnLsbNanoseconds="pwnLsbNanoseconds",e.GpioSlowdown="gpioSlowdown",e.PwmBits="pwmBits",e}({}),s=function(e){return e.Name="name",e.Scenes="scenes",e.Mode="mode",e.UntilDay="untilDay",e.UntilHour="untilHour",e.UntilMinute="untilMinute",e.ForTime="forTime",e.TimeAdjustmentAmount="timeAdjustmentAmount",e}({}),a=function(e){return e.Blank="blank",e.Moon="moon",e.Countdown="countdown",e.Twinkle="twinkle",e.Ripple="ripple",e}({})},77707:(e,l,n)=>{n.d(l,{cR:()=>o,zn:()=>u,V8:()=>r});var t=n(88977);n(98063);var s=n(29021),a=n.n(s);function i(){return"./custom_scenes"}async function r(){try{return a().readFileSync("./hardware/lastHeartbeat.txt").toString()}catch{return null}}async function o(){return i(),a().readdirSync(i()).map(e=>e.split(".")[0])}async function u(){return i(),a().readdirSync(i()).map(e=>{let l=e.split(".")[0],n=JSON.parse(a().readFileSync(`${i()}/${l}.json`).toString());return{name:l,coordinates:n}})}n(79646),(0,n(56215).D)([r,o,u]),(0,t.A)(r,"00b2b40489db12b9391a83fce66626def34a041379",null),(0,t.A)(o,"002aa21eceb7baff33c3b3104dca68851f89d867a1",null),(0,t.A)(u,"008fc986eaf43402eb796d17541d6759aa1c9a465b",null)}};