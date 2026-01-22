import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// 메일 전송 객체 설정
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // 이메일 주소
    pass: process.env.EMAIL_PASS, // 구글 앱 비밀번호
  },
});

export const sendNotificationEmail = async (name: string, email: string, message: string) => {
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `[Portfolio] ${name}님으로부터 새로운 메시지가 도착했습니다`,
    html: `
      <h3>새로운 문의 메시지</h3>
      <p><strong>보낸이:</strong> ${name} (${email})</p>
      <p><strong>내용:</strong></p>
      <div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">
        ${message}
      </div>
      <br />
      <a href="http://도메인/admin/dashboard">관리자 페이지에서 확인하기</a>
    `,

  };

  return transporter.sendMail(mailOptions);
}