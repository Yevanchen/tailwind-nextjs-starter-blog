import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCHD3X3wyBuheOPo-JI68V63ENTuU4nkd8',
  authDomain: 'myblog-49cc0.firebaseapp.com',
  projectId: 'myblog-49cc0',
  storageBucket: 'myblog-49cc0.firebasestorage.app',
  messagingSenderId: '975167914319',
  appId: '1:975167914319:web:e860f72e9613c1f962853a',
  measurementId: 'G-ECCZB7PDG7',
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
