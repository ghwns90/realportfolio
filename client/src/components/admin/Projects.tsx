import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../utils/authFetch';
import { BASE_URL } from '../../constants/api';
import { FormInput, FormTextArea } from '../../components/common/FormInput';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Projects.module.css';
import Loading from '../Loading';

// 프로젝트 인터페이스 정의
interface Project {
  id: number;
  title: string;
  description: string;
  period?: string;
  techStack: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  isDemoActive: boolean;
  createdAt: string;
}

const Projects: React.FC = () => {

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    period: '',
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

  // Mutation (생성, 삭제, 토글)
  const createMutation = useMutation({
    mutationFn: (data: FormData) => authFetch(`${BASE_URL}/api/admin/projects`, {
      method: 'POST', 
      body: data, 
      isFormData: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      resetForm();
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
      title: '', description: '', period: '', techStack: [], githubUrl: '', demoUrl: '', isDemoActive: true
    });
    setThumbnail(null);
    setPreviewUrl('');
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });
    if(thumbnail) data.append('thumbnail', thumbnail);
    createMutation.mutate(data);
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
            <FormTextArea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className={styles.fileBox}>
              <label>Thumbnail</label>
              <input type="file" onChange={handleImageChange} />
            </div>
            <div className={styles.row}>
              <FormInput label="Github" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} />
              <FormInput label="Demo" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} />
            </div>
            <button className={styles.submitBtn} onClick={handleSubmit}>
              <FaPlus /> Create Project
            </button>
          </div>
        </section>

        {/* ➡️ 오른쪽: 실시간 프리뷰 */}
        <section className={styles.previewSection}>
          <h3 className={styles.cardTitle}>Live Preview</h3>
          <div className={styles.previewCard}>
            <div className={styles.previewImg}>
              <img src={previewUrl || '/images/placeholder.png'} alt="Preview" />
              <div className={`${styles.indicator} ${formData.isDemoActive ? styles.active : styles.inactive}`}></div>
            </div>
            <div className={styles.previewInfo}>
              <h4>{formData.title || 'Project Title'}</h4>
              <p>{formData.description || 'Description will appear here...'}</p>
            </div>
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
              {projects?.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>
                    <button 
                      className={`${styles.toggleBtn} ${p.isDemoActive ? styles.on : styles.off}`}
                      onClick={() => toggleMutation.mutate({ id: p.id, status: !p.isDemoActive })}
                    >
                      {p.isDemoActive ? 'Active (Live)' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

}; 

export default Projects;