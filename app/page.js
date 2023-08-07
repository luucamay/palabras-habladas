'use client';
import styles from './page.module.css'
const apiKey = process.env.XI_API_KEY

export default function Home() {
  const createAudio = (e) => {
    e.preventDefault();
    const ctx = new AudioContext();
    let audio;
    console.log('Creating your audio..')
    // download an audio file

    fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      body: JSON.stringify({
        'text': 'You got me waiting at the corner, just in the red light'
      }),
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
    }).then(data => data.arrayBuffer())
      .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
      .then(decodedAudio => {
        audio = decodedAudio;
        const playSound = ctx.createBufferSource();
        playSound.buffer = audio;
        playSound.connect(ctx.destination);
        playSound.start(ctx.currentTime);
      })
      .catch((e) => console.log(e));
  }
  return (
    <main className={styles.main}>
      <button onClick={createAudio}>Create audio</button>

    </main>
  )
}
