import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { LinkCard } from "../components/LinkCard";

const Home: NextPage = () => {
  return (
      <div className={styles.container}>
        <Head>
          <title>Sound Synthesis</title>
          <meta name="description" content="Examples for Web Audio API" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Sound synthesis examples
          </h1>

          <div className={styles.grid}>

            <LinkCard
                href="/01-basic-waveforms"
                title="Waves"
                description="Basic waveforms synth."
            />

            <LinkCard
                href="/02-gain-and-filter"
                title="Gain and filter"
                description="Controlling some tonal parameters."
            />

            <LinkCard
                href="/03-analyzing-sound"
                title="Analyzing sound"
                description="Analyzing/visualizing sound with Web Audio API."
            />

            <LinkCard
                href="/04-sequencing-and-automation"
                title="Sequencing & Automation"
                description="Shaping sounds over time."
            />

            <LinkCard
                href="/05-melodic-sequences"
                title="Melodies and tones"
                description="Melodies, tones, and sequences" />

            <LinkCard
                href="/06-beat-machine"
                title="Beat machine"
                description="Attempting to do something like music" />

          </div>
        </main>
      </div>
  );
};

export default Home;
