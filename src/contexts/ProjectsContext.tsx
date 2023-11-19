import React, {createContext, ReactNode, useContext} from 'react';
import useHackavoteProjects from "hooks/useHackavoteProjects";

// Define the context
const ProjectsContext = createContext<(ReturnType<typeof useHackavoteProjects>) | null>(null);

interface ProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const ProjectsContextProvider: React.FC<ProviderProps> = ({children}) => {
  const data = useHackavoteProjects()
  return (
    <ProjectsContext.Provider
      value={data}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (context === null) {
    throw new Error('ProjectsContext must be used within a ProjectsContextProvider');
  }
  return context;
};
