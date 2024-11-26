export interface OtpVerificationResponse {
  message?: string;
  data?: {
    userId: number;
    username: string;
    success: boolean;
  };
   
  }

 