export interface DepartmentInfo {
  id: 'ICU' | 'Emergency' | 'General Ward' | 'Surgical';
  name: string;
  floor: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyPercent: number;
  status: 'Normal' | 'Approaching' | 'Critical';
  activePatients: number;
  doctorsOnDuty: number;
  nursesOnDuty: number;
  equipmentCount: number;
  leadPhysician: string;
  colorHex: number;
  colorCss: string;
}

export function getDepartmentStatus(occupancyPercent: number): 'Normal' | 'Approaching' | 'Critical' {
  if (occupancyPercent >= 85) return 'Critical';
  if (occupancyPercent >= 75) return 'Approaching';
  return 'Normal';
}

export function getStatusColor(status: 'Normal' | 'Approaching' | 'Critical'): { hex: number; css: string } {
  switch (status) {
    case 'Critical':
      return { hex: 0xC93838, css: '#C93838' }; // Controlled Crimson
    case 'Approaching':
      return { hex: 0xD97706, css: '#D97706' }; // Warm Amber
    case 'Normal':
      return { hex: 0x10B981, css: '#10B981' }; // Clean Emerald
  }
}
