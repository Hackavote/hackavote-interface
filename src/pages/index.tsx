import useHackavoteProjects from "hooks/useHackavoteProjects";
import {HackathonProject} from "types";
import {Link} from "react-router-dom";

const ProjectCard = ({project}: {
  project: HackathonProject
}) => {
  return (
    <Link to={'/project/' + project.index}>
      {project.submissionInfoUrl}
    </Link>
  )
}

const Home = () => {
  const {projects} = useHackavoteProjects()
  return (
    <div>
      {projects?.map((project) => <ProjectCard project={project} key={project.index}/>)}
    </div>
  );
};

export default Home; /* Rectangle 18 */
