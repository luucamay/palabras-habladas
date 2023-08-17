'use client';
import styles from './page.module.css'
const apiKey = process.env.XI_API_KEY

export default function Home() {
  const convertToPlain = (html) => {

    // Create a new div element
    const tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  const createAudio = (e) => {
    e.preventDefault()
    const text = document.querySelector('#textInput').value
    const audioElement = document.querySelector('#audio')
    const audioLink = document.querySelector('#audio a')
    const ctx = new AudioContext()
    console.log('Creating your audio..')
    // download an audio file
    fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      body: JSON.stringify({
        'text': text
      }),
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
    }).then(data => {
      console.log(data)
      return data.blob()
    })
      .then(blob => {
        const audioURL = URL.createObjectURL(blob)
        audioElement.src = audioURL
        audioLink.href = audioURL
        console.log(audioElement)
      })
      .catch((e) => console.log(e));
  }

  const getText = (e) => {
    e.preventDefault();
    const inputUrl = document.querySelector('#url')
    const url = new URL(inputUrl.value, 'https://dev.to/api/articles/')

    fetch(url)
      .then(res => res.json())
      .then(json => {
        const textarea = document.querySelector('#textInput')
        textarea.value = convertToPlain(json.body_html)
      })

  }

  return (
    <main className={styles.main}>
      <section>
        <input size={100} type='text' id='url' defaultValue='luucamay/the-week-i-danced-with-martha-graham-and-unleashed-ai-magic-at-rc-2d1a' /><button onClick={getText}>Import from url</button>
      </section>
      <textarea id='textInput' rows={20} cols={40} defaultValue='It has been a while I am not who I was before.' />
      <button onClick={createAudio}>Create audio</button>
      <div id='playerArea'>
        <audio id='audio' controls src="none">
          <a href="none"> Download audio </a>
          <a href="none"> save audio </a>

        </audio>
      </div>
    </main>
  )
}
