export type AIOutput = {
  category: string;
  class_id: number;
  class_name: string;
  bbox: [number, number, number, number];
  conf: number;
};

export type AIResult = {
  outputs: AIOutput[];
};