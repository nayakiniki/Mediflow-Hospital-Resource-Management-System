import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Patient, BedAllocation, StaffOnDuty, MediFlowView } from '../../types';
import { 
  ArrowRight, 
  Activity, 
  Users, 
  Bed, 
  Stethoscope, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

interface PatientFlowProps {
  patients: Patient[];
  beds: BedAllocation[];
  staff: StaffOnDuty[];
  onNavigate?: (view: MediFlowView) => void;
  onSelectStage?: (stageId: string) => void;
}

interface FlowStage {
  id: string;
  name: string;
  description: string;
  count: number;
  unit: string;
  status: 'normal' | 'congested' | 'optimal';
  icon: any;
  targetView: MediFlowView;
}

export const PatientFlow: React.FC<PatientFlowProps> = ({
  patients,
  beds,
  staff,
  onNavigate,
  onSelectStage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Derive real counts from application state
  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const highCount = patients.filter(p => p.status === 'High').length;
  const stableCount = patients.filter(p => p.status === 'Stable').length;
  const totalOccupiedBeds = beds.reduce((acc, b) => acc + b.occupied, 0);
  const totalFreeBeds = beds.reduce((acc, b) => acc + b.available, 0);
  const totalDoctors = staff.reduce((acc, s) => acc + s.doctors, 0);

  const stages: FlowStage[] = useMemo(() => [
    {
      id: 'arrival',
      name: 'Patient Arrival',
      description: 'EMS & Walk-In Intake',
      count: 18,
      unit: 'arrivals / hr',
      status: 'normal',
      icon: Users,
      targetView: 'patients'
    },
    {
      id: 'assessment',
      name: 'Priority Assessment',
      description: 'qSOFA & Vitals Triage',
      count: criticalCount + 4,
      unit: 'in assessment',
      status: criticalCount > 5 ? 'congested' : 'normal',
      icon: Activity,
      targetView: 'patients'
    },
    {
      id: 'queue',
      name: 'Priority Queue',
      description: 'Triage Order Ranking',
      count: patients.length,
      unit: 'queued patients',
      status: criticalCount > 3 ? 'congested' : 'normal',
      icon: AlertTriangle,
      targetView: 'patients'
    },
    {
      id: 'allocation',
      name: 'Bed Allocation',
      description: 'ICU & Ward Bed Match',
      count: totalFreeBeds,
      unit: 'available beds',
      status: totalFreeBeds < 15 ? 'congested' : 'optimal',
      icon: Bed,
      targetView: 'beds'
    },
    {
      id: 'doctor',
      name: 'Doctor Assignment',
      description: 'Attending Physician Call',
      count: totalDoctors,
      unit: 'physicians active',
      status: 'normal',
      icon: Stethoscope,
      targetView: 'staff'
    },
    {
      id: 'treatment',
      name: 'Clinical Treatment',
      description: 'Inpatient Care & Telemetry',
      count: totalOccupiedBeds,
      unit: 'receiving care',
      status: 'normal',
      icon: Activity,
      targetView: 'dashboard'
    },
    {
      id: 'discharge',
      name: 'Discharge / Transfer',
      description: 'Step-Down & Outpatient',
      count: 14,
      unit: 'pending discharge',
      status: 'optimal',
      icon: CheckCircle2,
      targetView: 'beds'
    }
  ], [patients, beds, staff, criticalCount, totalFreeBeds, totalDoctors, totalOccupiedBeds]);

  // Subtle Particle Stream Animation on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 48);

    interface Particle {
      x: number;
      y: number;
      speed: number;
      radius: number;
      opacity: number;
      hue: string;
    }

    const particles: Particle[] = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height / 2 + (Math.random() - 0.5) * 14,
        speed: 0.6 + Math.random() * 0.8,
        radius: 1.5 + Math.random() * 1.5,
        opacity: 0.2 + Math.random() * 0.6,
        hue: i % 4 === 0 ? '#E88F89' : '#10B981'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting pipeline line
      ctx.beginPath();
      ctx.moveTo(10, height / 2);
      ctx.lineTo(width - 10, height / 2);
      ctx.strokeStyle = '#1F3729';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Render flow particles
      particles.forEach((p) => {
        if (!isPaused) {
          p.x += p.speed;
          if (p.x > width - 10) {
            p.x = 10;
            p.y = height / 2 + (Math.random() - 0.5) * 14;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaused]);

  return (
    <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E3B2A]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
            Operational Workflow Throughput
          </span>
          <h3 className="text-base font-serif font-bold text-white mt-0.5">
            Dynamic Patient-Resource Flow
          </h3>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Real-time movement through intake, acuity assessment, bed allocation, and physician care.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-[#183124] hover:bg-[#1E3B2A] text-slate-300 text-xs font-mono flex items-center gap-1 border border-[#274633]"
            title={isPaused ? 'Resume particle flow' : 'Pause particle flow'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[10px]">{isPaused ? 'Resume Flow' : 'Live Motion'}</span>
          </button>
        </div>
      </div>

      {/* Particle Canvas Line */}
      <div className="relative w-full h-8 overflow-hidden rounded-lg bg-[#0E1D15] border border-[#1E3728]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Flow Stage Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStage === stage.id;

          return (
            <div
              key={stage.id}
              onClick={() => {
                setActiveStage(stage.id);
                if (onSelectStage) onSelectStage(stage.id);
                if (onNavigate) onNavigate(stage.targetView);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#183124] border-[#E88F89] shadow-md shadow-[#E88F89]/15'
                  : 'bg-[#183124]/70 border-[#274633] hover:border-[#38644A] hover:bg-[#183124]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    stage.status === 'congested' ? 'bg-rose-500 animate-pulse' :
                    stage.status === 'optimal' ? 'bg-emerald-400' : 'bg-slate-400'
                  }`} />
                </div>

                <div className="flex items-center gap-1.5 text-white font-serif text-xs font-bold truncate">
                  <Icon className="w-3.5 h-3.5 text-[#E88F89] shrink-0" />
                  <span className="truncate">{stage.name}</span>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{stage.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#234230]/80">
                <span className="text-base font-mono font-bold text-white block">
                  {stage.count}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                  {stage.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
