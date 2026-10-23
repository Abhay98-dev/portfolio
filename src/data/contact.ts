export interface ContactLink {
  label: string;
  value: string;
  href: string;
  iconName: 'Mail' | 'Github' | 'Linkedin' | 'FileText' | 'Send' | 'Terminal';
  isExternal: boolean;
  category: 'direct' | 'social' | 'document';
  description: string;
}

export interface ContactData {
  title: string;
  subtitle: string;
  transmissionFrequency: string;
  quantumEncryptionStatus: string;
  directEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeDownloadUrl: string;
  links: ContactLink[];
}

export const contactData: ContactData = {
  title: "Sub-Space Quantum Transmitter",
  subtitle: "Open for backend engineering roles, collaborations, and technical discussions.",
  transmissionFrequency: "FREQ 1420.405 MHz // HYDROGEN LINE",
  quantumEncryptionStatus: "QUANTUM ENCRYPTION ACTIVE // TLS 1.3",
  directEmail: "abhaychachar98@gmail.com",
  githubUrl: "https://github.com/Abhay98-dev",
  linkedinUrl: "https://www.linkedin.com/in/abhay-chachar",
  resumeDownloadUrl: "/resume.pdf",
  links: [
    {
      label: "Direct Email Transmission",
      value: "abhaychachar98@gmail.com",
      href: "mailto:abhaychachar98@gmail.com",
      iconName: "Mail",
      isExternal: true,
      category: "direct",
      description: "Direct link to send an email to Abhay Chachar"
    },
    {
      label: "GitHub Code Repository",
      value: "github.com/Abhay98-dev",
      href: "https://github.com/Abhay98-dev",
      iconName: "Github",
      isExternal: true,
      category: "social",
      description: "Browse repositories, backend codebases, and contributions"
    },
    {
      label: "LinkedIn Professional Profile",
      value: "linkedin.com/in/abhay-chachar",
      href: "https://www.linkedin.com/in/abhay-chachar",
      iconName: "Linkedin",
      isExternal: true,
      category: "social",
      description: "Connect for professional opportunities and industry updates"
    },
    {
      label: "Curriculum Vitae / Resume",
      value: "Abhay_Chachar_Resume.pdf",
      href: "/resume.pdf",
      iconName: "FileText",
      isExternal: false,
      category: "document",
      description: "Static downloadable resume file summarizing skills & experience"
    }
  ]
};
