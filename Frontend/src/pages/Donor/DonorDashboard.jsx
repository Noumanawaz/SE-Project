"use client"

import "react-toastify/dist/ReactToastify.css"
import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)



export default function Profile() {
 
  

 
  return (
    "Hello Donor"
  )
}


