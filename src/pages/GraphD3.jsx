import * as d3 from 'd3';
import { Box } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import ProjectList from '../components/ProjectList';
import ForceGraphD3 from '../components/ForceGraphD3';

export default function GraphD3() {
  const [selectedProject, setSelectedProject] = useState('');

  function handleSelectChange(e) {
    setSelectedProject(e.target.value);
  }

  const nodes = useMemo(
    () =>
      d3.range(50).map(n => {
        return { id: n, r: 5 };
      }),
    []
  );

  return (
    <Box>
      <ProjectList handleSelectChange={handleSelectChange} />
      <h1>{selectedProject}</h1>
      <svg width="800" height="600">
        <ForceGraphD3 nodes={nodes} charge={-0} />
      </svg>
    </Box>
  );
}
