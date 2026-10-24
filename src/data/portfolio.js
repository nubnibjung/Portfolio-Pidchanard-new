export const profile = {
  initials: 'PM',
  name: 'Pidchanard',
  surname: 'Mueanson',
  role: 'Frontend Developer',
  currentPosition: 'Frontend Developer @Lodash Thailand',
  photoUrl: '/profile-congraduation.jpg',
  resumeUrl: '/CV_%E0%B8%9E%E0%B8%B4%E0%B8%8A%E0%B8%8D%E0%B9%8C%E0%B8%99%E0%B8%B2%E0%B8%8F%20%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%98%E0%B8%B4%E0%B9%8C.pdf',
  resumeFileName: 'Pidchanard-Mueanson-CV.pdf',
  email: 'pidchanard.m@gmail.com',
  location: 'Bangkok 10250, Thailand',
  tagline: 'Building Better Digital Experiences, One Project at a Time',
  summary:
    'Full-Stack Developer specializing in Frontend (Angular/Tailwind) and Android platforms. I bridge the gap between web and mobile by leveraging a strong foundation in .NET and a problem-solving mindset. Dedicated to mastering modern frameworks and committed to building scalable, user-centric applications for every screen.',
  githubUrl: 'https://github.com/nubnibjung',
  linkedinUrl: 'https://www.linkedin.com/in/pidchanard-mueanson-44a878325/',
};

export const navigationItems = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Work' },
  { href: '#skills', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Awards' },
  { href: '#contact', label: 'Contact' },
];

export const roles = [
  'Full-Stack Developer',
  'Junior Frontend Developer',
  'Internship Developer',
  'Android Developer',
];

export const stats = [
  { value: '1', label: 'Year internship experience' },
  { value: '4', label: 'Featured CV projects' },
  { value: '3.36', label: 'GPA at Kasetsart University' },
  { value: 'IT', label: 'B.Sc. Information Technology graduate' },
];

