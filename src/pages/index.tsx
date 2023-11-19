import {HackathonProject} from "types";
import {useProjectsContext} from "contexts/ProjectsContext";
import useProjectDetails from "hooks/useProjectDetails";
import Spinner from "components/Spinner";
import {Link} from "react-router-dom";

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
          <p className="text-font-color my-2 h-24 w-full">{projectInfo.shortDescription}</p>
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
  return (
    <div className="flex flex-wrap">
      {projects?.map((project) => <ProjectCard project={project} key={project.index}/>)}
    </div>
  );
};

export default Home;
