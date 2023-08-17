'use client';
import styles from './page.module.css'
import Image from 'next/image'

export default function Home() {


  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <Image
          className={styles.img}
          src="/article.jpg"
          width={100}
          height={100}
          alt="Picture of the article"
        />
        <h2 className={styles.title}>This is your blog title  I will tell you how to blog title  I will tell mak...</h2>
        <p className={styles.url}>news.ycombinator.com</p>
        <p className={styles.description}>In this post we will cover the differences of cats vs dogs</p>
        <p className={styles.duration}>1 hr 37 mins</p>
        <button>
          <svg viewBox="0 0 24 24" width="32px" height="32px" fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true" focusable="false">
            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class={styles.visually_hidden}>Listened</span>
        </button>
        <button>
          <Image src="/arrow.svg"
            alt='download button'
            width={32}
            height={32} />
        </button>
        <button>
          <Image src="/vertical-dots.svg"
            alt='more options button'
            width={32}
            height={32} />
        </button>
        <button className={styles.play}>Play</button>
      </section>
      <section>
        second section
      </section>
    </main>
  )
}
