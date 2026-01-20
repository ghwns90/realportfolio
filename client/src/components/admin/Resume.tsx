import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '../../utils/authFetch';
import { BASE_URL } from '../../constants/api';
import { FormInput, FormTextArea } from '../../components/common/FormInput';
import { FaPlus } from 'react-icons/fa';
import styles from './Projects.module.css'; 
import Loading from '../Loading';
import ResumeTable from './ResumeTable';

interface Resume {
  id: number,
  type: string;
  title: string;
  description: string;
  period: string;
  order: number;
}

// 생성용 타입
type ResumeInput = Omit<Resume, 'id'|'order'>;

const ResumeAdmin: React.FC = () => {

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ResumeInput>({
    type: 'education',
    title: '',
    description: '',
    period: '',
  });

  // 데이터 가져오기
  const { data: resumes, isLoading } = useQuery({
    queryKey: ['adminResumes'],
    queryFn: () => authFetch(`${BASE_URL}/api/admin/resumes`).then( res => res.json() ),
  });

  // 등록
  const createMutation = useMutation({
    mutationFn: (data: ResumeInput) => authFetch(`${BASE_URL}/api/admin/resumes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      alert('등록 성공');
      queryClient.invalidateQueries({ queryKey: ['adminResumes'] });
      setFormData({
        type: 'education', title: '', period: '', description: ''
      });
    }
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: number) => authFetch(`${BASE_URL}/api/admin/resumes/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminResumes'] }),
    onError: (error) => {alert(`삭제 실패: ${error.message}`)},
  });

  // 순서 변경
  const updateOrderMutation = useMutation({
    mutationFn: ({id, order} : {id: number; order: number}) => 
      authFetch(`${BASE_URL}/api/admin/resumes/${id}/order`, {
        method: 'PATCH',
        body: JSON.stringify({ order }),
      }),
  });

  // 핸들러
  
  // 순서를 위한 order 정렬
  const sortedResumes = resumes ? [...resumes].sort((a, b) => a.order - b.order) : [];
  const educationList = sortedResumes.filter(item => item.type === 'education'); // education
  const experienceList = sortedResumes.filter(item => item.type === 'experience'); // experience

  // 삭제 핸들러
  const handleDelete = (id: number) => {
    if (window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  // 순서 변경 핸들러
  const handleMove = async (index: number, direction: 'up' | 'down', currentList: Resume[]) => {

    if (!resumes || resumes.length === 0) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;
    
    const currentItem = currentList[index];
    const targetItem = currentList[targetIndex];

    try {
      await Promise.all([
        updateOrderMutation.mutateAsync({ id: currentItem.id, order: targetItem.order }),
        updateOrderMutation.mutateAsync({ id: targetItem.id, order: currentItem.order })
      ]);
      queryClient.invalidateQueries({ queryKey: ['adminResumes'] });
    } catch (error) {
      console.error(error);
    }
  };

  

  if(isLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Add Resume</h3>
        <div className={styles.form}>
          <div className={styles.selectGroup}>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={ e => setFormData({...formData, type: e.target.value})}
              className={styles.select}
            >
              <option value="education">Education</option>
              <option value="experience">Experience</option>
            </select>
          </div>
          <FormInput label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <FormInput label="Period" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
          <FormTextArea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

          <button className={styles.submitBtn} onClick={() => createMutation.mutate(formData)}>
            <FaPlus /> {createMutation.isPending ? 'Saving...' : 'Add Item'}
          </button>
        </div>
      </section>

      <div className={styles.listWrapper}>
          <ResumeTable 
            title="Education"
            list={educationList} 
            onMove={handleMove} 
            onDelete={handleDelete}             
          />

          <ResumeTable 
            title="Experience"
            list={experienceList} 
            onMove={handleMove} 
            onDelete={handleDelete} 
          />
      </div>
    </div>
  )

};

export default ResumeAdmin;