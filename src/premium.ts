export const PREMIUM_CSS = `
:root{color-scheme:dark;--bg:#080b13;--panel:#131b2b;--line:#33415a;--fg:#f5f7ff;--muted:#afbbd1;--lime:#c4ffe5;--mint:#b7abff}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',system-ui,sans-serif;letter-spacing:-.008em;color:var(--fg);background:radial-gradient(ellipse 65% 38% at 75% -7%,#6a50bb55,transparent 75%),radial-gradient(ellipse 45% 32% at 5% 31%,#2589991c,transparent 75%),linear-gradient(#0a0d19,#070a13)!important}
body:before{opacity:.4}
body:after{content:'';position:fixed;inset:0;pointer-events:none;z-index:-1;background-image:radial-gradient(#c5cffd55 .6px,transparent .7px);background-size:30px 30px;opacity:.12;mask-image:linear-gradient(#000,transparent 85%)}
.wrap{width:min(1200px,calc(100% - 56px))}
.nav{background:#0b1020d9!important;border-bottom:1px solid #a1b5e124!important;box-shadow:0 12px 45px #0305152c!important;backdrop-filter:blur(23px)}
.navin{height:76px;gap:20px}.brand{display:inline-flex;align-items:center;letter-spacing:-1.5px;color:#f3f6ff}.brand b{color:#b6e8d8}
.brand small{border:1px solid #9688d67b;border-radius:999px;padding:2px 7px!important;margin-inline-start:7px;color:#c7bdff!important;font-size:9px!important}
.navlinks{gap:18px;justify-content:center;overflow:visible}.navlinks a{font-size:12px!important;font-weight:700;color:#bac7d9!important}
.navlinks .active,.navlinks a:hover{color:#f7faff!important}
.navlinks .active{position:relative}.navlinks .active:after{content:'';position:absolute;left:4px;right:4px;bottom:-24px;height:2px;background:linear-gradient(90deg,#a3f1e3,#b1a1ff)}
.btn{border-radius:12px;background:linear-gradient(110deg,#d0ffec,#b8d7ff 52%,#c8b6ff);color:#13182b!important;border:1px solid #e6f8fc;padding:12px 21px;box-shadow:0 9px 26px #819ce21e;font-size:13px;min-height:44px;transition:transform .2s,box-shadow .2s}
.btn:hover{color:#111625!important;transform:translateY(-2px);box-shadow:0 12px 30px #98d1e439}
.btn.ghost{color:#eaf1ff!important;background:#1a253a99;border:1px solid #8ea1bf66;box-shadow:none}
.btn.ghost:hover{background:#273751;color:#fff!important}
.label{color:#a8e5e1!important;font-size:10px;letter-spacing:2px}
.fine{color:#abb8cb}.hero{grid-template-columns:1.04fr .96fr;gap:48px;padding:95px 0 70px}
.hero h1{font-size:clamp(65px,7.2vw,108px);line-height:1.035;letter-spacing:-5.4px;margin:18px 0 25px}
.hero h1 em{background:linear-gradient(115deg,#ccbbff,#8fecdf);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#bfcbe0;font-size:18px;line-height:1.8}.hero .actions{margin-top:32px}.hero .fine{margin-top:18px}
.eyebrow{display:inline-flex;align-items:center;gap:10px;padding:8px 13px;border:1px solid #b5b4df5a;border-radius:999px;background:#26233f65;color:#d0daed;font:800 10px 'DM Sans';letter-spacing:1.3px;text-transform:uppercase}
.eyebrow:before{content:'';width:7px;height:7px;border-radius:50%;background:#9ee4c8;box-shadow:0 0 0 4px #98f2d71a}
.heroart{min-height:480px;padding:0!important;overflow:hidden;border-radius:27px;border:1px solid #aaa4e959;background:linear-gradient(145deg,#23213e,#101a2b 60%,#102c29)!important;box-shadow:0 30px 95px #01040eb3,0 0 80px #b1a2ff10;transform:perspective(1100px) rotateY(-3deg)}
.heroart:before{background-size:27px 27px;mask-image:linear-gradient(#000,transparent)}
.artheader{padding:17px 21px;display:flex;gap:11px;align-items:center;border-bottom:1px solid #ced2ff2b;background:#161d31bc;font-weight:700;letter-spacing:1px;color:#aebbd3}
.window-dots{display:flex;gap:6px}.window-dots i{display:block;width:8px;height:8px;border-radius:50%;background:#8c849f}.window-dots i:nth-child(1){background:#f195a1}.window-dots i:nth-child(2){background:#ebca8b}.window-dots i:nth-child(3){background:#9adfc7}
.window-title{margin-inline-start:auto;color:#bdc5e7;font-size:10px}
.pipeline-heading{position:relative;margin:29px 27px 0;display:flex;align-items:center;justify-content:space-between;gap:12px}
.pipeline-heading strong{font:700 16px 'Space Grotesk';color:#f1f4ff}
.pipeline-tag{border:1px solid #94e1c982;border-radius:999px;padding:4px 10px;font-size:10px;color:#bbf0dc}
.artrows{margin:18px 27px 0;gap:10px}
.artrow,.artrow:nth-child(2),.artrow:nth-child(3){margin:0;border-radius:14px;background:#121d30e3;border:1px solid #aaa5dd40;box-shadow:none;padding:16px}
.artrow:nth-child(3){background:linear-gradient(105deg,#1d2b40,#193633);border-color:#91dac86c}
.num{width:37px;height:37px;border-radius:11px;flex-shrink:0;background:#242c44;border-color:#adb0e36b;color:#c9bdff;font-size:12px}
.artrow strong{color:#edf4ff;font-size:13px}.artrow small{color:#aabbd1;font-size:11px}
.art-step-status{margin-inline-start:auto;font-size:10px;font-weight:700;color:#aadaca;letter-spacing:.7px}
.artbottom{margin:17px 27px 24px;padding:16px 18px;border:1px dashed #a6aff267;border-radius:12px;background:#121b31b3;line-height:1.6}
.artbottom strong{display:block;color:#e7edff;font-size:12px}.artbottom span{font-size:11px;color:#b2c0d9}
.credibility-note{display:flex;align-items:center;gap:9px;font-size:12px;color:#afc5c6;margin-top:15px}
.metrics{background:#101725ac;border:1px solid #a9b6dd3d!important;border-radius:18px;padding:23px 12px;gap:0}
.metrics>div{border-inline-end:1px solid #a6b5d037;padding:0 25px}.metrics>div:last-child{border:0}
.metrics strong{font-size:32px;color:#f5f7ff;letter-spacing:-1px}.metrics span{color:#afbcd3;font-size:11px}
.section{margin:85px 0}.sectionhead h2{font-size:clamp(36px,4.4vw,56px)}.sectionhead p{max-width:650px;line-height:1.75}
h2,h3{color:#f3f6ff}.grid{gap:17px}
.card,.panel{border:1px solid #a6b4da37!important;background:linear-gradient(140deg,#1a2538e8,#0e1728ed);box-shadow:inset 0 1px 0 #ffffff0a,0 13px 32px #04091438;border-radius:19px}
.card{position:relative;min-height:230px;padding:26px 24px;overflow:hidden}
.card:before{content:'';position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,#b9a8ff,#91eadb);opacity:0;transition:opacity .2s}
.card:hover{border-color:#aba9fa8a!important;box-shadow:0 26px 50px #04081476}.card:hover:before{opacity:1}
.card .meta{color:#a4d9d5;font-size:10px;letter-spacing:1px}.card h3{font-size:20px;margin:14px 0 8px}
.card p{color:#b4c2d8;font-size:13px;line-height:1.75}.card .bottom{border-color:#b2bed332;color:#c1ccde}
.arrow{color:#c2b5ff}.mission-card-number{position:absolute;top:22px;right:24px;font:800 11px 'Space Grotesk';color:#aa9ff791}
.steps{gap:15px}.step{border-radius:14px;border:1px solid #abb0d44a;border-left:2px solid #a69af4;background:#121d2fd9;padding:25px}
.step small{color:#c1b4ff}.step p{color:#b7c7d7;font-size:13px}
.banner{border:1px solid #dee6fd;background:linear-gradient(115deg,#d4ffed,#bfd7ff 55%,#d0bbff)!important;border-radius:22px;padding:41px 48px;box-shadow:0 23px 52px #8dabed1e}
.banner .label{color:#315369!important}.banner h2{color:#1b283b}.banner p{color:#41546e}
.banner .btn{background:#172239;color:#fff!important;border-color:#172239}
.subhero{padding-top:69px;padding-bottom:31px}.subhero .label{color:#a99cff!important}.subhero h2{font-size:clamp(38px,4.5vw,60px)}.subhero p{color:#b7c6db;line-height:1.8}
.chip{background:#151e31;border-color:#9faed167;color:#c1cee2}.chip.active,.chip:hover{color:#c7f7ec;border-color:#9cddce;background:#31505655}
.panel{padding:clamp(22px,2.7vw,31px)}.field label{font-weight:700;color:#e2e7f6}
.field input,.field select,.field textarea{background:#0d1626;border:1px solid #7180a180;border-radius:12px;color:#f3f6ff;padding:12px 14px}
.field input:focus,.field select:focus,.field textarea:focus{border-color:#c4b5fd;box-shadow:0 0 0 3px #a99fff27}
.field input::placeholder,.field textarea::placeholder{color:#8192ad}
.formpage .panel{border-color:#a99add66!important}.badge{border-radius:999px;color:#dce4f5;background:#252f4980}
.badge.accepted{color:#b6f6da}.notice{background:#173132;color:#d5f8ed}.notice.bad{background:#321b2d;color:#ffcfe0}
.table th{font-size:11px;letter-spacing:.8px;text-transform:uppercase;color:#b8c9dd}.table td{color:#d4dcef}
.score{color:#d5c6ff}.empty{background:#131b2a88;border-color:#a3adbe60}
.mission-toolbar{display:grid;grid-template-columns:minmax(210px,1fr) 170px 160px auto;gap:12px;align-items:end;margin:19px 0 25px}
.mission-toolbar .field{margin:0}.mission-toolbar .field label{font-size:11px;color:#bac7d9}
.mission-toolbar .btn{white-space:nowrap}.filter-summary{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#aebed3;font-size:12px;margin:0 0 17px}
.feature-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:40px 0 0}
.feature-tile{border:1px solid #9ba6ca48;border-radius:17px;padding:23px;background:#121c30bf}
.feature-tile .feature-index{font:800 11px 'Space Grotesk';color:#beb2ff}.feature-tile h3{margin:14px 0 7px;font-size:17px}.feature-tile p{color:#b9c8db;font-size:13px}
.profile-hero{display:flex;align-items:center;gap:17px}.profile-avatar{width:65px;height:65px;display:grid;place-items:center;flex-shrink:0;border-radius:19px;background:linear-gradient(140deg,#b4efe5,#b7a1ff);color:#151d34;font:800 29px 'Space Grotesk'}
.live-pill{display:inline-flex;align-items:center;gap:7px;border:1px solid #96e3cb70;border-radius:99px;color:#b8f1de;background:#1b383a70;padding:7px 11px;font-size:11px;font-weight:700}
.live-pill:before{content:'';width:6px;height:6px;border-radius:50%;background:#a0ebd0}
.shell-topline{border-bottom:1px solid #8799bd24;background:#0d1322ad}.shell-topline .wrap{display:flex;align-items:center;justify-content:space-between;min-height:29px;color:#afbdd2;font-size:10px;gap:12px}
.shell-topline strong{color:#b6f7e0}.footer{border-color:#98aac44a;margin-top:110px}
[dir=rtl] .mission-card-number{right:auto;left:24px}[dir=rtl] .artheader .window-title{margin-inline-start:auto}
@media(max-width:1080px){.navlinks{gap:10px}.navlinks a{font-size:11px!important}}
@media(max-width:980px){.navlinks{display:none}.mobile{display:flex;gap:20px;overflow:auto;padding:0 22px 13px;border-top:1px solid #ffffff09}.mobile a{white-space:nowrap;font-size:12px;color:#c0cde0;padding-top:11px}.hero{grid-template-columns:1fr;gap:38px;padding-top:65px}.heroart{transform:none;max-width:670px;margin:0 auto;width:100%}.mission-toolbar{grid-template-columns:1fr 1fr}.mission-toolbar .field:first-child{grid-column:1/-1}}
@media(max-width:690px){.wrap{width:calc(100% - 34px)}.navin{height:64px}.brand{font-size:22px}.shell-topline .wrap span:last-child{display:none}.hero{padding:50px 0 32px}.hero h1{font-size:clamp(54px,12.5vw,80px);letter-spacing:-3.6px}.hero p{font-size:16px}.heroart{min-height:0;border-radius:20px}.pipeline-heading{margin:20px 18px 0}.artrows{margin:16px 18px 0}.artrow{padding:13px}.artbottom{margin:14px 18px 20px}.metrics{grid-template-columns:repeat(2,1fr);gap:15px 0;padding:17px 8px}.metrics>div{padding:8px 15px}.metrics>div:nth-child(2){border-inline-end:0}.metrics strong{font-size:29px}.section{margin:62px 0}.feature-row,.grid,.two,.steps{grid-template-columns:1fr}.banner{padding:29px}.subhero{padding:50px 0 24px}.mission-toolbar{gap:10px}.mission-toolbar .btn{grid-column:1/-1}.profile-avatar{width:54px;height:54px}.card{min-height:190px}.footer{margin-top:78px}}
@media(max-width:390px){.brand small{display:none}.hero h1{font-size:53px}.auth .btn.sm{padding:9px 10px;font-size:11px}.art-step-status{display:none}}
@media(prefers-reduced-motion:reduce){.heroart{transform:none}html{scroll-behavior:auto}}
`;
