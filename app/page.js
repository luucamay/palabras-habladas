'use client';
import styles from './page.module.css'
const apiKey = process.env.XI_API_KEY
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebase/config'
import addData from "@/firebase/firestore/addData";
import crypto from "crypto"

export default function Home() {

  const createAudio = async (e) => {
    e.preventDefault()

    // Create audio from text
    const textSource = document.querySelector('#textInput').value
    const audioResult = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      body: JSON.stringify({
        'text': textSource
      }),
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
    })

    // Save article in the storage
    const audioUUID = crypto.randomBytes(20).toString('hex')
    const audioBlob = await audioResult.blob()
    const storageRef = ref(storage, `audio/${audioUUID}.mp3`)
    await uploadBytes(storageRef, audioBlob)
    const audioUrl = await getDownloadURL(storageRef)

    // Make the new url available in the client player
    const audioElement = document.querySelector('#audio')
    const audioLink = document.querySelector('#audio a')
    audioElement.src = audioUrl
    audioLink.href = audioUrl

    // Save Article in the database
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

    // reload the other view with this new data?

  }

  const getArticleText = (e) => {
    e.preventDefault();
    const inputUrl = document.querySelector('#url')
    const url = encodeURIComponent(inputUrl.value)
    console.log(url)
    // call api and wait for its result
    fetch(`https://text-from-url.onrender.com/article/${url}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const textarea = document.querySelector('#textInput')
        textarea.value = data.textContent
      })

  }

  return (
    <main className={styles.main}>
      <section>
        <input size={100} type='text' id='url' defaultValue='luucamay/the-week-i-danced-with-martha-graham-and-unleashed-ai-magic-at-rc-2d1a' />
        <button onClick={getArticleText}>Import from url</button>
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
