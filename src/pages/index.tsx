import {HackathonProject} from "types";
import {useProjectsContext} from "contexts/ProjectsContext";
import useProjectDetails from "hooks/useProjectDetails";
import Spinner from "components/Spinner";
import {Link} from "react-router-dom";
import {useEffect, useMemo} from "react";
import {shuffleArray} from "utils";
import {hackavoteABI} from "abis/types/generated";
import {useContractAddress} from "hooks/useContractAddress";
import {HACKAVOTE_CONTRACT_ADDRESS_MAP} from "constants/addresses";
import {multicall, readContract} from '@wagmi/core'
import useTaco from "hooks/useTaco";
import {fromHexString} from "@nucypher/shared";
import {IS_DEV} from "utils/env";

const ProjectCard = ({project}: {
  project: HackathonProject
}) => {
  const {projectInfo} = useProjectDetails(project.submissionInfoSlug)
  return (
    <div className="w-full m-10 md:w-80 rounded-xl bg-gray-600 p-5">
      {
        projectInfo ? <Link to={'/p/' + project.submissionInfoSlug} className="flex flex-col items-start">
          <img className="rounded-t-xl h-3/4 w-full object-cover" alt="project"
               src='/img/project-image-placeholder.png'/>
          <p className="text-2xl font-bold my-2">{projectInfo.title}</p>
          <p className="text-font-color text-sm h-20 w-full truncate-multiline mb-3">{projectInfo.shortDescription}</p>
          <button className="btn-primary">
            View Details
          </button>
        </Link> : <Spinner/>
      }
    </div>
  )
}

const Home = () => {
  const {projects} = useProjectsContext()
  const projectsShuffled = useMemo(() => projects ? shuffleArray(projects) : undefined, [projects]);

  const hackavoteContractAddress = useContractAddress(HACKAVOTE_CONTRACT_ADDRESS_MAP)
  const {decryptData, isInit} = useTaco()
  useEffect(() => {
    async function getData() {
      if (!hackavoteContractAddress || !isInit) return
      const hackerCount = await readContract({
        address: hackavoteContractAddress,
        abi: hackavoteABI,
        functionName: 'getHackerCount'
      })
      const hackerAddresses = await multicall({
        allowFailure: false,
        contracts: Array.from(Array(Number(hackerCount)).keys()).map(i => ({
          address: hackavoteContractAddress,
          abi: hackavoteABI,
          functionName: 'hackers',
          args: [BigInt(i)]
        }))
      })
      const data = await Promise.all(
        hackerAddresses.map(async (a) => {
          const opinionCount = await readContract({
            address: hackavoteContractAddress,
            abi: hackavoteABI,
            functionName: 'getOpinionCountOfHacker',
            args: [a]
          })
          const opinions = await multicall({
            allowFailure: false,
            contracts: Array.from(Array(Number(opinionCount)).keys()).map(i => ({
              address: hackavoteContractAddress,
              abi: hackavoteABI,
              functionName: 'getOpinionOfHackerAtIndex',
              args: [a, BigInt(i)]
            }))
          })
          const opinionsDecrypted = await Promise.all(
            opinions.map(o => decryptData(fromHexString(o)))
          )
          return opinionsDecrypted;
        })
      )
      console.log(hackerAddresses.map((hacker, i) => ({
        hacker,
        opinions: data[i]
      })))
    }

    if (IS_DEV) {
      getData()
    }
  }, [hackavoteContractAddress, decryptData, isInit]);

  return (
    <div className="flex flex-wrap">
      {projectsShuffled?.map((project) => <ProjectCard project={project} key={project.index}/>)}
    </div>
  );
};

export default Home;
