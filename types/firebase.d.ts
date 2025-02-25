// 这是一个空的声明文件，用于解决TypeScript找不到firebase类型的问题
// 实际项目中应该使用@types/firebase或官方类型
declare module 'firebase' {
  export * from 'firebase/app';
  export * from 'firebase/auth';
  export * from 'firebase/firestore';
  export * from 'firebase/storage';
} 