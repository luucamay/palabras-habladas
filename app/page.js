'use client';
import styles from './page.module.css'
const apiKey = process.env.XI_API_KEY
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebase/config'
import addData from "@/firebase/firestore/addData";

export default function Home() {
  const convertToPlain = (html) => {

    // Create a new div element
    const tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  const createAudio = async (e) => {
    e.preventDefault()
    const text = document.querySelector('#textInput').value
    const audioElement = document.querySelector('#audio')
    const audioLink = document.querySelector('#audio a')
    const ctx = new AudioContext()
    console.log('Creating your audio..')
    // download an audio file
    const data = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      body: JSON.stringify({
        'text': text
      }),
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
    })
    const blob = await data.blob()
    // TODO save the reference in DB
    // UUID -> generate in browser
    // use the DB id autogenrated to the name
    // Create a storage reference from our storage service
    const storageRef = ref(storage, 'audio/voice1.mp3');
    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, blob)
    const audioUrl = await getDownloadURL(storageRef)
    audioElement.src = audioUrl
    audioLink.href = audioUrl

    const article = {
      audioUrl: audioUrl,
      title: 'a title',
      url: 'someurl.com',
      description: 'a nice description',
      durationSecs: 3000,
      minimg: 'an src to an image',
      downloaded: false
    }
    const { result, error } = await addData('articles', article)

    if (error) {
      return console.log(error)
    } else {
      return console.log(result)
    }

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
