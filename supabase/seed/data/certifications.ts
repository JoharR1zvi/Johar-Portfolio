// IELTS Band 8.0 is deliberately not here: per docs/CONTENT_FACTS.md it
// belongs under languages/communication, not as a technical certification.
// It's mentioned in the profile's about text instead.
export const certifications: {
  issuer: string | null;
  issueDate: string | null;
  priority: 'low' | 'normal';
  name: string;
}[] = [
  {
    issuer: null,
    issueDate: null,
    priority: 'low',
    name: 'Python for Data Science and Machine Learning Bootcamp',
  },
];
