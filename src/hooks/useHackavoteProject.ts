import {useContractAddress} from "hooks/useContractAddress";
import {HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP} from "constants/addresses";
import {useHackavoteProjectsProjects} from "abis/types/generated";
import {useMemo} from "react";
import {HackathonProject} from "types";

export default function useHackavoteProject(projectId: string | undefined) {
  const hackavoteProjectsContractAddress = useContractAddress(HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP)
  const {data: projectData} = useHackavoteProjectsProjects({
    address: hackavoteProjectsContractAddress,
    args: projectId ? [BigInt(projectId)] : undefined,
  })
  const project: HackathonProject | undefined = useMemo(() => {
    if (!projectData) return undefined
    return {
      index: Number(projectId),
      author: projectData[0],
      donationAddress: projectData[1],
      submissionInfoUrl: projectData[2],
      socialMediaUrl: projectData[3]
    }
  }, [projectId, projectData]);
  return {
    project
  }
}
