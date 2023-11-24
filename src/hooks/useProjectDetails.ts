import {useEffect, useState} from "react";
import axios from "axios";
import parse from "node-html-parser";

export type ProjectInfo = {
  title: string | undefined;
  shortDescription: string | undefined;
  sourceCode: string | undefined;
  liveDemo: string | undefined;
  description: string | undefined;
  howItsMade: string | undefined;
}
export default function useProjectDetails(submissionInfoSlug: string | undefined) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | undefined>(undefined)

  useEffect(() => {
    async function getData() {
      if (submissionInfoSlug) {
        try {
          const response = await axios.get('/ethglobal/showcase/' + submissionInfoSlug)
          const dom = parse(response.data)
          const title = dom.querySelector("header h1.text-4xl.max-w-2xl.mb-4")?.textContent
          const shortDescription = dom.querySelector("header p.text-black-500.clamp-3")?.textContent
          const sourceCode = dom.querySelector("header div a.bg-transparent")?.getAttribute('href')
          const liveDemo = dom.querySelector("header div a.bg-black")?.getAttribute('href')
          const [description, howItsMade] = dom.querySelectorAll("div#__next div div.relative.max-w-7xl.mx-auto.px-6.w-full.py-12 div div.flex-1.space-y-8.text-black-700 div p.mt-4.mb-2")?.map(el => el.textContent)
          setProjectInfo({
            title,
            shortDescription,
            sourceCode,
            liveDemo,
            description,
            howItsMade,
          })
        } catch (e) {
          console.log(e)
          setProjectInfo({
            title: undefined,
            shortDescription: undefined,
            sourceCode: undefined,
            liveDemo: undefined,
            description: undefined,
            howItsMade: undefined,
          })
        }
      }
    }

    getData()
  }, [submissionInfoSlug]);

  return {
    projectInfo
  }
}
