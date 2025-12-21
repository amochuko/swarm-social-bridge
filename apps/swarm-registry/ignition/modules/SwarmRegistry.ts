import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SwarmRegistryModule", (m) => {
  const swarmRegistry = m.contract('SwarmRegistry');



  return { swarmRegistry };
});
