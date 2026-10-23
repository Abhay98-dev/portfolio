import { profileData, ProfileData } from '../data/profile';
import { projectsData, ProjectData } from '../data/projects';
import { skillsData, SkillCategory } from '../data/skills';
import { educationData, EducationItem } from '../data/education';
import { achievementsData, MilestoneItem } from '../data/achievements';
import { contactData, ContactData } from '../data/contact';
import { ApiResponse } from './apiClient';

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactSubmissionResult {
  messageId: string;
  status: 'sent' | 'queued';
  timestamp: string;
  feedbackNote: string;
}

export interface IPortfolioService {
  getProfile(): Promise<ApiResponse<ProfileData>>;
  getProjects(): Promise<ApiResponse<ProjectData[]>>;
  getProjectById(id: string): Promise<ApiResponse<ProjectData | null>>;
  getSkills(): Promise<ApiResponse<SkillCategory[]>>;
  getEducation(): Promise<ApiResponse<EducationItem[]>>;
  getAchievements(): Promise<ApiResponse<MilestoneItem[]>>;
  getContactInfo(): Promise<ApiResponse<ContactData>>;
  submitContactMessage(payload: ContactSubmissionPayload): Promise<ApiResponse<ContactSubmissionResult>>;
}

/**
 * MockPortfolioService returns local TypeScript data with realistic async resolution.
 * When real backend endpoints are ready, replace this with HttpPortfolioService.
 */
export class MockPortfolioService implements IPortfolioService {
  async getProfile(): Promise<ApiResponse<ProfileData>> {
    return { success: true, data: profileData };
  }

  async getProjects(): Promise<ApiResponse<ProjectData[]>> {
    return { success: true, data: projectsData };
  }

  async getProjectById(id: string): Promise<ApiResponse<ProjectData | null>> {
    const project = projectsData.find((p) => p.id === id) || null;
    return { success: true, data: project };
  }

  async getSkills(): Promise<ApiResponse<SkillCategory[]>> {
    return { success: true, data: skillsData };
  }

  async getEducation(): Promise<ApiResponse<EducationItem[]>> {
    return { success: true, data: educationData };
  }

  async getAchievements(): Promise<ApiResponse<MilestoneItem[]>> {
    return { success: true, data: achievementsData };
  }

  async getContactInfo(): Promise<ApiResponse<ContactData>> {
    return { success: true, data: contactData };
  }

  async submitContactMessage(payload: ContactSubmissionPayload): Promise<ApiResponse<ContactSubmissionResult>> {
    // Simulated short network delay (400ms) for realistic UX feedback
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Simple client-side validation simulation
    if (!payload.name || !payload.email || !payload.message) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, email, and message are required fields.',
        },
      };
    }

    return {
      success: true,
      data: {
        messageId: `TX-${Date.now().toString(36).toUpperCase()}`,
        status: 'sent',
        timestamp: new Date().toISOString(),
        feedbackNote: 'Transmission successfully relayed to Abhay Chachar.',
      },
    };
  }
}

// Export singleton instance. Can be swapped for HttpPortfolioService in the future!
export const portfolioService: IPortfolioService = new MockPortfolioService();
