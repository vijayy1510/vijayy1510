// Builds the MORPH-style SVG panels for the profile README.
// Run from the repo root:  node scripts/build-svgs.mjs
// Fonts are embedded (subset, base64) so they render inside GitHub's <img> sandbox.
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const FONTS = path.join(ROOT, 'scripts', 'fonts');
const OUT = path.join(ROOT, 'assets');

const C = {
  ink: '#0b0b0f', ink2: '#131318', line: '#2c2c36', paper: '#f3eee3', paper2: '#e6dfcf',
  muted: '#8f8b99', paperMuted: '#6d675c', red: '#e8222e', redDark: '#a3121c', navy: '#1a1f2e',
  yellow: '#ffd23f', cyan: '#22d3ee',
};

const b64 = (f) => fs.readFileSync(path.join(FONTS, f)).toString('base64');
const FONT_CSS = {
  anton: `@font-face{font-family:'Anton';src:url(data:font/woff2;base64,${b64('anton.woff2')}) format('woff2');}`,
  bangers: `@font-face{font-family:'Bangers';src:url(data:font/woff2;base64,${b64('bangers.woff2')}) format('woff2');}`,
  mono: `@font-face{font-family:'Space Mono';font-weight:700;src:url(data:font/woff2;base64,${b64('spacemono.woff2')}) format('woff2');}`,
  body500: `@font-face{font-family:'Archivo';font-weight:500;src:url(data:font/woff2;base64,${b64('archivo500.woff2')}) format('woff2');}`,
  body800: `@font-face{font-family:'Archivo';font-weight:800;src:url(data:font/woff2;base64,${b64('archivo800.woff2')}) format('woff2');}`,
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const BASE_CSS = `
  .display{font-family:'Anton',Impact,sans-serif;}
  .comic{font-family:'Bangers',Impact,sans-serif;}
  .mono{font-family:'Space Mono',Consolas,monospace;font-weight:700;}
  .body{font-family:'Archivo','Segoe UI',Arial,sans-serif;font-weight:500;}
  .bold{font-family:'Archivo','Segoe UI',Arial,sans-serif;font-weight:800;}
  .rise{animation:rise .7s cubic-bezier(.2,.8,.2,1) both;}
  .blink{animation:blink 1s steps(2) infinite;}
  @keyframes rise{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
  @keyframes blink{50%{opacity:0;}}
  @media (prefers-reduced-motion: reduce){*{animation:none !important;}}
`;

function svg({ w, h, fonts, css = '', body, title }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<defs>
  <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.1" fill="${C.red}" fill-opacity="0.16"/></pattern>
  <pattern id="dotsLight" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.2" fill="${C.paper}" fill-opacity="0.06"/></pattern>
  <radialGradient id="glow" cx="75%" cy="40%" r="55%"><stop offset="0" stop-color="${C.red}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></radialGradient>
</defs>
<style>${fonts.map((f) => FONT_CSS[f]).join('')}${BASE_CSS}${css}</style>
<rect width="${w}" height="${h}" fill="${C.ink}"/>
<rect width="${w}" height="${h}" fill="url(#dots)"/>
${body}
</svg>`;
}

// Title with a red section number, like the portfolio: "01. ABOUT ME"
const sectionTitle = (num, text, sub, y = 78) => `
<g class="rise">
  <text x="60" y="${y - 12}" class="mono" font-size="16" fill="${C.red}">${num}</text>
  <text x="104" y="${y}" class="display" font-size="54" fill="${C.paper}" letter-spacing="1">${esc(text)}</text>
  ${sub ? `<text x="1140" y="${y - 10}" class="mono" font-size="15" fill="${C.muted}" text-anchor="end">${esc(sub)}</text>` : ''}
</g>`;

// Yellow comic caption box with a hard ink shadow
const caption = (x, y, w, h, inner, rot = -1) => `
<g transform="translate(${x} ${y}) rotate(${rot})">
  <rect x="5" y="5" width="${w}" height="${h}" fill="${C.ink}"/>
  <rect width="${w}" height="${h}" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
  ${inner}
</g>`;

const burst = (cx, cy, outer, inner, points = 16) => {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer, a = (i / (points * 2)) * Math.PI * 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>`;
};

// ---------- 1. Hero ----------
function hero() {
  const roles = ['Engineering Student @ LPU', 'Python & C++ Programmer', 'Aspiring Web Developer', 'Problem Solver'];
  const term = [
    ['p', 'whoami'], ['o', 'lanjipalli_vijay'],
    ['p', 'cat education.txt'], ['o', 'B.Tech @ Lovely Professional University'],
    ['p', 'ls skills/'], ['o', 'python  c++  c  javascript'], ['o', 'html  css  dbms'],
    ['p', 'echo $STATUS'], ['o', 'learning. building. shipping soon.'],
  ];
  const termLines = term.map(([kind, text], i) => {
    const y = 96 + i * 23;
    const delay = (0.6 + i * 0.35).toFixed(2);
    return kind === 'p'
      ? `<text x="34" y="${y}" class="mono line" font-size="14" style="animation-delay:${delay}s"><tspan fill="${C.red}">vijay@lpu</tspan><tspan fill="${C.paper}">:</tspan><tspan fill="${C.cyan}">~$</tspan><tspan fill="${C.paper}"> ${esc(text)}</tspan></text>`
      : `<text x="34" y="${y}" class="mono line" font-size="14" fill="${C.yellow}" style="animation-delay:${delay}s">${esc(text)}</text>`;
  }).join('\n');
  const lastY = 96 + term.length * 23;
  const lastDelay = (0.6 + term.length * 0.35).toFixed(2);

  const name = (text, y, size) => `
    <text x="-5" y="${y}" class="display" font-size="${size}" fill="${C.cyan}">${text}</text>
    <text x="6" y="${y + 3}" class="display" font-size="${size}" fill="${C.red}">${text}</text>
    <text x="0" y="${y}" class="display" font-size="${size}" fill="${C.paper}">${text}</text>`;

  const roleTexts = roles.map((r, i) =>
    `<text x="46" y="36" class="bold role" font-size="21" fill="${C.ink}" style="animation-delay:${i * 3}s">${esc(r.toUpperCase())}</text>`).join('');

  return svg({
    w: 1200, h: 480, fonts: ['anton', 'bangers', 'mono', 'body800'],
    title: 'Lanjipalli Vijay — Engineering Student @ LPU · C++ & Python · Aspiring Web Developer',
    css: `
      .line{opacity:0;animation:show .01s linear forwards;}
      @keyframes show{to{opacity:1;}}
      .role{opacity:0;animation:role 12s infinite;}
      @keyframes role{0%{opacity:0;transform:translateY(8px);}3%,25%{opacity:1;transform:none;}28%,100%{opacity:0;}}`,
    body: `
<rect width="1200" height="480" fill="url(#glow)"/>
<g class="rise">
  <rect x="60" y="66" width="12" height="12" fill="${C.red}" class="blink"/>
  <text x="84" y="77" class="mono" font-size="14" fill="${C.red}" letter-spacing="2">OPEN TO INTERNSHIPS &amp; COLLABORATIONS</text>
  <text x="60" y="122" class="mono" font-size="15" fill="${C.muted}" letter-spacing="2">HI, I'M</text>
</g>
<g class="rise" style="animation-delay:.1s">
  <g transform="translate(60 0) skewX(-8)">
    ${name('LANJIPALLI', 238, 124)}
    ${name('VIJAY', 348, 124)}
  </g>
</g>
<g class="rise" style="animation-delay:.25s">
  ${caption(60, 382, 470, 54, `<text x="18" y="36" class="mono" font-size="20" fill="${C.red}">&gt;</text>${roleTexts}`)}
</g>
<g class="rise" style="animation-delay:.2s"><g transform="translate(700 72) rotate(1.5)">
  <rect x="10" y="12" width="440" height="330" fill="#000" fill-opacity="0.55"/>
  <rect width="440" height="330" fill="${C.paper}"/>
  <g transform="translate(12 12)">
    <rect width="416" height="306" fill="${C.ink}"/>
    <rect width="416" height="306" fill="url(#dotsLight)"/>
    <rect width="150" height="34" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
    <text x="14" y="23" class="bold" font-size="14" fill="${C.ink}">VIJAY@LPU: ~</text>
    <rect x="360" y="12" width="10" height="10" fill="${C.red}"/>
    <rect x="376" y="12" width="10" height="10" fill="none" stroke="${C.line}" stroke-width="2"/>
    <rect x="392" y="12" width="10" height="10" fill="none" stroke="${C.line}" stroke-width="2"/>
    <g transform="translate(-14 -16)">
      ${termLines}
      <text x="34" y="${lastY}" class="mono line" font-size="14" style="animation-delay:${lastDelay}s"><tspan fill="${C.red}">vijay@lpu</tspan><tspan fill="${C.paper}">:</tspan><tspan fill="${C.cyan}">~$</tspan></text>
      <rect x="145" y="${lastY - 13}" width="9" height="16" fill="${C.red}" class="blink"/>
    </g>
  </g>
</g></g>
<g class="rise" style="animation-delay:.4s"><g transform="rotate(12 1128 74)">
  ${burst(1128, 74, 58, 38)}
  <text x="1128" y="90" class="comic" font-size="46" fill="${C.red}" stroke="${C.ink}" stroke-width="1.5" text-anchor="middle">HI!</text>
</g></g>`,
  });
}

// ---------- 2. About (case file) ----------
function about() {
  const chip = (x, text) => {
    const w = text.length * 8.4 + 18;
    return { w, el: `<g transform="translate(${x} -15)"><rect x="3" y="3" width="${w}" height="24" fill="${C.red}"/><rect width="${w}" height="24" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2"/><text x="9" y="17" class="mono" font-size="13" fill="${C.ink}">${esc(text)}</text></g>` };
  };
  const chips = (list) => {
    let x = 0; const parts = [];
    for (const t of list) { const c = chip(x, t); parts.push(c.el); x += c.w + 10; }
    return parts.join('');
  };
  const rows = [
    ['studying', `<text class="bold" font-size="19" fill="${C.ink}">B.Tech @ Lovely Professional University</text>`],
    ['from', `<text class="bold" font-size="19" fill="${C.ink}">Andhra Pradesh, India</text>`],
    ['languages', chips(['C++', 'C', 'Python', 'JavaScript'])],
    ['web', chips(['HTML', 'CSS', 'JavaScript'])],
    ['data', chips(['DBMS', 'SQL'])],
    ['currently', `<text class="bold" font-size="19" fill="${C.ink}">sharpening DSA &amp; shipping my first projects</text>`],
    ['openToInternships', `<g transform="rotate(-4)"><rect x="0" y="-20" width="84" height="30" fill="none" stroke="${C.red}" stroke-width="3"/><text x="42" y="1" class="mono" font-size="15" fill="${C.red}" text-anchor="middle" letter-spacing="2">TRUE</text></g>`],
  ];
  const rowEls = rows.map(([label, value], i) => {
    const y = 104 + i * 42;
    return `<g class="rise" style="animation-delay:${(0.2 + i * 0.08).toFixed(2)}s">
      <text x="28" y="${y}" class="mono" font-size="13" fill="${C.paperMuted}" letter-spacing="1">${esc(label.toUpperCase())}</text>
      <g transform="translate(290 ${y})">${value}</g>
      ${i < rows.length - 1 ? `<line x1="28" y1="${y + 18}" x2="1052" y2="${y + 18}" stroke="${C.ink}" stroke-opacity="0.28" stroke-width="2" stroke-dasharray="6 5"/>` : ''}
    </g>`;
  }).join('\n');

  return svg({
    w: 1200, h: 560, fonts: ['anton', 'mono', 'body800'],
    title: 'About me: B.Tech @ Lovely Professional University, from Andhra Pradesh, India. Languages C++, C, Python, JavaScript; web HTML, CSS, JavaScript; data DBMS, SQL. Currently sharpening DSA & shipping my first projects. Open to internships. Motto: Learn it. Build it. Push it.',
    body: `
${sectionTitle('01.', 'ABOUT ME', '$ cat about_me.cpp')}
<g class="rise" style="animation-delay:.1s"><g transform="translate(60 110) rotate(0.3)">
  <rect x="9" y="9" width="1080" height="390" fill="${C.red}"/>
  <rect width="1080" height="390" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
  <rect width="1080" height="52" fill="${C.ink}"/>
  <text x="24" y="36" class="display" font-size="28" fill="${C.paper}" letter-spacing="1">CASE FILE</text>
  <text x="170" y="34" class="mono" font-size="14" fill="${C.muted}">struct Vijay</text>
  <text x="1056" y="34" class="mono" font-size="14" fill="${C.yellow}" text-anchor="end">No. 1510</text>
  ${rowEls}
</g></g>
<g class="rise" style="animation-delay:.8s">
  ${caption(690, 470, 430, 58, `<text x="20" y="38" class="bold" font-size="22" fill="${C.ink}"><tspan class="mono" font-size="16" fill="${C.red}">motto() </tspan>LEARN IT. BUILD IT. PUSH IT.</text>`, -1.5)}
</g>`,
  });
}

// ---------- Small section headers ----------
function header(num, text, sub) {
  return svg({ w: 1200, h: 110, fonts: ['anton', 'mono'], title: `${num} ${text}`, body: sectionTitle(num, text, sub, 80) });
}

// ---------- 3. Now (comic strip) ----------
function now() {
  const panels = [
    { tag: 'DSA', bg: C.ink2, big: '1', lines: [[['Solving problems in '], ['C++', 1], [' every']], [['day, from arrays and strings up']], [['to trees and graphs']]] },
    { tag: 'WEB', bg: C.redDark, big: '2', lines: [[['Going from static pages to']], [['interactive, responsive', 1]], [['apps with vanilla JS']]] },
    { tag: 'DATA', bg: C.navy, big: '3', lines: [[['Using '], ['DBMS & SQL', 1], [' to give real']], [['apps real data']]] },
  ];
  const pw = (1080 - 20 - 20) / 3;
  const panelEls = panels.map((p, i) => {
    const x = 10 + i * (pw + 10);
    const text = p.lines.map((segs, k) => `<text x="22" y="${108 + k * 27}" font-size="18">${segs.map(([t, b]) =>
      `<tspan class="${b ? 'bold' : 'body'}" fill="${b ? C.paper : C.paper2}">${esc(t)}</tspan>`).join('')}</text>`).join('');
    return `<g class="rise" style="animation-delay:${(0.15 + i * 0.12).toFixed(2)}s"><g transform="translate(${x} 10)">
      <rect width="${pw}" height="210" fill="${p.bg}" stroke="${C.ink}" stroke-width="3"/>
      <text x="${pw - 16}" y="228" class="display" font-size="130" fill="${C.paper}" fill-opacity="0.1" text-anchor="end">${p.big}</text>
      <rect x="27" y="27" width="${p.tag.length * 14 + 28}" height="34" fill="${C.ink}"/>
      <rect x="22" y="22" width="${p.tag.length * 14 + 28}" height="34" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
      <text x="36" y="46" class="bold" font-size="17" fill="${C.ink}" letter-spacing="1">${p.tag}</text>
      ${text}
    </g></g>`;
  }).join('\n');
  return svg({
    w: 1200, h: 350, fonts: ['anton', 'mono', 'body500', 'body800'],
    title: 'Now: DSA — solving problems in C++ every day, from arrays and strings up to trees and graphs. Web — going from static pages to interactive, responsive apps with vanilla JS. Data — using DBMS & SQL to give real apps real data.',
    body: `
${sectionTitle('03.', 'RIGHT NOW', '$ ./now --verbose')}
<g transform="translate(60 106)">
  <rect width="1080" height="230" fill="${C.paper}"/>
  ${panelEls}
</g>`,
  });
}

// ---------- 4. Git log ----------
function gitLog() {
  const entries = [
    ['+', '0000001', 'hello, world: started B.Tech at LPU'],
    ['+', '3c9e8a1', 'learned C, then C++ and Python'],
    ['+', '7be41d0', 'picked up HTML, CSS & JavaScript'],
    ['+', 'a1f3c2e', 'shipped my portfolio → vijayy1510.github.io'],
    ['!', '???????', 'first big project: loading...'],
  ];
  const lines = entries.map(([sign, hash, msg], i) => {
    const y = 74 + i * 34;
    const last = sign === '!';
    return `<text x="30" y="${y}" class="mono line" font-size="18" style="animation-delay:${(0.4 + i * 0.35).toFixed(2)}s">
      <tspan fill="${last ? C.red : C.yellow}">${sign}</tspan><tspan fill="${last ? C.red : C.cyan}">  ${esc(hash)}</tspan><tspan fill="${last ? C.red : C.paper}">  ${esc(msg)}</tspan></text>`;
  }).join('\n');
  return svg({
    w: 1200, h: 380, fonts: ['anton', 'mono', 'body800'],
    title: 'Git log: started B.Tech at LPU; learned C, then C++ and Python; picked up HTML, CSS & JavaScript; shipped my portfolio at vijayy1510.github.io; first big project: loading...',
    css: `.line{opacity:0;animation:show .01s linear forwards;}@keyframes show{to{opacity:1;}}`,
    body: `
${sectionTitle('04.', 'THE STORY SO FAR', '$ git log --oneline --reverse')}
<g class="rise" style="animation-delay:.1s"><g transform="translate(60 106) rotate(-0.4)">
  <rect x="10" y="12" width="1080" height="250" fill="#000" fill-opacity="0.55"/>
  <rect width="1080" height="250" fill="${C.paper}"/>
  <g transform="translate(12 12)">
    <rect width="1056" height="226" fill="${C.ink}"/>
    <rect width="1056" height="226" fill="url(#dotsLight)"/>
    <rect width="170" height="30" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
    <text x="14" y="21" class="bold" font-size="13" fill="${C.ink}">MAIN · 5 COMMITS</text>
    ${lines}
    <rect x="${30 + 42 * 10.8}" y="${74 + 4 * 34 - 15}" width="10" height="18" fill="${C.red}" class="blink"/>
  </g>
</g></g>`,
  });
}

fs.mkdirSync(OUT, { recursive: true });
const files = {
  'hero.svg': hero(),
  'about.svg': about(),
  'toolbox.svg': header('02.', 'TOOLBOX', '$ ls ~/toolbox'),
  'now.svg': now(),
  'story.svg': gitLog(),
  'stats.svg': header('05.', 'STATS', '$ git stats'),
};
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content);
  console.log(name, (content.length / 1024).toFixed(1) + ' KB');
}
