// типы
export interface Dog {
  id: string;
  filename: string;
  url: string;
  likes: number;
  fileType: 'image' | 'video';
}

export type DogsResponse = Dog[];
