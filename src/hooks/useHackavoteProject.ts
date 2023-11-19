import {useMemo} from "react";
import {useProjectsContext} from "contexts/ProjectsContext";

export default function useHackavoteProject(projectSlug: string | undefined) {
  const {projects} = useProjectsContext()
  return {
    project: useMemo(() => projects?.find(project => project.submissionInfoSlug === projectSlug), [projectSlug, projects])
  }
}
