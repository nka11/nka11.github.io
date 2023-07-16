import { useEffect, useRef, useState } from "react";
import Timeline from 'react-vis-timeline';
import axios from 'axios';
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import 'react-vertical-timeline-component/style.min.css';
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

const HistoryBlog: React.FC = () => {
	const visJsRef = useRef<HTMLDivElement>(null);
	const [items, setItems] = useState<[]>([])
	const [commits, setCommits] = useState(<></>)
	// const [edges, setEdges] = useState<Edge[]>([])
	

	const options = {
		width: '100%',
		height: '100px',
		// ...
		// ...
	  }
	useEffect(() => {
		axios.get("/commits.json").then((response) => {
			let commitItems:Array<any> = []
			setCommits(response.data.map((commit: any) => {
				return <VerticalTimelineElement
					key={ commit.sha }
					className="vertical-timeline-element--work"
					contentStyle={{ background: '#c9E3CC', color: '#424340' }}
					contentArrowStyle={{ borderRight: '7px solid  #C9E3CC' }}
					iconStyle={{ background: '#606C5A', color: '#fff', boxShadow: '0 0 0 4px #424340, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)' }}
					date={commit.commit.author.date}
					>
						<ReactMarkdown>{ commit.commit.message }</ReactMarkdown>
				</VerticalTimelineElement>
			}))
		})
		// Use `network` here to configure events, etc
	}, []);

	return <VerticalTimeline
		layout="1-column-left"
		lineColor="#424340">
		{ commits }
	</VerticalTimeline>;
};

export default HistoryBlog;
