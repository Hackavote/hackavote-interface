import {useParams} from "react-router-dom";
import useHackavoteProject from "hooks/useHackavoteProject";
import Spinner from "components/Spinner";
import {AddressZero} from "constants/index";
import {copyToClipboard} from "utils/copyToClipboard";
import {Dispatch, SetStateAction, useState} from 'react';
import Slider from 'react-input-slider';

type RatingSliderParams = {
  setName: string,
  setValue: Dispatch<SetStateAction<number>>,
  value: number,
  isChecked: boolean,
  setIsChecked: Dispatch<SetStateAction<boolean>>
}

const RatingSlider = ({
                        setName,
                        setValue,
                        value,
                        isChecked,
                        setIsChecked
                      }: RatingSliderParams) => (
  <div className="flex items-center mb-4">
    <label className="mr-2 w-28" htmlFor={setName}>
      {setName}:
    </label>
    <Slider
      axis="x"
      x={value}
      onChange={({x}) => setValue(x)}
      disabled={isChecked}
      styles={{
        track: {
          backgroundColor: '#ccc',
        },
        active: {
          backgroundColor: '#2196f3',
        },
        thumb: {
          width: 20,
          height: 20,
        },
        disabled: {
          opacity: 0.5,
          cursor: 'not-allowed'
        },
      }}
    />
    <input
      className={`ml-2 bg-gray-800 border-2 border-gray-600 p-0.5 text-center rounded w-12 ${isChecked ? 'opacity-70 cursor-not-allowed' : ''}`}
      type="number"
      min={0}
      max={100}
      value={value}
      disabled={isChecked}
      onChange={(e) => setValue(Number(e.target.value))}
    />
    <input
      type="checkbox"
      id={`${setName}-no-idea`}
      checked={isChecked}
      className="ml-2"
      onChange={() => {
        setIsChecked(!isChecked);
      }}
    />
    <label className="pl-1.5" htmlFor={`${setName}-no-idea`}>
      No idea
    </label>
  </div>
);

export function ProjectRatingForm() {
  const [technicality, setTechnicality] = useState<number>(50);
  const [originality, setOriginality] = useState<number>(50);
  const [practicality, setPracticality] = useState<number>(50);
  const [usability, setUsability] = useState<number>(50);
  const [wowFactor, setWowFactor] = useState<number>(50);

  const [techChecked, setTechChecked] = useState<boolean>(false);
  const [oriChecked, setOriChecked] = useState<boolean>(false);
  const [practChecked, setPractChecked] = useState<boolean>(false);
  const [usaChecked, setUsaChecked] = useState<boolean>(false);
  const [wowChecked, setWowChecked] = useState<boolean>(false);

  const ratings: RatingSliderParams[] = ([
    ["Technicality", setTechnicality, technicality, techChecked, setTechChecked],
    ["Originality", setOriginality, originality, oriChecked, setOriChecked],
    ["Practicality", setPracticality, practicality, practChecked, setPractChecked],
    ["Usability", setUsability, usability, usaChecked, setUsaChecked],
    ["WOW Factor", setWowFactor, wowFactor, wowChecked, setWowChecked],
  ] as [string,
    Dispatch<SetStateAction<number>>,
    number,
    boolean,
    Dispatch<SetStateAction<boolean>>][]).map((rating) => ({
    setName: rating[0],
    setValue: rating[1],
    value: rating[2],
    isChecked: rating[3],
    setIsChecked: rating[4],
  }));

  return (
    <form className="p-5 flex flex-col w-full justify-center items-center">
      {ratings.map((rating) => <RatingSlider {...rating} />)}
      <button className="btn-primary mt-4" type="submit">
        Submit
      </button>
    </form>
  );
}

const Project = () => {
  const {projectId} = useParams()
  const {project} = useHackavoteProject(projectId)

  return project ? (
    <div className="p-10">
      <div className="flex flex-wrap flex-col-reverse md:flex-row justify-between">
        <div className="min-w-[400px] w-full md:w-1/3 p-5 flex flex-wrap">
          <div className="w-full">
            <p className="text-center font-bold text-3xl">Project Title</p>
            <p className="py-2">
              A short description about the project
            </p>
          </div>
          <div className="project-meta">
            <p>Eth Global submission</p>
            <a href={project.submissionInfoUrl}
               className="project-meta-value">{project.submissionInfoUrl}</a>
          </div>
          <div className="project-meta">
            <p>Contact and Social Media</p>
            {project.socialMediaUrl ? <a className="project-meta-value">{project.socialMediaUrl}</a> : <p
              className="project-meta-value">Not provided yet</p>}
          </div>
          <div className="project-meta">
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
        <img alt="project" className="w-auto h-96"
             src='/img/project-image-placeholder.png'/>
      </div>
      <ProjectRatingForm/>
    </div>
  ) : <Spinner/>;
};

export default Project; /* Rectangle 18 */
