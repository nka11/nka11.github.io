import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react';
import { useState } from 'react';

import dynamic from "next/dynamic";
import HistoryGraph from '../components/HistoryGraph'
//import 'react-vis-timeline/node_modules/vis-timeline/styles/vis-timeline-graph2d.min.css';


const GraphSamples: NextPage = () => {
    return <div>
    <Head>
      <title>Graph samples</title>
      <meta name="description" content="Network graphs vith visjs" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <h1 className='brand'>My git blog</h1>
      <p>The git history of the repository</p>
      <HistoryGraph></HistoryGraph>
    </main>

    <footer className={styles.footer}>
    </footer>
  </div>
}

export default GraphSamples