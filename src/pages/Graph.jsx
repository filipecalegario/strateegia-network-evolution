import { gatherGraphData } from '../data/graphData';
import { useEffect, useState, useRef } from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import { gatherMockupGraphData } from '../data/mockupGraphData';

export default function Graph() {
  const graphRef = useRef();

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const projectId = '601a83d4cf364315a4cb9814';
      const accessToken = localStorage.getItem('accessToken');
      const graphData = await gatherGraphData(accessToken, projectId);
      setGraphData(graphData);
      setNodes([...graphData.nodes]);
      setLinks([...graphData.links]);
    };
    fetchData();
    // const graphData = gatherMockupGraphData();
    // setGraphData(graphData);
    // setNodes([...graphData.nodes]);
    // setLinks([...graphData.links]);
    // console.log('graphData');
    // console.log(graphData);
  }, []);

  return (
    // <div>
    //   <h1>Debug Graph</h1>
    //   <p>{nodes.length}</p>
    //   <p>{links.length}</p>
    //   <pre>{JSON.stringify(graphData, null, 2)}</pre>
    // </div>
    <ForceGraph3D
      ref={graphRef}
      graphData={{ nodes, links }}
      nodeColor="color"
      nodeLabel="title"
      nodeVal="size"
      nodeId="id"
      nodeOpacity={1}
      nodeResolution={10}
      // dagMode={'radialout'}
      // onEngineStop={() => graphRef.current.zoomToFit(400)}
    />
  );
}
