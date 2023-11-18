import useHackavoteProjects from "hooks/useHackavoteProjects";
import {HackathonProject} from "types";
import {Link} from "react-router-dom";

const ProjectCard = ({project}: {
  project: HackathonProject
}) => {
  return (
    <div className="w-full m-10 md:w-80 rounded-xl bg-gray-600 p-5">
      <Link to={'/project/' + project.index} className="flex flex-col items-start">
        <img className="rounded-t-xl h-3/4 w-full object-cover" alt="project"
             src='/img/project-image-placeholder.png'/>
        <div className="text-font-color my-2">A short description about the project</div>
        <button className="bg-blue-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Vote
        </button>
      </Link>
    </div>
  )
}

const Home = () => {
  const {projects} = useHackavoteProjects()
  return (
    <div className="flex flex-wrap">
      {projects?.map((project) => <ProjectCard project={project} key={project.index}/>)}
    </div>
  );
};

export default Home;
