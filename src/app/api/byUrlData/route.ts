import { sleep } from "@/utils"
import puppeteer from "puppeteer"

// 将cookie字符串解析为cookie对象数组
function parseCookies(cookieString: string, domain: string) {
  return cookieString.split("; ").map((cookie) => {
    const [name, value] = cookie.split("=")
    return { name, value, domain: domain, path: "/" }
  })
}
export async function POST(request: Request) {
  const body = await request.json()
  const { type, url, cookie } = body

  // 启动Puppeteer
  const browser = await puppeteer.launch({
    headless: true, // 是否启用无头模式 是否打开浏览器窗口
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-extensions",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
    ],
  })
  const page = await browser.newPage()
  // 设置用户代理字符串
  await page.setUserAgent(
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
  )

  // 设置浏览器头
  await page.setExtraHTTPHeaders({
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  })

  // 设置视口大小
  await page.setViewport({ width: 1920, height: 1080 })
  const domain = new URL(url).hostname
  // 解析cookie字符串
  const cookies = parseCookies(cookie, domain)
  console.log(cookies)

  // 阻止检测Puppeteer的脚本
  // await page.evaluateOnNewDocument(() => {
  //   // Pass the Webdriver Test.
  //   Object.defineProperty(navigator, "webdriver", {
  //     get: () => false,
  //   })
  //   // Pass the Chrome Test.
  //   window.chrome = {
  //     runtime: {},
  //     // etc.
  //   }
  //   // Pass the Permissions Test.
  //   const originalQuery = window.navigator.permissions.query
  //   window.navigator.permissions.query = (parameters) =>
  //     parameters.name === "notifications"
  //       ? Promise.resolve({ state: Notification.permission })
  //       : originalQuery(parameters)
  //   // Pass the Plugins Length Test.
  //   Object.defineProperty(navigator, "plugins", {
  //     // This just needs to have `length > 0` for the current test,
  //     // but we could mock the plugins too if necessary.
  //     get: () => [1, 2, 3],
  //   })
  //   // Pass the Languages Test.
  //   Object.defineProperty(navigator, "languages", {
  //     get: () => ["en-US", "en"],
  //   })
  // })
  // 设置cookie
  await page.setCookie(...cookies)
  // 导航到目标URL
  await page.goto(url)
  await sleep()
  // 等待页面加载完成
  // await page.waitForNavigation({ waitUntil: "networkidle0" })

  // 截图并返回图片
  const screenshot = await page.screenshot({ encoding: "base64" })

  // await browser.close()

  // res.statusCode = 200
  // res.setHeader("Content-Type", "image/png")
  // res.end(Buffer.from(screenshot, "base64"))
  // 获取对应class的值
  const { like, collect, reds } = await page.evaluate(() => {
    const element = document.querySelectorAll(".interact-container .count")
    const like = element[0].innerHTML
    const collect = element[1].innerHTML
    const reds = element[2].innerHTML
    return { like, collect, reds }
  })

  await browser.close()

  return new Response(JSON.stringify({ data: { url, like, collect, reds } }), {
    status: 200,
  })

  return new Response(JSON.stringify({ type, url }), { status: 200 })
}
