import {
  Box,
  Button,
  Flex,
  HStack,
  Select,
  Slider,
  Spinner,
  Stack,
  VStack,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  StackDivider,
} from '@chakra-ui/react';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as api from 'strateegia-api';
import { gatherGraphData } from '../data/graphData';
import PropertiesForm from '../components/PropertiesForm';

export default function Graph() {
  const graphRef = useRef();

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const forceProperties = {
    center: {
      enabled: true,
      x: 10,
      y: 10,
      strength: 50,
    },
    charge: {
      enabled: true,
      strength: -50,
      distanceMin: 30,
      distanceMax: 40,
    },
    collide: {
      enabled: true,
      strength: 0.5,
      iterations: 10,
      radius: 10,
    },
    forceX: {
      enabled: false,
      strength: 0.1,
      x: 0.5,
    },
    forceY: {
      enabled: false,
      strength: 0.1,
      y: 0.5,
    },
    link: {
      enabled: true,
      distance: 35,
      strength: 1,
      iterations: 10,
    },
  };

  function handleSelectChange(e) {
    setSelectedProject(e.target.value);
  }

  function updateCalculation(e) {
    console.log('eita!');
    const fg = graphRef.current;
    console.log('fg %o', fg);
    if (fg) {
      fg.d3Force('center', d3.forceCenter().strength(2));
      fg.d3Force(
        'charge',
        d3
          .forceManyBody()
          .strength(
            forceProperties.charge.strength * forceProperties.charge.enabled
          )
      );
      fg.d3Force(
        'collide',
        d3
          .forceCollide()
          .strength(
            forceProperties.collide.strength * forceProperties.collide.enabled
          )
          .radius(d => d.size)
          .iterations(forceProperties.collide.iterations)
      );
      fg.d3Force(
        'forceX',
        d3
          .forceX()
          .strength(
            forceProperties.forceX.strength * forceProperties.forceX.enabled
          )
          .x(forceProperties.forceX.x)
      );
      fg.d3Force(
        'forceY',
        d3
          .forceY()
          .strength(
            forceProperties.forceY.strength * forceProperties.forceY.enabled
          )
          .y(forceProperties.forceY.y)
      );
      fg.d3Force(
        'link',
        d3
          .forceLink(forceProperties.link.enabled ? links : [])
          .id(d => d.id)
          .distance(forceProperties.link.distance)
          .strength(forceProperties.link.strength)
          .iterations(forceProperties.link.iterations)
      );
    }
    fg.d3ReheatSimulation();
  }

  useEffect(() => {
    console.log('hasLoaded %o', hasLoaded);
    // updateCalculation();
  }, [hasLoaded]);

  useEffect(() => {
    const fg = graphRef.current;
    console.log('selectedProject %o', selectedProject);
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        setIsLoading(true);
        const graphData = await gatherGraphData(accessToken, selectedProject);
        // setGraphData(graphData);
        setNodes([...graphData.nodes]);
        setLinks([...graphData.links]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // updateCalculation();
    // const graphData = gatherMockupGraphData();
    // setGraphData(graphData);
    // setNodes([...graphData.nodes]);
    // setLinks([...graphData.links]);
    // console.log('graphData');
    // console.log(graphData);
  }, [selectedProject]);

  useEffect(() => {
    async function fetchProjectList() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const projectList = await api.getAllProjects(accessToken);
        // console.log('projectList: %o', projectList);
        setProjectList(projectList);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProjectList();
  }, []);

  useEffect(() => {
    const fg = graphRef.current;
    if (selectedProject !== '' && !isLoading) {
      try {
        console.log('fg %o', fg);
        // updateCalculation();
      } catch (error) {
        console.log(error);
      }
    }
  }, [selectedProject, isLoading]);

  return (
    // <div>
    //   <h1>Debug Graph</h1>
    //   <p>{nodes.length}</p>
    //   <p>{links.length}</p>
    //   <pre>{JSON.stringify(graphData, null, 2)}</pre>
    // </div>
    <Box>
      <HStack spacing={4}>
        <Select placeholder="escolha o projeto" onChange={handleSelectChange}>
          {projectList.map(lab => {
            return lab.projects.map(project => {
              return (
                <option key={project.id} value={project.id}>
                  {lab.lab.name ? lab.lab.name : 'public'} - {project.title}
                </option>
              );
            });
          })}
        </Select>
        <Button onClick={updateCalculation}>update</Button>
      </HStack>
      {/* <Input type="text" placeholder={selectedProject} />
      <Input type="text" placeholder={isLoading ? 'LOADING' : 'NOT LOADING'} /> */}
      {selectedProject === '' ? (
        <></>
      ) : isLoading ? (
        <Flex minH={'100vh'} align={'center'} justify={'center'}>
          <Stack>
            <Spinner size="xl" />
          </Stack>
        </Flex>
      ) : (
        <HStack>
          <ForceGraph2D
            ref={graphRef}
            graphData={{ nodes, links }}
            nodeColor="color"
            nodeLabel="title"
            nodeVal="size"
            nodeId="id"
            nodeOpacity={1}
            nodeResolution={10}
            // dagMode={'radialout'}
            onEngineStop={() => {
              graphRef.current.zoomToFit(400);
              console.log('zoomToFit');
              // updateCalculation();
            }}
            d3AlphaDecay={0.001}
            d3VelocityDecay={0.7}
            onEngineTick={() => {
              setHasLoaded(true);
            }}
          />
        </HStack>
      )}
    </Box>
  );
}
