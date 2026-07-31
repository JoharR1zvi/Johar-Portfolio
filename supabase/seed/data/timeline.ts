export const timelineItems: {
  itemType: 'education' | 'employment' | 'internship' | 'milestone';
  organization: string;
  startDate: string;
  endDate: string | null;
  displayOrder: number;
  title: string;
  description: string;
}[] = [
  {
    itemType: 'education',
    organization: 'Carl von Ossietzky University of Oldenburg',
    startDate: '2025-10-01',
    endDate: null,
    displayOrder: 1,
    title: 'MSc Data Science and Machine Learning',
    description:
      'Specializing in medical data / Data Science and Machine Learning in Medicine and Health Care. In progress, no graduation date yet.',
  },
  {
    itemType: 'employment',
    organization: 'Remote Software Solutions (FLR Spectron)',
    startDate: '2024-07-01',
    endDate: '2025-09-01',
    displayOrder: 2,
    title: 'Junior Technical Project Manager',
    description:
      'Delivered 5+ technical projects with cross-functional teams, including budget responsibility on projects exceeding $1M.',
  },
  {
    itemType: 'internship',
    organization: 'Inertia Technologies',
    startDate: '2023-07-01',
    endDate: '2023-08-31',
    displayOrder: 3,
    title: 'Artificial Intelligence Intern',
    description:
      'Built a RAG assistant for natural-language search over 3,000+ pages of Goa Legislative Assembly records using GPT-4, embeddings, and Pinecone.',
  },
  {
    itemType: 'education',
    organization: 'Padre Conceicao College of Engineering',
    startDate: '2020-08-01',
    endDate: '2024-07-31',
    displayOrder: 4,
    title: 'BEng Information Technology',
    description: '',
  },
];
