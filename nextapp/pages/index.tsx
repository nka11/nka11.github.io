import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect } from 'react';
import { useState } from 'react';

import dynamic from "next/dynamic";


const Home: NextPage = () => {
//  const [map, setMap] = useState(<></>);
//  useEffect(() => {
//    setMap(<MyAwesomeMap></MyAwesomeMap>)
//  }, []);
  return (
    <div>
      <Head>
        <title>Nicolas Karageuzian</title>
        <meta name="description" content="Another tech personal page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className='brand'>Nicolas Karageuzian</h1>
        
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
