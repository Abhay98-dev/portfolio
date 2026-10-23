export type DestinationId = 'hub' | 'about' | 'projects' | 'skills' | 'education' | 'contact';

export interface CameraCoordinate {
  x: number;
  y: number;
  z: number;
}

export interface DestinationConfig {
  id: DestinationId;
  name: string;
  code: string;
  deckName: string;
  deckNumber: string;
  purpose: string;
  description: string;
  cameraPosition: CameraCoordinate;
  cameraTarget: CameraCoordinate;
  accentColor: string;
  interactiveObjectLabel: string;
}

export const DESTINATIONS: Record<DestinationId, DestinationConfig> = {
  hub: {
    id: 'hub',
    name: 'Central Hub',
    code: 'HUB-00',
    deckName: 'Panoramic Cockpit Bridge',
    deckNumber: 'DECK 0',
    purpose: 'Central Navigation & Overview',
    description: 'The panoramic flight bridge of the ABHAYVERSE starship with massive space windows overlooking the cosmos.',
    cameraPosition: { x: 8, y: 8, z: 22 },
    cameraTarget: { x: 0, y: 0.5, z: 0 },
    accentColor: '#00f2fe',
    interactiveObjectLabel: 'Central Stellar Compass'
  },
  about: {
    id: 'about',
    name: 'Command Deck',
    code: 'CMD-01',
    deckName: 'Primary Helm & Forward Viewport',
    deckNumber: 'DECK 1',
    purpose: 'Personal Identity & Directives',
    description: 'Forward command station directly before the massive panoramic window overlooking the ringed gas giant.',
    cameraPosition: { x: 0, y: 2.2, z: -11.5 },
    cameraTarget: { x: 0, y: 1.8, z: -19.5 },
    accentColor: '#00f2fe',
    interactiveObjectLabel: 'Command Console'
  },
  projects: {
    id: 'projects',
    name: 'Engineering Bay',
    code: 'ENG-02',
    deckName: 'Starboard Propulsion & Fabrication',
    deckNumber: 'DECK 2',
    purpose: 'Featured Projects & Code Architecture',
    description: 'High-tech fabrication hangar hosting interactive holographic blueprints for AgriChain, Expense Tracker, Crictally, and more.',
    cameraPosition: { x: 12.8, y: 2.4, z: 3.6 },
    cameraTarget: { x: 18.5, y: 1.8, z: 0 },
    accentColor: '#38bdf8',
    interactiveObjectLabel: 'Holographic Project Arrays'
  },
  skills: {
    id: 'skills',
    name: "Ship's Core",
    code: 'COR-03',
    deckName: 'Sub-Level Plasma Reactor',
    deckNumber: 'DECK 3',
    purpose: 'Technical Skills & Matrix Nodes',
    description: 'The beating energetic heart of the vessel with pulsating plasma coils and orbital technology knowledge rings.',
    cameraPosition: { x: 0, y: 2.8, z: 4.8 },
    cameraTarget: { x: 0, y: 0.4, z: -2.5 },
    accentColor: '#9d4edd',
    interactiveObjectLabel: 'Quantum Core Matrix'
  },
  education: {
    id: 'education',
    name: 'Navigation Archive',
    code: 'NAV-04',
    deckName: 'Port Astrometrics & Starmap',
    deckNumber: 'DECK 4',
    purpose: 'Education, Journey & Achievements',
    description: 'Astrometric laboratory with celestial starmap charting academic foundations, milestones, and hackathon victories.',
    cameraPosition: { x: -12.8, y: 2.4, z: 3.6 },
    cameraTarget: { x: -18.5, y: 1.8, z: 0 },
    accentColor: '#818cf8',
    interactiveObjectLabel: 'Astrometrics Cartography Table'
  },
  contact: {
    id: 'contact',
    name: 'Communications Room',
    code: 'COM-05',
    deckName: 'Aft Quantum Array & Transceiver',
    deckNumber: 'DECK 5',
    purpose: 'Contact, Transmission & Resume',
    description: 'Long-range tachyon transceiver station for establishing direct communication channels and downloading credentials.',
    cameraPosition: { x: 0, y: 2.8, z: 12.2 },
    cameraTarget: { x: 0, y: 1.8, z: 18.0 },
    accentColor: '#34d399',
    interactiveObjectLabel: 'Quantum Uplink Terminal'
  }
};

export const DESTINATION_LIST: DestinationConfig[] = Object.values(DESTINATIONS);
