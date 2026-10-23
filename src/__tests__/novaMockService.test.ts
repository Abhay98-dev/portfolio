import { describe, it, expect } from 'vitest';
import { NovaMockService } from '../features/nova/novaMockService';

describe('NovaMockService', () => {
  const service = new NovaMockService();

  it('provides the initial greeting message', async () => {
    const greeting = await service.getInitialGreeting();
    expect(greeting.sender).toBe('nova');
    expect(greeting.text).toContain("Welcome aboard! I'm NOVA");
    expect(greeting.quickActions?.length).toBeGreaterThan(0);
  });

  it('provides suggested prompts for visitors', () => {
    const prompts = service.getSuggestedPrompts();
    expect(prompts).toContain('Show me the projects.');
    expect(prompts).toContain('Explain AgriChain.');
    expect(prompts).toContain('Show backend skills.');
  });

  it('recognizes project requests and returns navigation to engineering bay', async () => {
    const res = await service.sendMessage({ message: 'Show me the projects.' });
    expect(res.actionType).toBe('navigate');
    expect(res.destination).toBe('projects');
    expect(res.assistantMessage).toContain('Engineering Bay');
  });

  it('recognizes AgriChain inquiries and opens project blueprint', async () => {
    const res = await service.sendMessage({ message: 'Explain AgriChain' });
    expect(res.actionType).toBe('open_project');
    expect(res.projectId).toBe('agrichain');
    expect(res.assistantMessage).toContain('farmer-focused');
  });

  it('recognizes skills requests and returns navigation to ship core', async () => {
    const res = await service.sendMessage({ message: 'Show backend skills' });
    expect(res.actionType).toBe('navigate');
    expect(res.destination).toBe('skills');
    expect(res.assistantMessage).toContain("Ship's Core");
  });

  it('recognizes contact requests and returns navigation to communications room', async () => {
    const res = await service.sendMessage({ message: 'Take me to the contact section.' });
    expect(res.actionType).toBe('navigate');
    expect(res.destination).toBe('contact');
    expect(res.assistantMessage).toContain('communications');
  });

  it('handles arbitrary queries gracefully with polite clarification', async () => {
    const res = await service.sendMessage({ message: 'What is the airspeed velocity of an unladen swallow?' });
    expect(res.executionStatus).toBe('clarification_needed');
    expect(res.suggestedFollowUps?.length).toBeGreaterThan(0);
  });
});
