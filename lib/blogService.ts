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
  where,
  or,
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

// 搜索博客（按标题和标签关键词匹配）
export const searchBlogs = async (keyword: string): Promise<Blog[]> => {
  try {
    if (!keyword.trim()) {
      return await getAllBlogs()
    }

    // Firebase 不支持部分字符串匹配查询，所以我们获取所有博客并在客户端过滤
    const blogs = await getAllBlogs()

    // 转换关键词为小写以进行不区分大小写的搜索
    const lowerKeyword = keyword.toLowerCase()

    return blogs.filter((blog) => {
      // 检查标题是否包含关键词
      const titleMatch = blog.title?.toLowerCase().includes(lowerKeyword)

      // 检查标签是否包含关键词
      const tagMatch = blog.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))

      return titleMatch || tagMatch
    })
  } catch (error) {
    console.error('搜索博客失败:', error)
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
