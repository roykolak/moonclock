(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[386],{4553:(e,n,t)=>{t(436),n.Nw=function(e,n){return Object.assign(document.createElement("canvas"),{width:e,height:n})},n.yt=function(e,n){return new Promise(function(t,l){let s=Object.assign(document.createElement("img"),n);function a(){s.onload=null,s.onerror=null}s.onload=function(){a(),t(s)},s.onerror=function(){a(),l(Error('Failed to load the image "'+e+'"'))},s.src=e})}},436:e=>{"use strict";let n="'([^']+)'|\"([^\"]+)\"|[\\w\\s-]+",t=RegExp("(bold|bolder|lighter|[1-9]00) +","i"),l=RegExp("(italic|oblique) +","i"),s=RegExp("(small-caps) +","i"),a=RegExp("(ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded) +","i"),i=RegExp(`([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q) *((?:${n})( *, *(?:${n}))*)`),c={};e.exports=e=>{let n,o,r,u;if(c[e])return c[e];let d=i.exec(e);if(!d)return;let m={weight:"normal",style:"normal",stretch:"normal",variant:"normal",size:parseFloat(d[1]),unit:d[2],family:d[3].replace(/["']/g,"").replace(/ *, */g,",")},p=e.substring(0,d.index);switch((n=t.exec(p))&&(m.weight=n[1]),(o=l.exec(p))&&(m.style=o[1]),(r=s.exec(p))&&(m.variant=r[1]),(u=a.exec(p))&&(m.stretch=u[1]),m.unit){case"pt":m.size/=.75;break;case"pc":m.size*=16;break;case"in":m.size*=96;break;case"cm":m.size*=96/2.54;break;case"mm":m.size*=96/25.4;break;case"%":break;case"em":case"rem":m.size*=16/.75;break;case"q":m.size*=96/25.4/4}return c[e]=m}},96514:(e,n,t)=>{"use strict";t.d(n,{PresetForm:()=>C});var l=t(95155),s=t(77691),a=t(51743),i=t(61650),c=t(55866),o=t(37429),r=t(58830),u=t(77052),d=t(72750),m=t(17167),p=t(61083),x=t(92291),h=t(19371),g=t(28708),j=t(51044),f=t(40857),b=t(82202),v=t(36886),k=t(16067),w=t(48366),S=t(85407),M=(0,t(30775).A)("outline","settings","IconSettings",[["path",{d:"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z",key:"svg-0"}],["path",{d:"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0",key:"svg-1"}]]),y=t(95786);let A={mode:"for",name:"",scenes:[{sceneName:k.eU.Moon,sceneConfig:{}}],untilMinute:"0",untilDay:"0",untilHour:"0",forTime:"0:05"};function C(e){let{preset:n=A,customSceneNames:t,action:j,submitLabel:f,title:b}=e,[v,C]=(0,y.useDisclosure)(),P=(0,w.m)({initialValues:{...A,...n}});return P.watch("scenes.0.sceneName",e=>{let{value:n}=e,t="scenes.0.sceneConfig";return n===k.eU.Twinkle?P.setFieldValue(t,{color:"#ffffff",speed:50,amount:50}):n===k.eU.Ripple?P.setFieldValue(t,{color:"#ffffff",speed:5,waveHeight:6}):void P.setFieldValue(t,{})}),(0,l.jsxs)("form",{onSubmit:P.onSubmit(j),"data-testid":"preset-form",children:[b&&(0,l.jsx)(s.Title,{order:2,children:b}),(0,l.jsx)(a.Box,{w:"50%",m:"auto",mb:"md",children:(0,l.jsx)(S.K,{preset:P.values})}),(0,l.jsxs)(i.Stack,{children:[(0,l.jsx)(c.TextInput,{placeholder:"",variant:"filled",style:{flex:1},label:"Name",required:!0,"data-testid":"preset-name",...P.getInputProps(k.M8.Name)},P.key(k.M8.Name)),(0,l.jsxs)(i.Stack,{gap:"2",children:[(0,l.jsx)(o.InputLabel,{children:"Scene"}),P.getValues().scenes.map((e,n)=>(0,l.jsxs)(r.Group,{w:"100%",children:[(0,l.jsxs)(r.Group,{w:"100%",children:[(0,l.jsx)(u.Select,{placeholder:"Scene",variant:"filled",style:{flex:"auto"},data:[{group:"Built-in Scenes",items:[k.eU.Moon,k.eU.Countdown,k.eU.Twinkle,k.eU.Ripple]},{group:"Custom Scenes",items:t}],"data-testid":"scene-select",required:!0,...P.getInputProps("scenes.".concat(n,".sceneName"))},P.key("scenes.".concat(n,".sceneName"))),(0,l.jsx)(d.ActionIcon,{variant:"light",onClick:C.toggle,size:"lg",children:(0,l.jsx)(M,{size:22})})]}),v&&(0,l.jsx)(T,{form:P,index:n})]},n))]}),(0,l.jsx)(m.Divider,{}),(0,l.jsx)(p.SegmentedControl,{fullWidth:!0,data:[{label:"For...",value:"for"},{label:"Until...",value:"until"}],...P.getInputProps("mode")},P.key("mode")),"for"===P.values.mode&&(0,l.jsx)(u.Select,{data:[{label:"5 minutes",value:"0:05"},{label:"15 minutes",value:"0:15"},{label:"30 minutes",value:"0:30"},{label:"1 hour",value:"1:00"},{label:"1 hour 30 minutes",value:"1:30"},{label:"2 hours",value:"2:00"},{label:"Forever",value:"0:00"}],"data-testid":"for-time-select",...P.getInputProps(k.M8.ForTime)},P.key(k.M8.ForTime)),"until"===P.values.mode&&(0,l.jsxs)(x.Flex,{gap:"xs",children:[(0,l.jsx)(u.Select,{placeholder:"Hour",data:[{label:"Today",value:"0"},{label:"Tomorrow",value:"1"}],"data-testid":"until-hour-select",...P.getInputProps(k.M8.UntilDay)},P.key(k.M8.UntilDay)),(0,l.jsx)(h.Text,{children:"@"}),(0,l.jsx)(u.Select,{placeholder:"Hour",data:[{label:"5 AM",value:"5"},{label:"6 AM",value:"6"},{label:"7 AM",value:"7"},{label:"8 AM",value:"8"},{label:"9 AM",value:"9"},{label:"10 AM",value:"10"},{label:"11 AM",value:"11"},{label:"12 PM",value:"12"},{label:"1 PM",value:"13"}],"data-testid":"until-hour-select",...P.getInputProps(k.M8.UntilHour)},P.key(k.M8.UntilHour)),(0,l.jsx)(h.Text,{children:":"}),(0,l.jsx)(u.Select,{placeholder:"Minute",data:[{label:"00",value:"00"},{label:"15",value:"15"},{label:"30",value:"30"},{label:"45",value:"45"}],"data-testid":"until-minute-select",...P.getInputProps(k.M8.UntilMinute)},P.key(k.M8.UntilMinute))]}),(0,l.jsx)(m.Divider,{}),(0,l.jsx)(I,{form:P}),(0,l.jsx)(x.Flex,{mt:"xs",children:(0,l.jsx)(g.Button,{type:"submit",fullWidth:!0,children:f||"Save"})})]})]})}function T(e){let{form:n,index:t}=e,{sceneName:s}=n.getValues().scenes[0];return"twinkle"===s?(0,l.jsx)(j.Card,{w:"100%",children:(0,l.jsxs)(i.Stack,{children:[(0,l.jsxs)(i.Stack,{gap:4,children:[(0,l.jsx)(h.Text,{size:"sm",children:"Twinkle Speed"}),(0,l.jsx)(f.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.speed"))},n.key("scenes.".concat(t,".sceneConfig.speed")))]}),(0,l.jsxs)(i.Stack,{gap:4,children:[(0,l.jsx)(h.Text,{size:"sm",children:"Twinkle Amount"}),(0,l.jsx)(f.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.amount"))},n.key("scenes.".concat(t,".sceneConfig.amount")))]}),(0,l.jsx)(b.ColorInput,{placeholder:"Select a twinkle color",...n.getInputProps("scenes.".concat(t,".sceneConfig.color"))},n.key("scenes.".concat(t,".sceneConfig.color")))]})}):"ripple"===s?(0,l.jsx)(j.Card,{w:"100%",children:(0,l.jsxs)(i.Stack,{children:[(0,l.jsxs)(i.Stack,{gap:4,children:[(0,l.jsx)(h.Text,{size:"sm",children:"Speed"}),(0,l.jsx)(f.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.speed"))},n.key("scenes.".concat(t,".sceneConfig.speed")))]}),(0,l.jsxs)(i.Stack,{gap:4,children:[(0,l.jsx)(h.Text,{size:"sm",children:"Wave height"}),(0,l.jsx)(f.Slider,{label:null,...n.getInputProps("scenes.".concat(t,".sceneConfig.waveHeight"))},n.key("scenes.".concat(t,".sceneConfig.waveHeight")))]}),(0,l.jsx)(b.ColorInput,{placeholder:"Select a twinkle color",...n.getInputProps("scenes.".concat(t,".sceneConfig.color"))},n.key("scenes.".concat(t,".sceneConfig.color")))]})}):(0,l.jsx)(j.Card,{w:"100%",children:(0,l.jsx)(h.Text,{ta:"center",size:"xs",children:"No scene options available"})})}function I(e){let{form:n}=e;return(0,l.jsx)(v.Accordion,{defaultValue:"Apples",variant:"filled",children:(0,l.jsxs)(v.Accordion.Item,{value:"hardware",children:[(0,l.jsx)(v.Accordion.Control,{children:(0,l.jsx)(h.Text,{size:"sm",c:"dimmed",children:"Advanced Settings"})}),(0,l.jsx)(v.Accordion.Panel,{children:(0,l.jsx)(i.Stack,{children:(0,l.jsx)(u.Select,{label:"Time adjustment interval",description:"Configure a custom time adjustment interval in the UI",placeholder:"Select...",data:[{label:"1 minute",value:"1"},{label:"5 minutes",value:"5"},{label:"10 minutes",value:"10"},{label:"20 minutes",value:"20"},{label:"30 minutes",value:"30"},{label:"1 hour",value:"60"}],"data-testid":"time-adjustment-select",...n.getInputProps(k.M8.TimeAdjustmentAmount)},n.key(k.M8.TimeAdjustmentAmount))})})]},"hardware")})}},16067:(e,n,t)=>{"use strict";t.d(n,{M8:()=>s,TS:()=>l,eU:()=>a});var l=function(e){return e.Name="name",e.TimeAdjustmentAmount="timeAdjustmentAmount",e.Brightness="brightness",e.PwnLsbNanoseconds="pwnLsbNanoseconds",e.GpioSlowdown="gpioSlowdown",e.PwmBits="pwmBits",e}({}),s=function(e){return e.Name="name",e.Scenes="scenes",e.Mode="mode",e.UntilDay="untilDay",e.UntilHour="untilHour",e.UntilMinute="untilMinute",e.ForTime="forTime",e.TimeAdjustmentAmount="timeAdjustmentAmount",e}({}),a=function(e){return e.Blank="blank",e.Moon="moon",e.Countdown="countdown",e.Twinkle="twinkle",e.Ripple="ripple",e}({})}}]);