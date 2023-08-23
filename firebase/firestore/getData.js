import firebase_app from "../config";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app)

export default async function getData(colllection) {
  let result = []
  let error = null

  try {
    const querySnapshot = await getDocs(collection(db, colllection))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      result.push(doc.data());
    });

  } catch (e) {
    error = e
  }

  return { result, error }
}