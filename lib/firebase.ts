import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'myblog-personal.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'myblog-personal',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'myblog-personal.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1071308430329',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1071308430329:web:3d04c1cc3681f16c7f7b28',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-M5JRXRQW4L',
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
