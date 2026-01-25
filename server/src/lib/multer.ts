import multer from 'multer';

// 메모리 저장 (supabase 용)
const storage = multer.memoryStorage();

// 하드 저장 ( 서버 저장 )
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {

//     const folder = file.fieldname === 'thumbnail' ? 'projects' : 'profiles';
//     const uploadPath = `uploads/${folder}`;
//     //폴더 없으면 자동 생성
//     if(!fs.existsSync(uploadPath)){
//       fs.mkdirSync(uploadPath, { recursive: true});
//     }

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // 파일명 중복 방지 위한 타임스탬프 결합
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// 파일 필터링
const fileFilter = (req: any, file: any, cb: any) => {
  if(file.mimetype.startsWith('image/')) {
    cb(null, true);
  }else {
    cb(new Error('이미지 파일만 업로드 가능합니다'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, }
});
