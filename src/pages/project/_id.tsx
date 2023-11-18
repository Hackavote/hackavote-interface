import {useParams} from "react-router-dom";
import useHackavoteProject from "hooks/useHackavoteProject";

const Project = () => {
  const {projectId} = useParams()
  const {project} = useHackavoteProject(projectId)
  return (
    <div>
      {JSON.stringify(project)}
    </div>
  );
};

export default Project; /* Rectangle 18 */
