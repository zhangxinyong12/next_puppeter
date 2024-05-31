"use client"
import { sleep } from "@/utils"
import { Button } from "antd"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [imgBase64, setImgBase64] = useState<string>()
  const [urls, setUrls] = useState<string[]>([
    "https://www.xiaohongshu.com/explore/66403829000000001e01f035",
    "https://www.xiaohongshu.com/explore/6651800800000000050047f0",
    "https://www.xiaohongshu.com/explore/663c5a6a000000001e0277e5",
    "https://www.xiaohongshu.com/explore/664d87270000000016010900",
  ])
  const [dataList, setDataList] = useState<
    { like: number; collect: number; reds: number; url: string }[]
  >([])
  async function handleClick() {
    setDataList([])
    console.log("click")
    for (let i = 0; i < urls.length; i++) {
      await fetch("/api/byUrlData", {
        method: "POST",
        body: JSON.stringify({
          url: "https://www.xiaohongshu.com/explore/66403829000000001e01f035",
          type: "XHS",
          cookie:
            "abRequestId=0b14aacd-ffad-5254-add6-163c2bd3048f; xsecappid=xhs-pc-web; a1=18d789359327lirq5g7dpwz2eaxl9lxn9yi8zkb7d50000394916; webId=c8ddef3b93dcee0277c654a6c01f506d; gid=yYfWYjqKKYjSyYfWYjq2jvTDqJW13FA2kWfU3WfEuJd0CY281j1CIu888qj4jyK80j4Kqqy2; customerClientId=952063472484810; customer-sso-sid=6647379b360000000000000503557889911bcdd8; x-user-id-ad.xiaohongshu.com=658539566100000000000003; webBuild=4.18.0; acw_tc=4765482f1f24265a4d6e1e0b7edeb0e57e9d9d895dd4e0cf4f36b5974f94afe1; websectiga=6169c1e84f393779a5f7de7303038f3b47a78e47be716e7bec57ccce17d45f99; sec_poison_id=970cd17b-f1e8-46f1-bc28-eb86141fb807; web_session=0400698f6e15a2566921a7256c344b444f07bd",
          // "a1=18d789359327lirq5g7dpwz2eaxl9lxn9yi8zkb7d50000394916; webId=c8ddef3b93dcee0277c654a6c01f506d; web_session=0400698f6e15a2566921a7256c344b444f07bd",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          setDataList((vals) => [
            {
              like: res.data.like,
              collect: res.data.collect,
              reds: res.data.reds,
              url: res.data.url,
            },
            ...vals,
          ])

          return Promise.resolve(res.data)
        })

      await sleep(1500)
    }
  }

  return (
    <main>
      <div className="flex gap-4">
        <Button onClick={handleClick}>测试</Button>
        <Button type="primary">测试2</Button>
      </div>
      {/* <div className="w-[1920px] overflow-y-auto"> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img src={`data:image/png;base64,${imgBase64}`} width={1920} alt="" /> */}
      {/* </div> */}
      {
        <div>
          {dataList.map((data, index) => (
            <div className="flex gap-4" key={data.url}>
              <span>链接地址：{data.url}</span>
              <span>点赞：{data.like}</span>
              <span>收藏：{data.collect}</span>
              <span>评论：{data.reds}</span>
            </div>
          ))}
        </div>
      }
    </main>
  )
}
