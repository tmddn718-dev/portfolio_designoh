// 반응형 QA: 라우트 × 뷰포트에서 콘솔 오류·실패 요청·가로 오버플로·깨진 이미지·폰트 로딩·작은 글자·터치 영역을 검사하고 스크린샷을 저장한다.
// 사용: npm run dev -- --port 5174 (다른 터미널) 후  node scripts/qa.mjs <출력폴더>   (기본: Google Chrome 사용, CHROME 환경변수로 경로 변경)
import { chromium } from 'playwright-core'
import fs from 'fs'
const OUT=process.argv[2]||'before'
const base='http://localhost:5174'
const routes=['/','/work/oliveyoung-todaydream','/work/karrot-large-furniture','/work/nodi','/work/woorisai','/work/trigr','/about','/nope']
const vps=[[320,700],[390,844],[430,932],[768,1024],[1280,800],[1440,900],[1920,1080]]
fs.mkdirSync(`${OUT}/shots`,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const res=[]
for(const [w,h] of vps){
  const ctx=await browser.newContext({viewport:{width:w,height:h}})
  for(const r of routes){
    const page=await ctx.newPage()
    const errs=[],fails=[]
    page.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,160))})
    page.on('pageerror',e=>errs.push('PAGEERROR '+String(e).slice(0,160)))
    page.on('requestfailed',q=>{const u=q.url();if(!/aborted|ERR_ABORTED/.test(q.failure()?.errorText||''))fails.push(u.slice(0,120)+' '+q.failure()?.errorText)})
    page.on('response',s=>{if(s.status()>=400)fails.push(s.url().slice(0,120)+' '+s.status())})
    await page.goto(base+r,{waitUntil:'networkidle'}).catch(()=>{})
    await page.waitForTimeout(1200)
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}'})
    // scroll through to trigger lazy loads
    const H=await page.evaluate(()=>document.documentElement.scrollHeight)
    for(let y=0;y<H;y+=Math.max(300,h*0.8)){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60)}
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(400)
    const info=await page.evaluate(()=>{
      const vw=innerWidth
      const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src).map(i=>i.src.split('/').slice(-2).join('/'))
      const pending=[...document.images].filter(i=>!i.complete).length
      const font=document.fonts.check('16px "Pretendard Variable"')
      const ffam=getComputedStyle(document.body).fontFamily.slice(0,60)
      const over=[...document.querySelectorAll('main *, header *, footer *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>vw+2&&getComputedStyle(e).position!=='fixed'&&!e.closest('[class*=overflow-x],[class*=overflow-hidden],.strip,.mobile-story-rail,dialog,[aria-hidden=true]')&&!e.closest('ol[role=region]')}).slice(0,4).map(e=>e.tagName+'.'+String(e.className).slice(0,40)+' r'+Math.round(e.getBoundingClientRect().right))
      const small=[...document.querySelectorAll('main *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<12&&e.offsetParent&&!e.closest('[aria-hidden=true]')).length
      const tap=[...document.querySelectorAll('a,button,summary')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.height<30&&e.offsetParent&&!e.matches('.sr-only,[class*=sr-only]')&&getComputedStyle(e).clip!=='rect(0px, 0px, 0px, 0px)'}).slice(0,3).map(e=>(e.textContent.trim()||e.tagName).slice(0,12)+'|'+Math.round(e.getBoundingClientRect().height))
      return {docW:document.documentElement.scrollWidth,vw,H:document.documentElement.scrollHeight,broken,pending,font,ffam,over,small,tap}
    })
    const key=`${w}x${h}${r.replace(/\//g,'_')}`
    await page.screenshot({path:`${OUT}/shots/${key}.png`})
    res.push({vp:`${w}x${h}`,route:r,errs:[...new Set(errs)].slice(0,3),fails:[...new Set(fails)].slice(0,3),...info})
    await page.close()
  }
  await ctx.close()
}
await browser.close()
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(res,null,1))
const bad=res.filter(x=>x.docW>x.vw+1||x.broken.length||x.errs.length||x.fails.length||x.over.length||x.pending)
console.log('total',res.length,'issues',bad.length)
for(const b of bad)console.log(b.vp,b.route,'docW',b.docW,'broken',b.broken.join(','),'errs',b.errs.join(' | '),'fails',b.fails.join(' | '),'over',b.over.join(' ; '),'pending',b.pending)
console.log('fontLoaded false:',res.filter(x=>!x.font).length,'small>0:',res.filter(x=>x.small>0).map(x=>x.vp+x.route+':'+x.small).slice(0,8).join(' '),'tap:',res.filter(x=>x.tap.length).map(x=>x.vp+x.route+':'+x.tap.join('/')).slice(0,6).join(' '))
