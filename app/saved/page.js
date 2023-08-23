
import styles from './page.module.css'
import Image from 'next/image'
import getData from "@/firebase/firestore/getData";

export default async function Home() {
  const articles = await getData('articles')
  console.log(articles)

  return (
    <main className={styles.feed}>
      <ul>
        {articles.result.map((article, index) =>
          <li key={index} className={styles.card}>

            <Image
              className={styles.img}
              src="/article.jpg"
              width={100}
              height={100}
              alt="Picture of the article"
            />
            <h2 className={styles.title}>{article.title}</h2>
            <p className={styles.url}>{article.url}</p>
            <p className={styles.description}>{article.description}</p>
            <p className={styles.duration}>{article.durationSecs} mins</p>
            <button>
              <Image src="/listened.svg"
                alt='listened button'
                width={32}
                height={32} />
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

          </li>)}
      </ul>
    </main>
  )
}
