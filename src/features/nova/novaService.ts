/**
 * Nova Service Dispatcher
 * 
 * Central entry point for all NOVA interactions.
 * Currently backed by NovaMockService.
 * 
 * To switch to a real backend later, implement HttpNovaService and change the exported instance here.
 */

import { NovaService } from './novaTypes';
import { novaMockService } from './novaMockService';

// Active service instance: Currently using the mock service
export const novaService: NovaService = novaMockService;

export * from './novaTypes';
