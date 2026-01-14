CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(50),
  github_url TEXT,
  demo_url TEXT,
  featured_type VARCHAR(20) DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 소개 정보 테이블 (About 탭 & 왼쪽 프로필)
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    role VARCHAR(50), -- Application Developer 등
    email VARCHAR(100),
    phone VARCHAR(50),
    birthday DATE,
    location TEXT,
    avatar_url TEXT
);

-- 3. 학력/경력 테이블 (Resume 탭)
CREATE TABLE IF NOT EXISTS resume (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20), -- education, experience
    title VARCHAR(100),
    institution VARCHAR(100),
    period VARCHAR(50),
    description TEXT
);