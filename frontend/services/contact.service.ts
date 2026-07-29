import { api } from "./api";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const contactService = {
  async sendContactMessage(payload: ContactPayload) {
    const response = await api.post("/contact", payload);
    return response.data;
  },
};
