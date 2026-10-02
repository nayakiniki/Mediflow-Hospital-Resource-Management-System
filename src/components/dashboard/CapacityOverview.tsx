import React from 'react';
import { BedAllocation, StaffOnDuty, MediFlowView } from '../../types';
import { HospitalCapacityScene } from '../3d/HospitalCapacityScene';

interface CapacityOverviewProps {
  beds: BedAllocation[];
  staff: StaffOnDuty[];
  onNavigate: (view: MediFlowView) => void;
  onSelectWard?: (ward: string) => void;
}

export const CapacityOverview: React.FC<CapacityOverviewProps> = ({
  beds,
  staff,
  onNavigate,
  onSelectWard
}) => {
  return (
    <div className="space-y-4">
      <HospitalCapacityScene
        beds={beds}
        staff={staff}
        onNavigate={onNavigate}
        onSelectWard={onSelectWard}
      />
    </div>
  );
};
