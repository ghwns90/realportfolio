import React from 'react';

const About: React.FC = () => {
  return (
    <article>
      <header>
        <h2 style={{ color : 'var(--text-white)', fontSize: '32px', marginBottom: '20px'}}>
          About Me
        </h2>
        <div style={{ width: '40px', height: '5px', background: 'var(--accent-gradient)', borderRadius: '3px', marginBottom: '30px'}}></div>
      </header>

      <section style={{ color: 'var(--text-gray)', lineHeight: '1.6', fontSize: '15px'}}>
        <p>
          안녕하세요! 저는 효율적인 코드와 세련된 UI를 지향하는 개발자 선배입니다. 
          현재 TypeScript와 Prisma를 활용한 풀스택 포트폴리오 프로젝트를 진행 중입니다.
        </p>
        <p style={{ marginTop: '20px' }}>
          단순히 기능을 구현하는 것을 넘어, 확장 가능한 아키텍처와 사용자 경험을 중요하게 생각합니다.
        </p>
      </section>
    </article>
      
  );
};

export default About;