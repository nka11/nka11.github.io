import { useEffect, useRef, useState } from "react";
import { Network, Edge, Node } from "vis-network";
import axios from 'axios';

const HistoryGraph: React.FC = () => {
	const visJsRef = useRef<HTMLDivElement>(null);
	const [nodes, setNodes] = useState<Node[]>([])
	const [edges, setEdges] = useState<Edge[]>([])
	

	const options = {
		// width: '100%',
		// height: '100px',
		// ...
		// ...
	  }
	useEffect(() => {
		axios.get("/commits.json").then((response) => {
			let resNodes:Node[] = []
			let resEdges:Edge[] = []
			response.data.forEach((commit:any,index:number)=>{
				resNodes.push({
					id: commit.sha,
					label: commit.sha
				});
				
				let a = [];
				a.length
				if (commit.parents.length > 0) {
					commit.parents.forEach((parent:any,index:any) => {
						resEdges.push({
							from: parent.sha,
							to: commit.sha
						})
					})
				}
			})
			setNodes(resNodes);
			setEdges(resEdges)
			const network =
				visJsRef.current &&
				new Network(visJsRef.current, { nodes, edges }, options );
		})
		// Use `network` here to configure events, etc
	}, [visJsRef]);

	return <div ref={visJsRef} />;
};

export default HistoryGraph;
