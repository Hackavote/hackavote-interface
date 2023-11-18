import {useParams} from "react-router-dom";
import useHackavoteProject from "hooks/useHackavoteProject";

const Project = () => {
  const {projectId} = useParams()
  const {project} = useHackavoteProject(projectId)
  return (
    <div>
      {JSON.stringify(project)}
      Technicality - What is the complexity of problem being addressed, or their approach to solving it?

      Originality - Is the project tackling a new or unsolved problem, or creating unique/creative solution to an
      existing problem?

      Practicality - How complete/functional is the project? Is it ready to be used by their intended audience?

      Usability (UI/UX/DX) - Is the project easy to use? Has the team made good effort in removing friction for the
      user?

      WOW factor - Catch-all for other factors the previous categories may have missed
    </div>
  );
};

export default Project; /* Rectangle 18 */
