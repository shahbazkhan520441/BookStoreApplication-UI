export class OtpVerificationResponse {
  constructor(
    public message?: string,
    public data?: {
      userId: number;
      username: string;
      success: boolean;
    }
  ) {}
}
