'use client';
import styles from './page.module.css'
const apiKey = process.env.XI_API_KEY
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState } from 'react';
import { storage } from '@/firebase/config'
import addData from "@/firebase/firestore/addData";
import crypto from "crypto"

export default function Home() {
  const [src, setSrc] = useState(null);

  const createAudio = async (e) => {
    e.preventDefault()
    console.log('creating audio...')
    const statusMsg = document.querySelector('#statusMessage2')
    statusMsg.textContent = 'creando audio...'
    setSrc(null)

    // Create audio from text
    let textSource = document.querySelector('#textInput').value
    if (textSource.length > 4500)
      textSource = textSource.slice(0, 4500)

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
    setSrc(audioUrl)
    statusMsg.textContent = ''

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
  }

  const getArticleText = (e) => {
    e.preventDefault();
    const inputUrl = document.querySelector('#url')
    const url = encodeURIComponent(inputUrl.value)
    console.log('obteniendo texto de la URL...')
    const statusMsg = document.querySelector('#statusMessage1')
    statusMsg.textContent = 'obteniendo texto...'
    fetch(`https://text-from-url.onrender.com/article/${url}`)
      .then(res => res.json())
      .then(data => {
        const textarea = document.querySelector('#textInput')
        textarea.value = data.textContent.replace((/  |\r\n|\n|\r/gm), "");
        statusMsg.textContent = ''
        const createAudioBtn = document.querySelector('#createAudioBtn')
        createAudioBtn.disabled = false

      })

  }

  return (
    <main className={styles.main}>
      <header>
        <h1>Palabras al oido</h1>
        <h2>Transforma texto en audio desde cualquier sitio web</h2>
      </header>
      <section id='urlInputSec' className={styles.inputUrl}>
        <h3>1) Por favor introduce una URL:</h3>
        <input type='text' id='url' defaultValue='https://www.freecodecamp.org/news/increase-your-vs-code-productivity/' />
        <button onClick={getArticleText}>📝Obtener texto</button>
        <p id='statusMessage1'></p>
      </section>
      <section className={styles.reviewText}>
        <h3>2) Revisa el texto para convertirlo a audio. El limite es 4500 caracteres.</h3>
        <textarea id='textInput' className={styles.textAreaReview} />
        <button onClick={createAudio} id='createAudioBtn'> ▶️Crear audio</button>
        <p id='statusMessage2'></p>
      </section>
      {src ?
        (<section className={styles.player} id='playerArea' >
          <h3>3) Descarga tu audio o escuchalo aqui mismo 👇</h3>
          <audio id='audio' controls src={src} autoPlay>
            <a href={src}> Download audio </a>
          </audio>
        </section >
        )
        :
        (<div></div>)
      }
    </main>
  )
}
