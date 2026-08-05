export type SeverityLevel = 'info' | 'resolved' | 'warning' | 'critical' | 'cyber';

export interface FireSensor {
  id: string;
  name: string;
  type: 'Smoke' | 'Thermal IR' | 'Flame UV' | 'Gas (CO2)' | 'Water Mist Pressure';
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  value: string;
  unit: string;
  lastTested: string;
}

export interface Compartment {
  id: string;
  name: string;
  code: string;
  deck: string;
  fireZone: number;
  temperature: number; // °C
  smokePpm: number;
  pressureBar: number;
  waterMistStatus: 'Standby' | 'Pre-Discharge' | 'Active Spray' | 'Isolated' | 'Fault';
  valvePosition: 'Closed' | 'Open 100%' | 'Manual Override' | 'Throttled';
  sensorHealthPct: number;
  cyberStatus: 'Secured' | 'Anomaly Detected' | 'Isolated';
  status: 'safe' | 'warning' | 'critical' | 'cyber';
  sensorsCount: number;
  sensors: FireSensor[];
}

export interface NotificationItem {
  id: string;
  incidentNo: string;
  severity: SeverityLevel;
  title: string;
  compartmentId: string;
  compartmentName: string;
  fireZone: number;
  timestamp: string;
  shortDescription: string;
  affectedEquipment: string[];
  responsibleOfficer: string;
  assignedOfficerId?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalationStatus: 'Normal' | 'Level 1 Escalate' | 'Level 2 Escalate' | 'Bridge Emergency' | 'Captain Notified';
  recommendedAction: string;
  riskScore: number; // 0-100
  aiConfidence: number; // %
  sopId: string;
  timeline: {
    time: string;
    event: string;
    type: 'system' | 'sensor' | 'plc' | 'human' | 'cyber';
  }[];
}

export interface StakeholderMatrixRow {
  role: string;
  officerName: string;
  contactChannel: string;
  low: { notify: boolean; delay: string; method: string };
  medium: { notify: boolean; delay: string; method: string };
  high: { notify: boolean; delay: string; method: string };
  critical: { notify: boolean; delay: string; method: string };
  cyber: { notify: boolean; delay: string; method: string };
}

export interface VesselStatus {
  name: string;
  imoNumber: string;
  type: string;
  flag: string;
  overallHealth: number;
  mode: 'Normal Voyage' | 'In Port' | 'Emergency Fire Mode' | 'Cyber Containment' | 'Maintenance';
  availabilityPct: number;
  lat: string;
  lng: string;
  heading: number;
  speedKnots: number;
  seaState: string;
  waterMistTankLevelPct: number;
  waterMistMainPressureBar: number;
  primaryPlcStatus: 'Active - Primary' | 'Standby' | 'Fault';
  redundantPlcStatus: 'Active - Sync' | 'Standby' | 'Offline';
  cyberZeroTrustShield: 'Active (Secured)' | 'Alert' | 'Degraded';
  activeFireCount: number;
  activeCyberCount: number;
  activeWarningCount: number;
}

export interface CyberMetric {
  firewallHealthPct: number;
  idsIpsStatus: '100% Inspection Active' | 'Degraded' | 'Offline';
  failedLogins24h: number;
  networkSegmentation: 'Isolated VLANs (IEC 62443 SL3)' | 'Warning';
  certValidity: string;
  threatsBlockedToday: number;
  activeIncidents: {
    id: string;
    node: string;
    protocol: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    timestamp: string;
  }[];
}

export interface SOPStep {
  id: number;
  title: string;
  description: string;
  automated: boolean;
  completed: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: 'manager' | 'engineer' | 'system' | 'captain';
  action: string;
  details: string;
  category: 'auth' | 'simulation' | 'incident' | 'system' | 'role_switch' | 'settings';
}

