import {useContractAddress} from "hooks/useContractAddress";
import {HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP} from "constants/addresses";
import {hackavoteProjectsABI, useHackavoteProjectsGetProjectsLength} from "abis/types/generated";
import {useEffect, useState} from "react";
import {multicall} from '@wagmi/core';
import {HackathonProject} from "types";

export default function useHackavoteProjects() {
  const hackavoteProjectsContractAddress = useContractAddress(HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP)
  const {data: projectsLength} = useHackavoteProjectsGetProjectsLength({
    address: hackavoteProjectsContractAddress
  })
  const [projects, setProjects] = useState<HackathonProject[] | undefined>(undefined)

  useEffect(() => {
    if (!hackavoteProjectsContractAddress || projectsLength === undefined) return;
    if (projectsLength === 0n) {
      setProjects([])
      return;
    }
    const indexes = Array.from(Array(Number(projectsLength)).keys())
    multicall({
      allowFailure: false,
      contracts: indexes.map((index) => ({
        address: hackavoteProjectsContractAddress,
        abi: hackavoteProjectsABI,
        functionName: 'projects',
        args: [BigInt(index)]
      }))
    }).then((res) => setProjects(res.map((projectData, index) => ({
          index,
          author: projectData[0],
          donationAddress: projectData[1],
          submissionInfoSlug: projectData[2],
          socialMediaUrl: projectData[3]
        }))
      )
    )
  }, [hackavoteProjectsContractAddress, projectsLength]);

  return {
    projects
  }
}
