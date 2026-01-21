import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { authFetch } from '../../utils/authFetch';
import { BASE_URL } from '../../constants/api';
import { FaProjectDiagram, FaFileAlt, FaUsers, FaHistory } from 'react-icons/fa';
import styles from './Dashboard.module.css';
import Loading from '../Loading';
import {
  LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

interface DashboardData {
  counts: {
    projectCount: number;
    resumeCount: number;
    totalVisitors: number;
  };
  topTechs: Array<{
    name: string;
    count: number;
  }>;
  recentActivities: Array<{
    id: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE'; // 우리가 정한 액션들
    details: string;
    createdAt: string;
  }>;
  visitorStats: Record<string, number>;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: () => authFetch(`${BASE_URL}/api/admin/dashboard`).then(res => res.json()),
  });

  // Recharts용 데이터 변환 (Object -> Array)
  // Recharts는 데이터를 객체 배열([{ date: '...', count: 10 }, ...]) 형태로 받기를 좋아함. 
  // 하지만 지금 우리 데이터(data.visitorStats)는 {'2024-01-20': 5, ...} 같은 객체 형태. 
  // 이걸 변환해야 함
  const visitorChartData = data?.visitorStats
    ? Object.entries(data.visitorStats).map(([data, count]) => ({
      data: data.slice(5),
      visitors: count,
    })).sort((a, b) => a.data.localeCompare(b.data)) // 날짜순 정렬
    : [];

  if(isLoading || !data) return <Loading />

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Dashboard</h2>
        <p className={styles.subtitle}>Welcome back, Admin! Here's what's happening.</p>
      </header>

      {/* 상단 요약 카드 섹션 */}
      <div className={styles.statsGrid}>
        <StatCard title="Projects" value={data.counts.projectCount} icon={<FaProjectDiagram />} color="#ffdb70" />
        <StatCard title="Resume Items" value={data.counts.resumeCount} icon={<FaFileAlt />} color="#70d6ff" />
        <StatCard title="Total Visitors" value={data.counts.totalVisitors} icon={<FaUsers />} color="#ff70d6" />
      </div>

      {/* 주간 방문자 추이 그래프 */}
      <section className={styles.card} style={{ gridColumn: '1 / -1' }}> {/* 💡 꽉 찬 너비로 보여주기 */}
        <h3 className={styles.cardTitle}><FaUsers /> Weekly Visitor Trend</h3>
        <div style={{ width: '100%', height: 200 }}> {/* 차트 영역 높이 지정 */}
          <ResponsiveContainer>
            <AreaChart
              data={visitorChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {/* 배경 그리드선 (점선) */}
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              
              {/* X축 (날짜) */}
              <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888' }} />
              
              {/* Y축 (방문자 수) */}
              <YAxis stroke="#888" tick={{ fill: '#888' }} allowDecimals={false} />
              
              {/* 마우스 올렸을 때 나오는 툴팁 */}
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#ffdb70' }}
              />
              
              {/* 실제 그래프 영역 (그라데이션 효과) */}
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffdb70" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffdb70" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" // 부드러운 곡선
                dataKey="visitors" // 사용할 데이터 키 이름
                stroke="#ffdb70" // 선 색상 (골드)
                fillOpacity={1} 
                fill="url(#colorVisitors)" // 채우기 색상 (그라데이션 적용)
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className={styles.mainGrid}>
        {/* 기술 스택 분포 (바 차트 스타일) */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Tech Stack Usage</h3>
          <div style={{ width: '100%', height: 300 }}>
            {data.topTechs.length > 0 ? (
            <ResponsiveContainer>
              <BarChart
                layout="vertical" // 💡 가로형 막대로 설정
                data={data.topTechs}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" hide /> {/* X축은 수치라 숨깁니다 */}
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#888" 
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }} // 마우스 올렸을 때 배경색 방지
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffdb70' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]} // 💡 막대 오른쪽 끝만 둥글게
                  barSize={20}
                >
                  {/* 💡 각 막대에 그라데이션이나 색상을 입힐 수 있습니다 */}
                  {data.topTechs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ffdb70' : '#ffdb7080'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>데이터가 아직 없습니다.</div>
            )}
            
          </div>
        </section>

        {/* 최근 활동 로그 (타임라인 스타일) */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}><FaHistory /> Recent Activities</h3>
          <ul className={styles.logList}>
            {data.recentActivities.map((log) => (
              <li key={log.id} className={styles.logItem}>
                <div className={styles.logDot} data-action={log.action}></div>
                <div className={styles.logContent}>
                  <div className={styles.logHeader}>
                    <span className={styles.logAction}>{log.action}</span>
                    <span className={styles.logTime}>{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className={styles.logDetails}>{log.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

// 헬퍼 컴포넌트: 요약 카드
const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className={styles.statCard}>
    <div className={styles.iconWrapper} style={{ backgroundColor: `${color}20`, color }}>
      {icon}
    </div>
    <div className={styles.statText}>
      <span className={styles.statLabel}>{title}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  </div>
);


export default Dashboard;