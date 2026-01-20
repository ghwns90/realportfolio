import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../utils/authFetch';
import { BASE_URL } from '../../constants/api';
import { FormInput, FormTextArea } from '../../components/common/FormInput';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Projects.module.css';
import Loading from '../Loading';
import ProjectCard from '../common/ProjectCard';

// 프로젝트 인터페이스 정의
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  isDemoActive: boolean;
  createdAt: string;
  order: number;
}

const Projects: React.FC = () => {

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    techStack: [] as string[],
    githubUrl: '',
    demoUrl: '',
    isDemoActive: true,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // 데이터 가져오기 (list)
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['adminProjects'],
    queryFn: () => authFetch(`${BASE_URL}/api/admin/projects`).then(res => res.json()),
  });

  const sortedProjects = projects 
  ? [...projects].sort((a, b) => a.order - b.order) 
  : [];

  // Mutation (생성, 삭제, 토글)
  const createMutation = useMutation({
    mutationFn: (data: FormData) => authFetch(`${BASE_URL}/api/admin/projects`, {
      method: 'POST', 
      body: data, 
      isFormData: true
    }),
    onSuccess: () => {
      alert('프로젝트 등록 성공!');
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      resetForm();
    },
    onError: (error: Error) => {
      alert(`등록 실패: ${error.message}`);
      console.error('Mutation Error:', error);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: boolean }) => 
      authFetch(`${BASE_URL}/api/admin/projects/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isDemoActive: status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminProjects'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => authFetch(`${BASE_URL}/api/admin/projects/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects']});
    },
    onError: (error: Error) => {
      alert(`삭제 실패: ${error}`);
    }
  });

  // 핸들러 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', category: 'Web Development', techStack: [], githubUrl: '', demoUrl: '', isDemoActive: true
    });
    setThumbnail(null);
    setPreviewUrl('');
  };

  const handleDelete = (id: number) => {
    if(window.confirm('프로젝트를 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  }
  const handleSubmit = async (e: React.MouseEvent) => {

    e.preventDefault()

    console.log('데이터:', formData)

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });

      if(thumbnail) data.append('thumbnail', thumbnail);

      await createMutation.mutateAsync(data);

    } catch (error) {
      console.error('❌ 전송 중 에러 발생:', error); // 💡 여기서 찍히는 에러가 범인입니다!
    }
    
  }

  if(isLoading) return <Loading />

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        {/* ⬅️ 왼쪽: 프로젝트 입력 창 */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Add New Project</h3>
          <div className={styles.form}>
            <FormInput label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <div className={styles.selectGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.select}
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Web Development">Web Development</option>
                <option value="Applications">Applications</option>
              </select>
            </div>
            <FormTextArea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /> 
            <FormInput 
              label="Tech Stack (쉼표로 구분 예: React, Node.js)" 
              value={formData.techStack.join(', ')} 
              onChange={e => setFormData({...formData, techStack: e.target.value.split(',').map(s => s.trim())})} 
            />  
            {/* 커스텀 썸네일 */}
            <div className={styles.fileBox}>
              <label>Thumbnail Image</label>
              <div className={styles.customFileInput}>
                <label htmlFor="thumbnail" className={styles.fileUploadBtn}>
                  {thumbnail ? 'Change Image' : 'Select Image'}
                </label>
                <span className={styles.fileName}>{thumbnail ? thumbnail.name : '선택된 파일 없음'}</span>
                <input id="thumbnail" type="file" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>
            <div className={styles.row}>
              <FormInput label="Github" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
              <FormInput label="Demo" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} />
            </div>
            <button className={styles.submitBtn} onClick={(e) => handleSubmit(e)}>
              <FaPlus /> {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </section>

        {/* ➡️ 오른쪽: 실시간 프리뷰 */}
        <section className={styles.previewSection}>
          <h3 className={styles.cardTitle}>Live Preview</h3>
          <div className={styles.previewWrapper}>
            <ProjectCard data={{...formData, thumbnailUrl: previewUrl }} isPreview={true}/>
          </div>          
        </section>
      </div>

      {/* ⬇️ 하단: 프로젝트 리스트 */}
      <section className={styles.listCard}>
        <h3 className={styles.cardTitle}>Project List</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map(p => {

                const isToggling = toggleMutation.isPending && toggleMutation.variables?.id === p.id;

                return (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>
                      <button 
                        className={`${styles.toggleBtn} ${p.isDemoActive ? styles.on : styles.off}`}
                        onClick={() => toggleMutation.mutate({ id: p.id, status: !p.isDemoActive })}
                        disabled={isToggling}
                        style={{ opacity: isToggling ? 0.5 : 1, cursor: isToggling ? 'not-allowed' : 'pointer' }}
                      >
                        {isToggling ? 'Updating...' : (p.isDemoActive ? 'Active (Live)' : 'Inactive')}
                      </button>
                    </td>
                    <td>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}><FaTrash /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

}; 

export default Projects;