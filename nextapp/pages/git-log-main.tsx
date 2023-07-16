import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect } from 'react';
import { useState } from 'react';

import dynamic from "next/dynamic";
import HistoryBlog from '../components/HistoryBlog'
//import 'react-vis-timeline/node_modules/vis-timeline/styles/vis-timeline-graph2d.min.css';


const GitBlog: NextPage = () => {
//  const [map, setMap] = useState(<></>);
//  useEffect(() => {
//    setMap(<MyAwesomeMap></MyAwesomeMap>)
//  }, []);
  return (
    <div style={{ backgroundColor:'#B8CBD0' }}>
      <Head>
        <title>My git blog</title>
        <meta name="description" content="A commit based blog experiment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className='brand'>The git history of the repository</h1>
        <HistoryBlog></HistoryBlog>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default GitBlog
