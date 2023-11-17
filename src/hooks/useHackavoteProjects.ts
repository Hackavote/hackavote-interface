import {useContractAddress} from "hooks/useContractAddress";
import {HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP} from "constants/addresses";
import {
  hackavoteProjectsABI,
  useHackavoteProjectsGetProjectsLength,
  useHackavoteProjectsProjects
} from "abis/types/generated";
import {useEffect, useState} from "react";
import {multicall} from '@wagmi/core';

export default function useHackavoteProjects() {
  const hackavoteProjectsContractAddress = useContractAddress(HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP)
  const {data: projectsLength} = useHackavoteProjectsGetProjectsLength({
    address: hackavoteProjectsContractAddress
  })
  const [projects, setProjects] = useState<ReturnType<typeof useHackavoteProjectsProjects> ['data']>(undefined)

  useEffect(() => {
    if (projectsLength === undefined) return;
    if (projectsLength === 0n) setProjects([])

    const indexes = Array.from(Array(Number(projectsLength)))
    multicall({
      allowFailure: false,
      contracts: indexes.map((index) => ({
        address: hackavoteProjectsContractAddress,
        abi: hackavoteProjectsABI,
        functionName: 'projects',
        args: [index]
      }))
    }).then((res) => setProjects(res))
  }, [hackavoteProjectsContractAddress, projectsLength]);

  return {
    projects
  }
}
