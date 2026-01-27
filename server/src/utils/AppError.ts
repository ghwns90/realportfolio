// 글로벌 에러 핸들링

export class AppError extends Error {

  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    // 부모(Error)의 생성자 호출 (message 세팅)
    super(message);
    this.statusCode = statusCode;
    // 이 에러가 우리가 예상한 에러(Operational)인지, 
    // 프로그래밍 버그인지 구분하기 위한 플래그
    this.isOperational = true;

    // Error Stack Trace를 남기기 위함
    Error.captureStackTrace(this, this.constructor);

  }

}