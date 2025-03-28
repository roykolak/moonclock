(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[307],{75506:(e,t,n)=>{Promise.resolve().then(n.bind(n,12532)),Promise.resolve().then(n.bind(n,8699))},8699:(e,t,n)=>{"use strict";n.d(t,{default:()=>I});var r=n(95155),s=n(3506),i=n(51044),l=n(58830),d=n(19371),a=n(99502),c=n(72750),o=n(61650),u=n(28708),h=n(92291),m=n(51743),x=n(79747),p=n(21791),j=n(16067),f=n(85407),v=n(95786),b=n(98461),S=n(75828);let g=(0,S.createServerReference)("40b489463ab873e83127c3b28516101d990c7cebee",S.callServer,void 0,S.findSourceMapURL,"createCustomScheduledPreset"),C=(0,S.createServerReference)("401ee6b40e8f6474624a6b1ff29f136c70c6c52570",S.callServer,void 0,S.findSourceMapURL,"updateScheduledPreset"),w=(0,S.createServerReference)("40bd3bc60077c82b69f4c98abb2acc7764cd695476",S.callServer,void 0,S.findSourceMapURL,"changeEndTime");var k=n(36886),M=n(85644);function T(e){let{hardwarePreset:t,formattedLastHeartbeat:n,formattedHardwareRenderedAt:s}=e;return(0,r.jsx)(k.Accordion,{defaultValue:"Apples",variant:"filled",mt:"xs",children:(0,r.jsxs)(k.Accordion.Item,{value:"hardware",children:[(0,r.jsx)(k.Accordion.Control,{children:(0,r.jsx)(d.Text,{size:"sm",c:"dimmed",children:"Hardware Details"})}),(0,r.jsx)(k.Accordion.Panel,{children:(0,r.jsx)(o.Stack,{children:(0,r.jsxs)(M.Grid,{gutter:0,children:[(0,r.jsx)(M.Grid.Col,{span:4,children:(0,r.jsx)(d.Text,{c:"dimmed",size:"sm",fw:"bold",children:"Scene:"})}),(0,r.jsx)(M.Grid.Col,{span:8,children:(0,r.jsxs)(d.Text,{c:"dimmed",size:"sm",children:[t.scenes[0].sceneName," scene"]})}),(0,r.jsx)(M.Grid.Col,{span:4,children:(0,r.jsx)(d.Text,{c:"dimmed",size:"sm",fw:"bold",children:"Rendered at:"})}),(0,r.jsx)(M.Grid.Col,{span:8,children:(0,r.jsx)(d.Text,{c:"dimmed",size:"sm",children:s})}),(0,r.jsx)(M.Grid.Col,{span:4,children:(0,r.jsx)(d.Text,{c:"dimmed",size:"sm",mb:"xs",fw:"bold",children:"Last loop run:"})}),(0,r.jsx)(M.Grid.Col,{span:8,children:(0,r.jsx)(d.Text,{c:"dimmed",size:"sm",mb:"xs",children:n})})]})})})]},"hardware")})}var y=(0,n(30775).A)("outline","dots","IconDots",[["path",{d:"M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-0"}],["path",{d:"M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-1"}],["path",{d:"M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",key:"svg-2"}]]);let A=(0,S.createServerReference)("00b4386ce128d64c5ecaa17c1c96fbdbb563f32945",S.callServer,void 0,S.findSourceMapURL,"reloadHardwareScene");var P=n(3269);function H(e){let t=Math.abs(e);return"".concat(e>0?"+":"-").concat(t<60?t:t/60," ").concat(t<60?"min":"hour")}function I(e){var t;let{panel:n,hardwarePreset:S,scheduledPreset:k,formattedEndTime:M,formattedLastHeartbeat:I,formattedHardwareRenderedAt:R,presets:z,customSceneNames:B}=e,[D,G]=(0,v.useDisclosure)(),L=parseInt((null==k?void 0:null===(t=k.preset)||void 0===t?void 0:t[j.M8.TimeAdjustmentAmount])||n.timeAdjustmentAmount,10);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.Modal,{opened:D,title:"Set custom preset",onClose:G.close,children:(0,r.jsx)(b.PresetForm,{customSceneNames:B,preset:{name:"Custom Preset"},action:async e=>{await g(e),G.close()},submitLabel:"Apply now"})}),(0,r.jsxs)(i.Card,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,style:{maxWidth:500},children:[(0,r.jsx)(i.Card.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:(0,r.jsxs)(l.Group,{justify:"space-between",children:[(0,r.jsx)(d.Text,{fw:700,"data-testid":"panel-name",children:n.name}),(0,r.jsxs)(a.Menu,{withinPortal:!0,position:"bottom-end",shadow:"sm",children:[(0,r.jsx)(a.Menu.Target,{children:(0,r.jsx)(c.ActionIcon,{variant:"subtle",color:"gray","data-testid":"panel-menu",children:(0,r.jsx)(y,{size:16})})}),(0,r.jsxs)(a.Menu.Dropdown,{children:[(0,r.jsx)(a.Menu.Item,{disabled:!(null==k?void 0:k.preset),onClick:()=>{C({preset:null,endTime:null})},children:"Clear Scene"}),(0,r.jsx)(a.Menu.Item,{onClick:async()=>{(0,P.showNotification)({message:"Hardware Scene reloading..."}),await A()},children:"Reload Hardware"})]})]})]})}),(0,r.jsxs)(i.Card.Section,{children:[(0,r.jsxs)("div",{style:{position:"relative"},children:[(0,r.jsx)(f.K,{preset:(null==k?void 0:k.preset)||n.defaultPreset,isDefaultPreset:!(null==k?void 0:k.preset)}),!(null==k?void 0:k.preset)&&(0,r.jsxs)(o.Stack,{style:{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%, -50%)"},children:[z.map((e,t)=>(0,r.jsx)(u.Button,{variant:"filled",fullWidth:!0,onClick:()=>{let t=function(e){let t=new Date;if("until"===e.mode){let n=parseInt(e.untilDay,10),r=parseInt(e.untilHour,10),s=parseInt(e.untilMinute,10);t.setDate(t.getDate()+n),t.setHours(r,s,0,0)}else if("for"===e.mode){let[n,r]=e.forTime.split(":"),s=parseInt(n,10),i=parseInt(r,10);if(0===s&&0===i)return null;t.setHours(t.getHours()+s,t.getMinutes()+i,0,0)}return t}(e);C({preset:e,endTime:(null==t?void 0:t.toJSON())||null})},children:e.name},"preset-".concat(t))),(0,r.jsx)(u.Button,{variant:"light",fullWidth:!0,onClick:G.open,children:"Custom..."})]})]}),(null==k?void 0:k.preset)&&(0,r.jsxs)(h.Flex,{p:"lg",children:[(0,r.jsx)(m.Box,{children:(0,r.jsxs)(o.Stack,{gap:4,children:[(0,r.jsx)(x.Center,{children:(0,r.jsxs)(d.Text,{children:[k.preset.name," until..."]})}),(0,r.jsx)(p.Badge,{color:"gray",radius:"sm",style:{height:50,padding:"8px 16px",fontSize:38,lineHeight:38},styles:{label:{color:"#CCC"}},"data-testid":"end-time",children:M})]})}),(0,r.jsx)(m.Box,{flex:"auto"}),(0,r.jsx)(h.Flex,{gap:"lg",children:(0,r.jsxs)(o.Stack,{gap:8,children:[(0,r.jsx)(u.Button,{variant:"filled",disabled:null===k.endTime,onClick:()=>{w(L)},children:H(L)}),(0,r.jsx)(u.Button,{variant:"filled",disabled:null===k.endTime,onClick:()=>w(-L),children:H(-L)})]})})]})]})]}),(0,r.jsx)(T,{hardwarePreset:S,formattedLastHeartbeat:I,formattedHardwareRenderedAt:R})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[545,170,469,251,514,366,23,506,7,16,149,441,517,358],()=>t(75506)),_N_E=e.O()}]);