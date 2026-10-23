import { describe, it, expect } from 'vitest';
import { projectsData } from '../data/projects';
import { skillsData } from '../data/skills';
import { DESTINATION_LIST } from '../features/spaceship/destinations';
import { contactData } from '../data/contact';
import { profileData } from '../data/profile';

describe('Portfolio Data & Space Configuration Integrity', () => {
  it('contains exactly the specified projects with verified details', () => {
    const projectIds = projectsData.map((p) => p.id);
    expect(projectIds).toContain('agrichain');
    expect(projectIds).toContain('expense-tracker');
    expect(projectIds).toContain('crictally');
    expect(projectIds).toContain('pet-adoption-portal');

    // AgriChain verification
    const agri = projectsData.find((p) => p.id === 'agrichain')!;
    expect(agri.githubUrl).toBe('https://github.com/Abhay98-dev/AgriChain-Backend');
    expect(agri.frontendGithubUrl).toBe('https://github.com/Abhay98-dev/AgriChain-frontend');
    expect(agri.liveDemoUrl).toBe('https://agri-chain-frontend-five.vercel.app/');
    expect(agri.technologies).toContain('Node.js');
    expect(agri.technologies).toContain('Express.js');
    expect(agri.technologies).toContain('MongoDB');
    expect(agri.technologies).toContain('JWT');

    // Crictally verification
    const cric = projectsData.find((p) => p.id === 'crictally')!;
    expect(cric.status).toBe('In Development');
    expect(cric.technologies).toContain('Supabase');
    expect(cric.technologies).toContain('Redis');
  });

  it('contains all 5 technical skill categories with detailed nodes', () => {
    const categoryIds = skillsData.map((c) => c.id);
    expect(categoryIds).toContain('backend');
    expect(categoryIds).toContain('databases');
    expect(categoryIds).toContain('frontend');
    expect(categoryIds).toContain('ai');
    expect(categoryIds).toContain('infrastructure');

    const backend = skillsData.find((c) => c.id === 'backend')!;
    const backendSkillNames = backend.skills.map((s) => s.name);
    expect(backendSkillNames).toContain('Node.js');
    expect(backendSkillNames).toContain('Express.js');
    expect(backendSkillNames).toContain('REST APIs');
    expect(backendSkillNames).toContain('Authentication & JWT');
    expect(backendSkillNames).toContain('API Security & Validation');
  });

  it('defines valid coordinates and camera targets for all 6 destinations', () => {
    expect(DESTINATION_LIST.length).toBe(6);
    for (const dest of DESTINATION_LIST) {
      expect(typeof dest.cameraPosition.x).toBe('number');
      expect(typeof dest.cameraPosition.y).toBe('number');
      expect(typeof dest.cameraPosition.z).toBe('number');
      expect(typeof dest.cameraTarget.x).toBe('number');
      expect(typeof dest.cameraTarget.y).toBe('number');
      expect(typeof dest.cameraTarget.z).toBe('number');
      expect(dest.name).toBeTruthy();
      expect(dest.deckNumber).toBeTruthy();
    }
  });

  it('contains contact links with confirmed URLs and static resume path', () => {
    expect(contactData.directEmail).toBe('abhaychachar98@gmail.com');
    expect(contactData.githubUrl).toBe('https://github.com/Abhay98-dev');
    expect(contactData.linkedinUrl).toContain('linkedin.com/in/abhay-chachar');
    expect(contactData.resumeDownloadUrl).toBe('/resume.pdf');
  });

  it('displays correct profile introduction matching specifications', () => {
    expect(profileData.bio).toBe(
      "I'm Abhay, a computer engineering student interested in backend engineering, scalable systems, and AI-powered applications. I enjoy building practical software and exploring how complex systems work."
    );
    expect(profileData.name).toBe('Abhay Chachar');
  });
});
