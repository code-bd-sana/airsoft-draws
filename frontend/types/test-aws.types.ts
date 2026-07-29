export interface CreateTestAwDto {
  name: string;
  image: string;
  gallary?: string[];
  video?: string;
  videos?: string[];
}

export interface TestAwResponse {
  id?: number | string;
  name: string;
  image: string;
  gallary?: string[];
  video?: string;
  videos?: string[];
  createdAt?: string;
}
