// Regenera las vistas previas de las demos (public/demos/*.webp) desde el sitio generado.
// Uso: npx nuxt generate && npx serve -l 4173 .output/public  (en otra terminal)
//      node scripts/capturar-demos.mjs http://localhost:4173 public/demos
// Requiere Chromium de Playwright en ~/.cache/ms-playwright.
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const [base, outDir] = process.argv.slice(2)
const ch = spawn(process.env.CHROME || (process.env.HOME + '/.cache/ms-playwright/chromium-1194/chrome-linux/chrome'), ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9344'], { stdio: 'ignore' })
const sleep = ms => new Promise(r => setTimeout(r, ms))
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch('http://127.0.0.1:9344/json')).json(); break } catch { await sleep(200) } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r)
let id = 0; const pend = new Map(); ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id) pend.get(m.id)?.(m) }
const send = (method, params = {}) => Promise.race([new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) }), sleep(10000).then(() => ({}))])
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.result?.value
const hideFloats = `document.querySelectorAll('.wa-float,.cot-float,.nav').forEach(e=>e.style.display='none')`
async function grab(sel, file, pad = 0) {
  const r = await ev(`(()=>{const b=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return {x:b.left+scrollX-${pad}, y:b.top+scrollY-${pad}, w:b.width+${pad * 2}, h:b.height+${pad * 2}}})()`)
  const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 82, captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } })
  writeFileSync(`${outDir}/${file}`, Buffer.from(shot.result.data, 'base64')); console.log(file, Math.round(r.w), 'x', Math.round(r.h))
}
await send('Runtime.enable')
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] })
// POS
await send('Emulation.setDeviceMetricsOverride', { width: 1180, height: 900, deviceScaleFactor: 1.5, mobile: false })
await send('Page.navigate', { url: base + '/demo-punto-de-venta' }); await sleep(2500)
await ev(hideFloats)
await ev(`['Pan amasado','Leche entera','Leche entera','Café instantáneo','Bebida cola'].forEach(n=>[...document.querySelectorAll('.caja-prod')].find(b=>b.textContent.includes(n)).click())`)
await sleep(400)
await grab('.caja', 'pos.webp')
// App: paso de horas
await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 1000, deviceScaleFactor: 2, mobile: false })
await send('Page.navigate', { url: base + '/demo-app-reservas' }); await sleep(2500)
await ev(hideFloats)
await sleep(300)
await grab('.rsv-phone', 'app.webp')
ws.close(); ch.kill(); process.exit(0)
