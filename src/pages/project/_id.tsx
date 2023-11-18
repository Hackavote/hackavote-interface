import {useParams} from "react-router-dom";
import useHackavoteProject from "hooks/useHackavoteProject";
import Spinner from "components/Spinner";
import {AddressZero} from "constants/index";
import {copyToClipboard} from "utils/copyToClipboard";

const Project = () => {
  const {projectId} = useParams()
  const {project} = useHackavoteProject(projectId)
  return project ? (
    <div className="p-10">
      <div className="flex flex-wrap">
        <img alt="project" className="w-2/3 m-auto"
             src='/img/project-image-placeholder.png'/>
        <div className="min-w-[400px] w-1/3 p-5 flex-col">
          <div>
            <p className="text-center font-bold text-3xl">Project Title</p>
            <p className="py-2">
              A short description about the project
            </p>
          </div>
          <div className="pt-5">
            <p>Eth Global submission</p>
            <a href={project.submissionInfoUrl}
               className="project-meta-value">{project.submissionInfoUrl}</a>
          </div>
          <div>
            <p>Contact and Social Media</p>
            {project.socialMediaUrl ? <a className="project-meta-value">{project.socialMediaUrl}</a> : <p
              className="project-meta-value">Not provided yet</p>}
          </div>
          <div>
            <p>Donation Address</p>
            <p
              onClick={() => {
                if (project && project.donationAddress !== AddressZero) {
                  copyToClipboard(project.donationAddress)
                  alert('Copied!')
                }
              }}
              className={`project-meta-value ${project.donationAddress !== AddressZero ? 'cursor-pointer' : ''}`}>{project.donationAddress === AddressZero ? 'Not provided yet' : project.donationAddress}</p>
          </div>
        </div>
      </div>
    </div>
  ) : <Spinner/>;
};

export default Project; /* Rectangle 18 */
