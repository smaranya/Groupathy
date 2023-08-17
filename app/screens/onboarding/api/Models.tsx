export type OnboardingResponse = Map<string, OnboardingQuestions>;

export type OnboardingQuestions = {
  question: string;
  answer: any[];
  type?: string;
};

export type Organization = {
  name: string;
};
