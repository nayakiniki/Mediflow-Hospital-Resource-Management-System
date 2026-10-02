import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { BedAllocation, StaffOnDuty, MediFlowView } from '../../types';
import { DepartmentInfo, getDepartmentStatus, getStatusColor } from './DepartmentModel';
import { SceneControls } from './SceneControls';
import { 
  Building2, 
  Bed, 
  Users, 
  Stethoscope, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HospitalCapacitySceneProps {
  beds: BedAllocation[];
  staff: StaffOnDuty[];
  onNavigate: (view: MediFlowView) => void;
  onSelectWard?: (ward: string) => void;
}

export const HospitalCapacityScene: React.FC<HospitalCapacitySceneProps> = ({
  beds,
  staff,
  onNavigate,
  onSelectWard
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredDept, setHoveredDept] = useState<DepartmentInfo | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Map beds and staff data into DepartmentInfo structures
  const departments: DepartmentInfo[] = useMemo(() => {
    const list: DepartmentInfo[] = [
      {
        id: 'ICU',
        name: 'Intensive Care Unit',
        floor: '2nd Floor · Critical Wing',
        totalBeds: 46,
        occupiedBeds: 40,
        availableBeds: 6,
        occupancyPercent: 87,
        status: 'Critical',
        activePatients: 40,
        doctorsOnDuty: 8,
        nursesOnDuty: 24,
        equipmentCount: 38,
        leadPhysician: 'Dr. Jennifer Thorne, MD',
        colorHex: 0xC93838,
        colorCss: '#C93838'
      },
      {
        id: 'Emergency',
        name: 'Emergency Medicine & Trauma',
        floor: 'Ground Floor · Rapid Resus',
        totalBeds: 32,
        occupiedBeds: 22,
        availableBeds: 10,
        occupancyPercent: 69,
        status: 'Normal',
        activePatients: 28,
        doctorsOnDuty: 14,
        nursesOnDuty: 38,
        equipmentCount: 42,
        leadPhysician: 'Dr. Marcus Vance, MD',
        colorHex: 0x10B981,
        colorCss: '#10B981'
      },
      {
        id: 'General Ward',
        name: 'General Medical-Surgical',
        floor: '3rd Floor · Inpatient Tower',
        totalBeds: 140,
        occupiedBeds: 122,
        availableBeds: 18,
        occupancyPercent: 87,
        status: 'Critical',
        activePatients: 122,
        doctorsOnDuty: 6,
        nursesOnDuty: 32,
        equipmentCount: 96,
        leadPhysician: 'Dr. Daniel Cho, MD',
        colorHex: 0xC93838,
        colorCss: '#C93838'
      },
      {
        id: 'Surgical',
        name: 'Surgical Suite & Post-Op',
        floor: '4th Floor · OR Pavilion',
        totalBeds: 28,
        occupiedBeds: 24,
        availableBeds: 4,
        occupancyPercent: 86,
        status: 'Critical',
        activePatients: 24,
        doctorsOnDuty: 8,
        nursesOnDuty: 18,
        equipmentCount: 29,
        leadPhysician: 'Dr. Carlos Mendoza, MD',
        colorHex: 0xC93838,
        colorCss: '#C93838'
      }
    ];

    // Overlay real props if available
    return list.map(item => {
      const bedMatch = beds.find(b => b.ward === item.id);
      const staffMatch = staff.find(s => s.department.toLowerCase().includes(item.id.toLowerCase()));
      if (bedMatch) {
        const occ = bedMatch.occupancyRate;
        const stat = getDepartmentStatus(occ);
        const col = getStatusColor(stat);
        return {
          ...item,
          totalBeds: bedMatch.total,
          occupiedBeds: bedMatch.occupied,
          availableBeds: bedMatch.available,
          occupancyPercent: occ,
          status: stat,
          activePatients: bedMatch.occupied,
          doctorsOnDuty: staffMatch ? staffMatch.doctors : item.doctorsOnDuty,
          nursesOnDuty: staffMatch ? staffMatch.nurses : item.nursesOnDuty,
          leadPhysician: staffMatch ? staffMatch.leadOnCall : item.leadPhysician,
          colorHex: col.hex,
          colorCss: col.css
        };
      }
      return item;
    });
  }, [beds, staff]);

  // Three.js 3D Scene Implementation
  useEffect(() => {
    if (!is3D || !mountRef.current) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        setIs3D(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      setIs3D(false);
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 320;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0E1D15);

    // Camera - Isometric angle
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(12, 11, 14);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false; // lightweight geometry
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Subtle Ambient and Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xE2E8F0, 0.9);
    dirLight.position.set(8, 14, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x234230, 0.4);
    fillLight.position.set(-8, 6, -10);
    scene.add(fillLight);

    // Floor Base grid platform
    const baseGeo = new THREE.BoxGeometry(14, 0.4, 14);
    const baseMat = new THREE.MeshStandardMaterial({ 
      color: 0x13251B, 
      roughness: 0.8,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    scene.add(baseMesh);

    // Subtle Grid lines on platform
    const gridHelper = new THREE.GridHelper(13.6, 12, 0x274633, 0x1E3B2C);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Central Hospital Spine Hub
    const hubGeo = new THREE.BoxGeometry(2.4, 2.2, 2.4);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x1C3326, roughness: 0.5 });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.position.set(0, 1.1, 0);
    scene.add(hubMesh);

    // Hospital Wing Meshes mapped to Departments:
    // ICU: North Wing (Z - 3.8)
    // Emergency: East Wing (X + 3.8)
    // General Ward: West Wing (X - 3.8)
    // Surgical: South Wing (Z + 3.8)
    const wingDefs = [
      { id: 'ICU', pos: [0, 1.8, -3.8], size: [3.4, 3.6, 3.2] },
      { id: 'Emergency', pos: [3.8, 1.1, 0], size: [3.2, 2.2, 3.4] },
      { id: 'General Ward', pos: [-3.8, 2.4, 0], size: [3.2, 4.8, 3.4] },
      { id: 'Surgical', pos: [0, 1.4, 3.8], size: [3.4, 2.8, 3.2] }
    ];

    const departmentMeshes: { mesh: THREE.Mesh; deptId: string; initialY: number }[] = [];

    wingDefs.forEach(def => {
      const deptData = departments.find(d => d.id === def.id);
      const color = deptData ? deptData.colorHex : 0x10B981;

      // Building Box
      const geo = new THREE.BoxGeometry(def.size[0], def.size[1], def.size[2]);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.35,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      mesh.userData = { deptId: def.id };
      scene.add(mesh);

      // Window accent roof caps
      const roofGeo = new THREE.BoxGeometry(def.size[0] * 0.92, 0.15, def.size[2] * 0.92);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x274633, roughness: 0.4 });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.set(0, def.size[1] / 2 + 0.08, 0);
      mesh.add(roofMesh);

      // Architectural Edge lines
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x38644A, transparent: true, opacity: 0.6 }));
      mesh.add(line);

      departmentMeshes.push({ mesh, deptId: def.id, initialY: def.pos[1] });
    });

    // Raycasting for Mouse Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentHoverId: string | null = null;

    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;
      setMousePos({ x: event.clientX - rect.left, y: event.clientY - rect.top });

      // Subtle parallax tilt (max ±0.06 radians to prevent dizziness)
      targetRotY = x * 0.06;
      targetRotX = -y * 0.04;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(departmentMeshes.map(d => d.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const deptId = hit.userData.deptId;
        if (deptId !== currentHoverId) {
          currentHoverId = deptId;
          const found = departments.find(d => d.id === deptId) || null;
          setHoveredDept(found);
          container.style.cursor = 'pointer';
        }
      } else {
        if (currentHoverId !== null) {
          currentHoverId = null;
          setHoveredDept(null);
          container.style.cursor = 'default';
        }
      }
    };

    const handleClick = () => {
      if (currentHoverId) {
        if (onSelectWard) onSelectWard(currentHoverId);
        onNavigate('beds');
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Animation loop with subtle lerp (no aggressive auto-spinning)
    let animationFrameId: number;
    let currentAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera subtle rotation
      camera.position.x = 12 * Math.cos(targetRotY) + 14 * Math.sin(targetRotY);
      camera.position.z = 14 * Math.cos(targetRotY) - 12 * Math.sin(targetRotY);
      camera.position.y = 11 + targetRotX * 4;
      camera.lookAt(0, 0.8, 0);

      // Subtle elevation pulse on hovered wing
      departmentMeshes.forEach(d => {
        const isTarget = d.deptId === currentHoverId;
        const targetY = isTarget ? d.initialY + 0.35 : d.initialY;
        d.mesh.position.y += (targetY - d.mesh.position.y) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      hubGeo.dispose();
      hubMat.dispose();
    };
  }, [is3D, departments, onNavigate, onSelectWard]);

  return (
    <div className="bg-[#13251B] rounded-2xl p-5 border border-[#234230] shadow-xl space-y-4 relative">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E3B2A]">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-serif font-bold text-white tracking-wide">
              3D Hospital Capacity & Wing Spatial Model
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-light">
            Interactive isometric model displaying real-time departmental bed strain and staffing distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Capacity status legend */}
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Normal (&lt;75%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Approaching (75-85%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Critical (&gt;85%)</span>
            </span>
          </div>

          <SceneControls
            is3D={is3D}
            onToggleViewMode={() => setIs3D(!is3D)}
          />
        </div>
      </div>

      {/* Main View Area: 3D Scene or 2D Blueprint Fallback */}
      <div className="relative min-h-[340px] sm:min-h-[380px] w-full rounded-xl overflow-hidden bg-[#0E1D15] border border-[#1E3728]">
        {is3D && webGLSupported ? (
          <div ref={mountRef} className="w-full h-[380px] select-none" />
        ) : (
          /* 2D Schematic Floorplan Fallback (Backlog Requirement & Accessibility) */
          <div className="w-full h-[380px] p-6 flex flex-col justify-between select-none">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>2D ARCHITECTURAL FLOORPLAN SCHEMATIC</span>
              <span className="text-emerald-400">Accessible Mode Active</span>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto w-full my-auto">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => {
                    if (onSelectWard) onSelectWard(dept.id);
                    onNavigate('beds');
                  }}
                  onMouseEnter={() => setHoveredDept(dept)}
                  onMouseLeave={() => setHoveredDept(null)}
                  className="p-4 rounded-xl border transition-all cursor-pointer hover:scale-102 flex flex-col justify-between"
                  style={{
                    backgroundColor: 'rgba(24, 49, 36, 0.8)',
                    borderColor: dept.colorCss
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{dept.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      dept.status === 'Critical' ? 'bg-rose-950 text-rose-300' :
                      dept.status === 'Approaching' ? 'bg-amber-950 text-amber-300' :
                      'bg-emerald-950 text-emerald-300'
                    }`}>
                      {dept.occupancyPercent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{dept.floor}</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{dept.availableBeds} beds free</span>
                    <span className="text-slate-400">{dept.doctorsOnDuty} MDs</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[11px] text-slate-500 font-mono">
              Click any department wing to open bed allocation and capacity details.
            </p>
          </div>
        )}

        {/* Hover Information Panel (Requirement 1) */}
        {hoveredDept && (
          <div 
            className="absolute top-4 left-4 z-20 p-4 rounded-xl bg-[#13251B]/95 border border-[#2F523C] shadow-2xl max-w-xs pointer-events-none transition-all duration-150 backdrop-blur-md space-y-2 text-slate-100"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#1E3B2A] pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E88F89]">
                  Department Telemetry
                </span>
                <h4 className="text-xs font-bold text-white">{hoveredDept.name}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                hoveredDept.status === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                hoveredDept.status === 'Approaching' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {hoveredDept.status}
              </span>
            </div>

            <p className="text-[10px] text-slate-400">{hoveredDept.floor}</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded-lg bg-[#183124] border border-[#274633]">
                <span className="text-[10px] text-slate-400 block">Occupancy</span>
                <span className="text-sm font-bold text-white">{hoveredDept.occupancyPercent}%</span>
              </div>
              <div className="p-2 rounded-lg bg-[#183124] border border-[#274633]">
                <span className="text-[10px] text-slate-400 block">Free Beds</span>
                <span className="text-sm font-bold text-emerald-300">{hoveredDept.availableBeds}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#183124] border border-[#274633]">
                <span className="text-[10px] text-slate-400 block">Patients</span>
                <span className="text-sm font-bold text-white">{hoveredDept.activePatients}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#183124] border border-[#274633]">
                <span className="text-[10px] text-slate-400 block">Staff</span>
                <span className="text-sm font-bold text-white">{hoveredDept.doctorsOnDuty} MDs</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E3B2A] flex items-center justify-between text-[10px] text-[#E88F89] font-semibold">
              <span>Click to manage department beds</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Subtle camera rotation hint */}
        {is3D && (
          <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500 pointer-events-none bg-[#0B1710]/70 px-2 py-1 rounded-md border border-white/5">
            Move mouse to tilt perspective · Click department to inspect
          </div>
        )}
      </div>

      {/* Quick Department Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => {
              if (onSelectWard) onSelectWard(dept.id);
              onNavigate('beds');
            }}
            className="p-3 rounded-xl bg-[#183124] hover:bg-[#1E3B2A] border border-[#274633] text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{dept.id}</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                dept.status === 'Critical' ? 'bg-rose-950 text-rose-300' :
                dept.status === 'Approaching' ? 'bg-amber-950 text-amber-300' :
                'bg-emerald-950 text-emerald-300'
              }`}>
                {dept.occupancyPercent}%
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>{dept.availableBeds} beds free</span>
              <span className="text-[#E88F89] group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
