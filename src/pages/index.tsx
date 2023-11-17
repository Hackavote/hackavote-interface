import {ConnectButton} from "@rainbow-me/rainbowkit";
import useHackavoteProjects from "hooks/useHackavoteProjects";


const Home = () => {
  const {projects} = useHackavoteProjects()
  return (
    <div>
      <ConnectButton/>
      {JSON.stringify(projects)}
    </div>
  );
};

export default Home; /* Rectangle 18 */
