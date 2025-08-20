import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBIFQnsOpMZ38H-KXQgaE1YCS5gxoYXBxw',
  authDomain: 'myblog-personal.firebaseapp.com',
  projectId: 'myblog-personal',
  storageBucket: 'myblog-personal.firebasestorage.app',
  messagingSenderId: '1071308430329',
  appId: '1:1071308430329:web:3d04c1cc3681f16c7f7b28',
  measurementId: 'G-M5JRXRQW4L',
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)

// 获取 Firestore 实例并配置
const db = getFirestore(app)

// 如果是开发环境，使用模拟器
if (process.env.NODE_ENV === 'development') {
  // 注释掉模拟器配置，使用真实环境
  // connectFirestoreEmulator(db, 'localhost', 8080)
}

export { db }
