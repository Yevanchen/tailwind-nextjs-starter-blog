import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Blog } from '../types/blog'

const COLLECTION_NAME = 'bloglist'

// 获取博客集合引用
const blogsRef = collection(db, COLLECTION_NAME)

// 添加带指定 ID 的博客
export const setBlogWithId = async (id: string, blog: Omit<Blog, 'id'>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await setDoc(docRef, blog)
    return { id, ...blog }
  } catch (error) {
    console.error('添加博客失败:', error)
    throw error
  }
}

// 添加博客
export const addBlog = async (blog: Omit<Blog, 'id'>) => {
  try {
    const docRef = await addDoc(blogsRef, blog)
    return { id: docRef.id, ...blog }
  } catch (error) {
    console.error('添加博客失败:', error)
    throw error
  }
}

// 删除博客
export const deleteBlog = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    console.error('删除博客失败:', error)
    throw error
  }
}

// 更新博客
export const updateBlog = async (id: string, data: Partial<Blog>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, data)
  } catch (error) {
    console.error('更新博客失败:', error)
    throw error
  }
}

// 获取所有博客
export const getAllBlogs = async (): Promise<Blog[]> => {
  try {
    const querySnapshot = await getDocs(query(blogsRef))
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Blog
    )
  } catch (error) {
    console.error('获取博客列表失败:', error)
    throw error
  }
}

// 实时监听博客变化
export const subscribeToBlogChanges = (callback: (blogs: Blog[]) => void) => {
  return onSnapshot(query(blogsRef), (snapshot) => {
    const blogs = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Blog
    )
    callback(blogs)
  })
}
