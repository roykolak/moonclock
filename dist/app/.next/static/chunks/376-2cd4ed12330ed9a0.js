(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[376],{4553:(e,n,t)=>{t(436),n.Nw=function(e,n){return Object.assign(document.createElement("canvas"),{width:e,height:n})},n.yt=function(e,n){return new Promise(function(t,s){let l=Object.assign(document.createElement("img"),n);function a(){l.onload=null,l.onerror=null}l.onload=function(){a(),t(l)},l.onerror=function(){a(),s(Error('Failed to load the image "'+e+'"'))},l.src=e})}},436:e=>{"use strict";let n="'([^']+)'|\"([^\"]+)\"|[\\w\\s-]+",t=RegExp("(bold|bolder|lighter|[1-9]00) +","i"),s=RegExp("(italic|oblique) +","i"),l=RegExp("(small-caps) +","i"),a=RegExp("(ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded) +","i"),c=RegExp(`([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q) *((?:${n})( *, *(?:${n}))*)`),i={};e.exports=e=>{let n,o,r,u;if(i[e])return i[e];let d=c.exec(e);if(!d)return;let m={weight:"normal",style:"normal",stretch:"normal",variant:"normal",size:parseFloat(d[1]),unit:d[2],family:d[3].replace(/["']/g,"").replace(/ *, */g,",")},p=e.substring(0,d.index);switch((n=t.exec(p))&&(m.weight=n[1]),(o=s.exec(p))&&(m.style=o[1]),(r=l.exec(p))&&(m.variant=r[1]),(u=a.exec(p))&&(m.stretch=u[1]),m.unit){case"pt":m.size/=.75;break;case"pc":m.size*=16;break;case"in":m.size*=96;break;case"cm":m.size*=96/2.54;break;case"mm":m.size*=96/25.4;break;case"%":break;case"em":case"rem":m.size*=16/.75;break;case"q":m.size*=96/25.4/4}return i[e]=m}},34200:(e,n,t)=>{"use strict";t.d(n,{PresetForm:()=>N});var s=t(95155),l=t(77691),a=t(51743),c=t(61650),i=t(55866),o=t(37429),r=t(28708),u=t(17167),d=t(61083),m=t(77052),p=t(92291),x=t(19371),g=t(58830),h=t(72750),f=t(51044),j=t(40857),v=t(82202),b=t(66327),k=t(36886),S=t(16067),w=t(48366),C=t(3091),M=t(30775),y=(0,M.A)("outline","settings","IconSettings",[["path",{d:"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z",key:"svg-0"}],["path",{d:"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",key:"svg-1"}]]),I=(0,M.A)("outline","trash","IconTrash",[["path",{d:"M4 7l16 0",key:"svg-0"}],["path",{d:"M10 11l0 6",key:"svg-1"}],["path",{d:"M14 11l0 6",key:"svg-2"}],["path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",key:"svg-3"}],["path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",key:"svg-4"}]]),T=t(95786),A=t(21263),z=t(12115),P=t(84061);function U(e){let n=(0,z.useRef)(null),t=(0,z.useRef)(null);return t.current&&t.current.update(e),(0,z.useEffect)(()=>(t.current=new P.LC({...e,ref:n}),()=>{t.current=null}),[]),z.createElement("div",{ref:n})}let F={mode:"for",name:"",scenes:[{sceneName:S.eU.Moon,sceneConfig:{}}],untilMinute:"0",untilDay:"0",untilHour:"0",forTime:"0:05"};function N(e){let{preset:n=F,customSceneNames:t,action:g,submitLabel:h,title:f}=e,j=(0,w.m)({initialValues:{...F,...n}});return j.watch("scenes.0.sceneName",e=>{let{value:n}=e,t="scenes.0.sceneConfig";return n===S.eU.Twinkle?j.setFieldValue(t,{color:"#ffffff",speed:50,amount:50}):n===S.eU.Ripple?j.setFieldValue(t,{color:"#ffffff",speed:5,waveHeight:6}):n===S.eU.Marquee?j.setFieldValue(t,{color:"#ffffff",speed:50,fontSize:16,text:"hello"}):n===S.eU.Emoji?j.setFieldValue(t,{emoji:"\uD83D\uDE01"}):void j.setFieldValue(t,{})}),(0,s.jsxs)("form",{onSubmit:j.onSubmit(g),"data-testid":"preset-form",children:[f&&(0,s.jsx)(l.Title,{order:2,children:f}),(0,s.jsx)(a.Box,{w:"50%",m:"auto",mb:"md",children:(0,s.jsx)(C.K,{preset:j.values})}),(0,s.jsxs)(c.Stack,{children:[(0,s.jsx)(i.TextInput,{placeholder:"",variant:"filled",style:{flex:1},label:"Name",required:!0,"data-testid":"preset-name",...j.getInputProps(S.M8.Name)},j.key(S.M8.Name)),(0,s.jsxs)(c.Stack,{gap:"2",children:[(0,s.jsx)(o.InputLabel,{children:"Scene"}),j.getValues().scenes.map((e,n)=>(0,s.jsx)(E,{form:j,index:n,customSceneNames:t},n)),(0,s.jsx)(r.Button,{variant:"light","data-testid":"new-scene-button",onClick:()=>j.insertListItem("scenes",{sceneName:S.eU.Moon,sceneConfig:{}}),children:"Add new scene"})]}),(0,s.jsx)(u.Divider,{}),(0,s.jsx)(d.SegmentedControl,{fullWidth:!0,data:[{label:"For...",value:"for"},{label:"Until...",value:"until"}],...j.getInputProps("mode")},j.key("mode")),"for"===j.values.mode&&(0,s.jsx)(m.Select,{data:[{label:"5 minutes",value:"0:05"},{label:"15 minutes",value:"0:15"},{label:"30 minutes",value:"0:30"},{label:"1 hour",value:"1:00"},{label:"1 hour 30 minutes",value:"1:30"},{label:"2 hours",value:"2:00"},{label:"Forever",value:"0:00"}],"data-testid":"for-time-select",...j.getInputProps(S.M8.ForTime)},j.key(S.M8.ForTime)),"until"===j.values.mode&&(0,s.jsxs)(p.Flex,{gap:"xs",children:[(0,s.jsx)(m.Select,{placeholder:"Hour",data:[{label:"Today",value:"0"},{label:"Tomorrow",value:"1"}],"data-testid":"until-hour-select",...j.getInputProps(S.M8.UntilDay)},j.key(S.M8.UntilDay)),(0,s.jsx)(x.Text,{children:"@"}),(0,s.jsx)(m.Select,{placeholder:"Hour",data:[{label:"5 AM",value:"5"},{label:"6 AM",value:"6"},{label:"7 AM",value:"7"},{label:"8 AM",value:"8"},{label:"9 AM",value:"9"},{label:"10 AM",value:"10"},{label:"11 AM",value:"11"},{label:"12 PM",value:"12"},{label:"1 PM",value:"13"}],"data-testid":"until-hour-select",...j.getInputProps(S.M8.UntilHour)},j.key(S.M8.UntilHour)),(0,s.jsx)(x.Text,{children:":"}),(0,s.jsx)(m.Select,{placeholder:"Minute",data:[{label:"00",value:"00"},{label:"15",value:"15"},{label:"30",value:"30"},{label:"45",value:"45"}],"data-testid":"until-minute-select",...j.getInputProps(S.M8.UntilMinute)},j.key(S.M8.UntilMinute))]}),(0,s.jsx)(u.Divider,{}),(0,s.jsx)(H,{form:j}),(0,s.jsx)(p.Flex,{mt:"xs",children:(0,s.jsx)(r.Button,{type:"submit",fullWidth:!0,children:h||"Save"})})]})]})}function E(e){let{form:n,index:t,customSceneNames:l}=e,[a,c]=(0,T.useDisclosure)();return(0,s.jsxs)(g.Group,{w:"100%",mb:"xs",children:[(0,s.jsxs)(g.Group,{w:"100%",gap:"6",children:[(0,s.jsx)(m.Select,{placeholder:"Scene",variant:"filled",style:{flex:"auto"},data:[{group:"Built-in Scenes",items:[S.eU.Moon,S.eU.Countdown,S.eU.Twinkle,S.eU.Ripple,S.eU.Marquee,S.eU.Emoji]},{group:"Custom Scenes",items:l}],"data-testid":"scene-".concat(t,"-select"),required:!0,...n.getInputProps("scenes.".concat(t,".sceneName"))},n.key("scenes.".concat(t,".sceneName"))),(0,s.jsx)(h.ActionIcon,{variant:"light","data-testid":"scene-".concat(t,"-settings-button"),onClick:c.toggle,size:"lg",children:(0,s.jsx)(y,{size:22})}),(0,s.jsx)(h.ActionIcon,{color:"red",variant:"light",size:"lg","data-testid":"scene-".concat(t,"-delete-button"),onClick:()=>n.removeListItem("scenes",t),children:(0,s.jsx)(I,{size:16})})]}),a&&(0,s.jsx)(R,{form:n,index:t})]},t)}function R(e){let{form:n,index:t}=e,{sceneName:l}=n.getValues().scenes[t];return"emoji"===l?(0,s.jsx)(U,{data:A,previewPosition:"none",navPosition:"none",maxFrequentRows:"1",onEmojiSelect:e=>{n.setFieldValue("scenes.".concat(t,".sceneConfig.emoji"),e.native)}}):"twinkle"===l?(0,s.jsx)(f.Card,{w:"100%",children:(0,s.jsxs)(c.Stack,{children:[(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Twinkle Speed"}),(0,s.jsx)(j.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.speed"))},n.key("scenes.".concat(t,".sceneConfig.speed")))]}),(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Twinkle Amount"}),(0,s.jsx)(j.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.amount"))},n.key("scenes.".concat(t,".sceneConfig.amount")))]}),(0,s.jsx)(v.ColorInput,{placeholder:"Select a twinkle color",...n.getInputProps("scenes.".concat(t,".sceneConfig.color"))},n.key("scenes.".concat(t,".sceneConfig.color")))]})}):"ripple"===l?(0,s.jsx)(f.Card,{w:"100%",children:(0,s.jsxs)(c.Stack,{children:[(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Speed"}),(0,s.jsx)(j.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.speed"))},n.key("scenes.".concat(t,".sceneConfig.speed")))]}),(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Wave height"}),(0,s.jsx)(j.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.waveHeight"))},n.key("scenes.".concat(t,".sceneConfig.waveHeight")))]}),(0,s.jsx)(v.ColorInput,{placeholder:"Select a twinkle color",...n.getInputProps("scenes.".concat(t,".sceneConfig.color"))},n.key("scenes.".concat(t,".sceneConfig.color")))]})}):"marquee"===l?(0,s.jsx)(f.Card,{w:"100%",children:(0,s.jsxs)(c.Stack,{children:[(0,s.jsx)(i.TextInput,{label:"Message",...n.getInputProps("scenes.".concat(t,".sceneConfig.text"))},n.key("scenes.".concat(t,".sceneConfig.text"))),(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Font size"}),(0,s.jsx)(j.Slider,{min:12,max:60,...n.getInputProps("scenes.".concat(t,".sceneConfig.fontSize"))},n.key("scenes.".concat(t,".sceneConfig.fontSize")))]}),(0,s.jsx)(b.Checkbox,{label:"Mirror horizontally",...n.getInputProps("scenes.".concat(t,".sceneConfig.mirrorHorizontally"))},n.key("scenes.".concat(t,".sceneConfig.mirrorHorizontally"))),(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Speed"}),(0,s.jsx)(j.Slider,{...n.getInputProps("scenes.".concat(t,".sceneConfig.speed"))},n.key("scenes.".concat(t,".sceneConfig.speed")))]}),(0,s.jsxs)(c.Stack,{gap:4,children:[(0,s.jsx)(x.Text,{size:"sm",children:"Starting row"}),(0,s.jsx)(j.Slider,{max:32,...n.getInputProps("scenes.".concat(t,".sceneConfig.startingRow"))},n.key("scenes.".concat(t,".sceneConfig.startingRow")))]}),(0,s.jsx)(v.ColorInput,{placeholder:"Select a twinkle color",...n.getInputProps("scenes.".concat(t,".sceneConfig.color"))},n.key("scenes.".concat(t,".sceneConfig.color")))]})}):(0,s.jsx)(f.Card,{w:"100%",children:(0,s.jsx)(x.Text,{ta:"center",size:"xs",children:"No scene options available"})})}function H(e){let{form:n}=e;return(0,s.jsx)(k.Accordion,{defaultValue:"Apples",variant:"filled",children:(0,s.jsxs)(k.Accordion.Item,{value:"hardware",children:[(0,s.jsx)(k.Accordion.Control,{children:(0,s.jsx)(x.Text,{size:"sm",c:"dimmed",children:"Advanced Settings"})}),(0,s.jsx)(k.Accordion.Panel,{children:(0,s.jsx)(c.Stack,{children:(0,s.jsx)(m.Select,{label:"Time adjustment interval",description:"Configure a custom time adjustment interval in the UI",placeholder:"Select...",data:[{label:"1 minute",value:"1"},{label:"5 minutes",value:"5"},{label:"10 minutes",value:"10"},{label:"20 minutes",value:"20"},{label:"30 minutes",value:"30"},{label:"1 hour",value:"60"}],"data-testid":"time-adjustment-select",...n.getInputProps(S.M8.TimeAdjustmentAmount)},n.key(S.M8.TimeAdjustmentAmount))})})]},"hardware")})}},16067:(e,n,t)=>{"use strict";t.d(n,{M8:()=>l,TS:()=>s,eU:()=>a});var s=function(e){return e.Name="name",e.TimeAdjustmentAmount="timeAdjustmentAmount",e.Brightness="brightness",e.PwnLsbNanoseconds="pwnLsbNanoseconds",e.GpioSlowdown="gpioSlowdown",e.PwmBits="pwmBits",e}({}),l=function(e){return e.Name="name",e.Scenes="scenes",e.Mode="mode",e.UntilDay="untilDay",e.UntilHour="untilHour",e.UntilMinute="untilMinute",e.ForTime="forTime",e.TimeAdjustmentAmount="timeAdjustmentAmount",e}({}),a=function(e){return e.Blank="blank",e.Moon="moon",e.Countdown="countdown",e.Twinkle="twinkle",e.Ripple="ripple",e.Marquee="marquee",e.Emoji="emoji",e}({})}}]);