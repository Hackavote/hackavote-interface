import {defineConfig} from '@wagmi/cli';
import {react} from '@wagmi/cli/plugins';
import {Abi} from 'viem';

import HackavoteProjectsABI from './src/abis/hackavoteProjects.json';

export default defineConfig({
  out: 'src/abis/types/generated.ts',
  contracts: [
    {
      name: 'HackavoteProjects',
      abi: HackavoteProjectsABI as Abi,
    }
  ],
  plugins: [react()],
});
