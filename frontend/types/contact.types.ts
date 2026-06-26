export interface ContactInfoCardItem {
  id: string;
  title: string;
  description: string;
  value: string;
  href?: string;
  type: "email" | "chat" | "time" | "faq" | "hours";
}

export interface ContactFormValues {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  agreeToPolicy: boolean;
}
