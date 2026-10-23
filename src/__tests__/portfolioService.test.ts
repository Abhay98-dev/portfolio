import { describe, it, expect } from 'vitest';
import { portfolioService } from '../services/portfolioService';

describe('PortfolioService Contract', () => {
  it('retrieves profile data through service abstraction', async () => {
    const res = await portfolioService.getProfile();
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('Abhay Chachar');
  });

  it('retrieves all projects and individual project by ID', async () => {
    const all = await portfolioService.getProjects();
    expect(all.success).toBe(true);
    expect(all.data?.length).toBeGreaterThanOrEqual(4);

    const single = await portfolioService.getProjectById('agrichain');
    expect(single.success).toBe(true);
    expect(single.data?.name).toBe('AgriChain');

    const notFound = await portfolioService.getProjectById('nonexistent');
    expect(notFound.success).toBe(true);
    expect(notFound.data).toBeNull();
  });

  it('validates contact form submission payload', async () => {
    const failRes = await portfolioService.submitContactMessage({
      name: '',
      email: '',
      message: '',
    });
    expect(failRes.success).toBe(false);
    expect(failRes.error?.code).toBe('VALIDATION_ERROR');

    const successRes = await portfolioService.submitContactMessage({
      name: 'Dr. Ellie Arroway',
      email: 'ellie@seti.org',
      message: 'Detected prime pulses from Vega.',
    });
    expect(successRes.success).toBe(true);
    expect(successRes.data?.status).toBe('sent');
    expect(successRes.data?.messageId).toMatch(/^TX-/);
  });
});
