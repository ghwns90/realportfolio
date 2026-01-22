import { prisma } from "lib/prisma";
import { sendNotificationEmail, transporter } from "utils/mail.util";

/* -------------메시지 목록 가져오기 ----------------*/
// export const getAllMessages = async () => {
  
//   const messages = await prisma.contactMessage.findMany({
//     orderBy: { createdAt: 'desc' }
//   });
 
//   return messages;
// }

/**------------메시지 페이지에맞게 가져오기------------*/
export const getMessagesPaged = async ( page: number, limit: number ) => {
  const skip = (page-1) * limit;

  const [total, items] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.findMany({
      skip: skip,
      take: limit,
      orderBy: {createdAt: 'desc'}
    })
  ]);

  return {
    items, total, totalPages: Math.ceil(total / limit)
  };
};

/** ------------ 답장 보내기 -------------------- */
export const replyToMessage = async (id: number, replyContent: string) => {

  const originalMsg = await prisma.contactMessage.findUnique({ where: { id } });

  if(!originalMsg) throw new Error('메시지를 찾을 수 없습니다.');

  // 상대방에게 메일 보내기
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: originalMsg.email,
    subject: `Re: [Portfolio] 안녕하세요 ${originalMsg.name}님, 답변드립니다.`,
    text: replyContent,
    html: `<p>${replyContent.replace(/\n/g, '<br>')}</p>`
  });

  return await prisma.contactMessage.update({
    where: { id },
    data: {
      replyContent,
      repliedAt: new Date(),
      isRead: true, // 자동 읽음 처리
    }
  });
};

/* ------------ 메시지 보내기-------------- */
export const createContactMessage = async (data: {name: string; email: string; message: string}) => {

  // DB 먼저 저장
  const newMessage = await prisma.contactMessage.create({
    data
  });

  // 나에게 메일 알림 발송
  sendNotificationEmail(data.name, data.email, data.message).catch(err => console.error('메일 발송 실패: ',err));

  return newMessage;
};

/*-----------------메시지 읽음 처리----------------------*/
export const markAsRead = async (id: number) => {

  return await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true }
  });
} 

/** -------------- 안읽은 메시지 갯수 가져오기 ---------------- */
export const getUnreadCount = async () => {

  const unreadCount = await prisma.contactMessage.count({
    where: {
      isRead: false,
    },
  });

  return unreadCount;
};