import {useParams} from "react-router-dom";
import useHackavoteProject from "hooks/useHackavoteProject";
import Spinner from "components/Spinner";
import {AddressZero, votingDeadline} from "constants/index";
import {copyToClipboard} from "utils/copyToClipboard";
import {Dispatch, SetStateAction, useCallback, useMemo, useState} from 'react';
import Slider from 'react-input-slider';
import useProjectDetails from "hooks/useProjectDetails";
import {useAccount} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import useTaco from "hooks/useTaco";
import {prepareWriteContract, waitForTransaction, writeContract} from '@wagmi/core';
import {useContractAddress} from "hooks/useContractAddress";
import {HACKAVOTE_CONTRACT_ADDRESS_MAP} from "constants/addresses";
import {hackavoteABI} from "abis/types/generated";
import {toHexString} from "@nucypher/taco";
import {TransactionState} from "types";
import {IS_DEV} from "utils/env";

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
    <label className="pl-1.5 whitespace-nowrap" htmlFor={`${setName}-no-idea`}>
      No idea
    </label>
  </div>
);

export function ProjectRatingForm({projectSlug}: { projectSlug: string }) {
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

  const {address} = useAccount()

  const opinion = useMemo(() => {
    const technicalityOpinion = techChecked ? '' : technicality
    const originalityOpinion = oriChecked ? '' : originality
    const practicalityOpinion = practChecked ? '' : practicality
    const usabilityOpinion = usaChecked ? '' : usability
    const wowFactorOpinion = wowChecked ? '' : wowFactor
    return `${projectSlug},${technicalityOpinion},${originalityOpinion},${practicalityOpinion},${usabilityOpinion},${wowFactorOpinion}`
  }, [oriChecked, originality, practChecked, practicality, projectSlug, techChecked, technicality, usaChecked, usability, wowChecked, wowFactor]);

  const {encryptDataForTime} = useTaco()
  const hackavoteContractAddress = useContractAddress(HACKAVOTE_CONTRACT_ADDRESS_MAP)
  const [txState, setTxState] = useState(TransactionState.INITIAL)
  const submitVote = useCallback(async () => {
    if (txState !== TransactionState.INITIAL) return
    try {
      setTxState(TransactionState.PREPARING_TRANSACTION)
      const encryptedData = await encryptDataForTime(opinion, IS_DEV ? Math.floor(+new Date() / 1000) + 30 : votingDeadline)
      if (encryptedData) {
        const data: `0x${string}` = `0x${toHexString(encryptedData.toBytes())}`
        const {request} = await prepareWriteContract({
          address: hackavoteContractAddress,
          abi: hackavoteABI,
          functionName: 'submitOpinion',
          args: [data]
        })
        setTxState(TransactionState.AWAITING_USER_APPROVAL)
        const {hash} = await writeContract(request);
        setTxState(TransactionState.AWAITING_TRANSACTION)
        await waitForTransaction({
          hash,
        });
        alert('Vote submitted successfully!');
      }
    } catch (e) {
      alert("Error: " + String(e))
    }
    setTxState(TransactionState.INITIAL)
  }, [encryptDataForTime, hackavoteContractAddress, opinion, txState]);

  return (
    <div className="project-page-section">
      <h3 className="project-page-section-title">Your Vote</h3>
      <div className="flex flex-col w-full justify-center items-center">
        {ratings.map((rating) => <RatingSlider {...rating} />)}
        {address ? <button onClick={submitVote} className="btn-primary mt-4" type="submit">
          {txState === TransactionState.AWAITING_TRANSACTION ? 'Waiting for transaction...' : txState === TransactionState.AWAITING_USER_APPROVAL ? 'Waiting for user approval' : txState === TransactionState.PREPARING_TRANSACTION ? 'Loading' : 'Submit'}
        </button> : <ConnectButton/>}
      </div>
    </div>
  );
}

const Project = () => {
  const {projectSlug} = useParams()
  const {project} = useHackavoteProject(projectSlug)
  const {projectInfo} = useProjectDetails(project?.submissionInfoSlug)
  return (project && projectInfo) ? (
    <div className="p-10">
      <div className="w-full">
        <p className="text-center font-bold text-3xl">{projectInfo.title || 'Unknown Project'}</p>
        <p className="py-2 text-center">
          {projectInfo.shortDescription}
        </p>
      </div>
      <div className="flex justify-around flex-wrap">
        <div className="project-meta">
          <p className="project-meta-title">View on ETHGlobal</p>
          <a href={project.submissionInfoSlug}
             className="project-meta-value">{project.submissionInfoSlug}</a>
        </div>
        <div className="project-meta">
          <p className="project-meta-title">Source Code</p>
          <a href={projectInfo.sourceCode}
             className="project-meta-value">{projectInfo.sourceCode}</a>
        </div>
        {projectInfo.liveDemo && <div className="project-meta">
            <p className="project-meta-title">Live Demo</p>
            <a href={projectInfo.liveDemo}
               className="project-meta-value">{projectInfo.liveDemo}</a>
        </div>}
        <div className="project-meta">
          <p className="project-meta-title">Contact and Social Media</p>
          {project.socialMediaUrl ?
            <a href={project.socialMediaUrl} className="project-meta-value">{project.socialMediaUrl}</a> : <p
              className="project-meta-value">Not provided yet</p>}
        </div>
        <div className="project-meta">
          <p className="project-meta-title">Donation Address</p>
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
      <div className="flex flex-wrap">
        <div className="project-page-section">
          <h3 className="project-page-section-title">Project Description</h3>
          <p className="leading-normal">
            {projectInfo.description}
          </p>
        </div>
        <div className="project-page-section">
          <h3 className="project-page-section-title">How it's made</h3>
          <p className="leading-normal">
            {projectInfo.howItsMade}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="project-page-section">
          <h3 className="project-page-section-title">Voting Guide</h3>
          <p className="leading-normal">
            - If you need gas, visit <a className="link" href="https://www.gnosisfaucet.com/" target="_blank"
                                        rel="noreferrer">gnosis faucet.</a><br/>
            - You can follow the
            ETHGlobal&apos;s <a className="link"
                                target="_blank"
                                href="https://ethglobal.com/events/istanbul/info/details#judging-criteria"
                                rel="noreferrer">judgement
            criteria</a> to know about the voting parameters.<br/>
            - <span className="font-bold text-red-700">IMPORTANT:</span> if possible, please use the same wallet that
            you&apos;re going to
            receive the
            Hackathon&apos;s POAP on, so your vote can be easily verified. Otherwise, you should sign your ratings with
            that wallet address later<br/>
            - You can rate different aspects of the project from 0 to 100. If you don&apos;t want to rate on a category,
            press "No idea".<br/>
            - You can&apos;t view your ratings until the voting deadline. (They are encrypted on chain with <a
            className="link" target="_blank" href="https://linktr.ee/thresholdaccesscontrol" rel="noreferrer">Threshold
            Access Control</a>. If you want to edit your ratings, submit a new rating and your previous one will be
            ignored.
          </p>
        </div>
        <ProjectRatingForm projectSlug={project.submissionInfoSlug}/>
      </div>
    </div>
  ) : <Spinner/>;
};

export default Project; /* Rectangle 18 */
