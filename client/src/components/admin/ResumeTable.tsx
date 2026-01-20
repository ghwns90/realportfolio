import React from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from './Projects.module.css';

interface Resume {
  id: number;
  type: string;
  title: string;
  description: string;
  period: string;
  order: number;
}

interface ResumeTableProps {
  title?: string;
  list: Resume[];
  onMove: (index: number, direction: 'up' | 'down', list: Resume[]) => void;
  onDelete: (id: number) => void;
}

const ResumeTable: React.FC<ResumeTableProps> = ({ title, list, onMove, onDelete }) => {
  return (
    <div className={styles.tableSection}>
      <h4 className={styles.tableSubTitle}>{title}</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Period</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.period}</td>
              <td>
                <div className={styles.orderBtns}>
                  <button 
                    className={styles.orderBtn}
                    onClick={() => onMove(index, 'up', list)} 
                    disabled={index === 0}
                  >
                    ▲
                  </button>
                  <button 
                    className={styles.orderBtn}
                    onClick={() => onMove(index, 'down', list)} 
                    disabled={index === list.length - 1}
                  >
                    ▼
                  </button>
                </div>
              </td>
              <td>
                <button className={styles.deleteBtn} onClick={() => onDelete(item.id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeTable;