import { gatherGraphData } from '../data/graphData';
import { useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';

export default function Graph() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const projectId = '601a83d4cf364315a4cb9814';
      const accessToken = localStorage.getItem('accessToken');
      const graphData = await gatherGraphData(accessToken, projectId);
      console.log('graphData');
      console.log(graphData);
      setGraphData(graphData);
      setNodes([...graphData.nodes]);
      setLinks([...graphData.links]);
    };
    fetchData();
  }, []);

  return (
    // <div>
    //   <h1>Debug Graph</h1>
    //   <p>{nodes.length}</p>
    //   <p>{links.length}</p>
    //   <pre>{JSON.stringify(graphData, null, 2)}</pre>
    // </div>
    <ForceGraph3D
      graphData={{ nodes, links }}
      nodeAutoColorBy="group"
      nodeLabel="title"
      nodeOpacity={1}
    />
  );
}
