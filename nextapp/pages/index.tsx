import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'react-vertical-timeline-component/style.min.css';

import dynamic from "next/dynamic";
import NavBar from '../components/NavBar';
import { useEffect } from 'react';
import DataHelperImpl from '../data/DataHelperImpl';
import DataHelper from '../data/DataHelper';

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import { Icon } from '@fluentui/react';


const Home: NextPage = () => {
//  const [map, setMap] = useState(<></>);
 useEffect(() => {
  const helper:DataHelper = new DataHelperImpl;
  //  setMap(<MyAwesomeMap></MyAwesomeMap>)
 }, []);
  return (
    <>
      <Head>
        <title>Nicolas Karageuzian</title>
        <meta name="description" content="Nicolas Karageuzian" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar layerHostId={''}></NavBar>
      <main className={styles.main}>
        <h1>Nicolas Karageuzian</h1>
      {/* <VerticalTimeline
        layout='1-column-left'>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date="2011 - present"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
        test data
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date="2011 - present"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
        test data
        </VerticalTimelineElement>
      </VerticalTimeline> */}
      </main>
      <footer className={styles.footer}>
      </footer>
    </>
  )
}

export default Home
