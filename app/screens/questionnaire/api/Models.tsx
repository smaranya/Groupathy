export type GroupQuestionairreResponse = {
  sessionId: string;
  tnc: string;
  questions: Array<QuestionsResponse>;
  suicideCheck?: string;
};

export type QuestionsResponse = {
  id: number;
  data: string;
  answer: Array<AnswerResponse>;
};

export type AnswerResponse = {
  id: number;
  data: string;
};

export type QuestionairreResultResquest = {
  session_id: string;
  group_sub_type_id: number;
  result: Array<SelectedAnswer>;
};

export type SelectedAnswer = {
  question_id: number;
  answer_id: number;
};
