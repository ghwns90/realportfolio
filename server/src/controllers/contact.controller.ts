import { Request, Response } from 'express';
import * as contactService from '../services/contact.service';
import { contactSchema, replySchema } from '../dtos/contact.dto';

/** --------- 메시지 가져오기--------------- */
// export const getMessages = async (req: Request, res: Response) => {

//   try {

//     const messages = await contactService.getAllMessages();

//     res.status(200).json(messages);

//   } catch (error) {
//     res.status(500).json({message: '메일 목록 가져오기 에러'});
//   }
// };

/** ---------------메시지 가져오기 페이징-------------------- */
export const getMessages = async (req: Request, res: Response) => {

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await contactService.getMessagesPaged(page, limit);

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: "메시지 조회 실패" });
  }
};

/**------------메시지 보내기 -------------------- */
export const createMessage = async (req: Request, res: Response) => {
  
  const validateData = contactSchema.parse(req.body);

  const result = await contactService.createContactMessage(validateData);

  res.status(201).json(result);
};

/**-----------------답장 보내기------------------------ */
export const sendReply = async (req: Request, res:Response) => {

  const { id } = req.params;
  const { replyContent } = replySchema.parse(req.body);

  const result = await contactService.replyToMessage(Number(id), replyContent);

  res.json(result);
};