export const skills = [
  {
    title: 'Languages',
    items: ['Go', 'Rust', 'HTML', 'CSS', 'Kotlin', 'Python', 'C++'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Angular', 'Tailwind CSS', 'Angular Signals', 'RxJS', 'Flutter', 'Micro Frontend', 'Component-Based Architecture'],
  },
  {
    title: 'Backend',
    items: ['.NET', 'Node.js'],
  },
  {
    title: 'Databases',
    items: ['MSSQL', 'MySQL', 'PostgreSQL'],
  },
  {
    title: 'Tools & DevOps',
    items: ['Git', 'Docker', 'Jira', 'Figma', 'Postman', 'Swagger', 'VS Code'],
  },
];

export const experiences = [
  {
    title: 'Frontend Developer',
    company: 'Lodash Thailand',
    logo: '/logos/lodash.jpg',
    logoFit: 'cover', // the logo has its own dark background, so fill the tile
    color: '#1f1430',
    date: 'Aug 2026 - Present',
    type: 'Full-time',
    location: 'Bangkok, Thailand',
    current: true,
    description:
      'Building web product features with React, working alongside Go and Rust services in Docker.',
    // Wrap a phrase in **double asterisks** to highlight it.
    highlights: [
      'Build and ship user-facing features with **React**, turning designs into responsive, accessible interfaces.',
      'Work across the stack with services written in **Go** and **Rust**, integrating the frontend with their APIs.',
      'Run and test the full system locally with **Docker**, keeping development close to production.',
    ],
    tags: ['React', 'TypeScript', 'Go', 'Rust', 'Docker'],
  },
  {
    title: 'Internship Developer',
    company: 'Gofive',
    companyUrl: 'https://www.gofive.co.th/',
    logo: '/logos/gofive.png',
    color: '#ffffff',
    date: 'Apr 2025 - Apr 2026',
    type: 'Internship',
    location: 'Bangkok, Thailand',
    description:
      'Enhanced CRM and e-commerce platforms using Angular and Tailwind CSS in an Agile team.',
    // Wrap a phrase in **double asterisks** to highlight it.
    highlights: [
      'Collaborated in an **Agile (Scrum)** team to enhance **CRM and e-commerce platforms** using Angular and Tailwind CSS.',
      'Improved user experience by implementing **Dark Mode**, resolving UI jitter, and integrating interactive feedback components.',
      'Optimized system reliability by fixing complex rendering bugs, data validation logic, and HTML formatting issues.',
      'Executed system migration of legacy components to a **Micro Frontend** architecture aligned with modern Design System and Clean Code principles.',
    ],
    tags: ['Angular', 'Tailwind CSS', 'RxJS', 'Angular Signals', 'Micro Frontend'],
  },
];

export const education = {
  school: 'Kasetsart University, Sriracha Campus',
  degree: 'Bachelor of Science in Information Technology',
  period: 'June 2022 - April 2026',
  description: 'GPA 3.36, Good Study Award, and Very Good Oral Presentation Award.',
};

export const projects = [
  {
    title: 'CloudCut',
    year: '2026',
    tagline: 'Video editing in the browser',
    cover: '/projects/cloudcut.jpg',
    color: '#2dd4bf',
    description:
      'A web-based video editing platform that lets users create video projects and add images, video clips, and audio assets to their edits.',
    tech: ['Rust', 'PostgreSQL', 'Docker', 'React'],
    links: [
      { label: 'Live Demo', href: 'https://cloudcut-frontend.onrender.com/' },
      { label: 'Source', href: 'https://github.com/nubnibjung/cloud-cut-pidchanard' },
    ],
  },
  {
    title: 'ScoopHub',
    year: '2025',
    tagline: 'An ice cream shop, online',
    cover: '/projects/scoophub.jpg',
    color: '#f472b6',
    description:
      'A complete online ice cream shop with dynamic product catalog, shopping cart, order tracking, inventory control, user account management, and secure transaction records.',
    tech: ['PHP', 'MySQL', 'E-commerce'],
    links: [
      { label: 'Live Demo', href: 'https://icecreampidchanard.infinityfree.me/' },
      { label: 'Source', href: 'https://github.com/pidchanard/icecream_shop' },
    ],
  },
  {
    title: 'VillaReserve',
    year: '2024',
    tagline: 'Clubhouse booking without clashes',
    cover: '/projects/villareserve.jpg',
    color: '#34d399',
    description:
      'A village facility booking system for housing estates with real-time scheduling, automated conflict resolution to prevent double bookings, and an administrative dashboard for monitoring usage quotas and approving requests.',
    tech: ['Angular', '.NET', 'SQL Server'],
    links: [
      { label: 'Live Demo', href: 'https://village-club.netlify.app/' },
      { label: 'Source', href: 'https://github.com/pidchanard/VillageClubHouse-demo' },
    ],
  },
  {
    title: 'Namkub',
    year: '2023',
    tagline: 'Drinking water, delivered',
    cover: '/projects/namkub.jpg',
    color: '#60a5fa',
    description:
      'A water distribution and e-commerce platform built with Angular and Node.js (Express), featuring a responsive product catalog, real-time shopping cart management, multi-step checkout workflow, Reactive Forms validation, and RESTful API integration.',
    tech: ['Angular', 'Node.js', 'Express', 'MSSQL', 'Reactive Forms', 'REST API'],
    links: [
      { label: 'Live Demo', href: 'https://numkub.netlify.app/' },
      { label: 'Source', href: 'https://github.com/pidchanard/NAMKUB-Store-me' },
    ],
  },
];

export const achievements = [
  {
    title: 'Hackathon Prototype',
    date: '2024',
    location: 'Bangkok, Thailand',
    description:
      'Built a working prototype under tight deadlines while collaborating on product scope, UI, and technical implementation.',
  },
  {
    title: 'Programming Competition',
    date: '2023',
    location: 'Thailand',
    description:
      'Practiced algorithmic problem solving, team communication, and rapid debugging in a competitive environment.',
  },
  {
    title: 'Open Learning Projects',
    date: '2022 - Present',
    location: 'Remote',
    description:
      'Continuously improves by building projects, reading technical documentation, and refining code quality through iteration.',
  },
];
