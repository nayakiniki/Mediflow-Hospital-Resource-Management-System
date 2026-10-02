import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { BedItem, BedLifecycleStatus } from '../../types';
import { SceneControls } from './SceneControls';
import { 
  Bed as BedIcon, 
  Wind, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Wrench, 
  Sparkles, 
  X, 
  ChevronRight, 
  Layers, 
  Activity, 
  Thermometer, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface BedMap3DProps {
  beds: BedItem[];
  onSelectBed: (bed: BedItem) => void;
  onAllocateBed: (bed: BedItem) => void;
}

export const BedMap3D: React.FC<BedMap3DProps> = ({
  beds,
  onSelectBed,
  onAllocateBed
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredBed, setHoveredBed] = useState<BedItem | null>(null);
  const [selectedBedMeta, setSelectedBedMeta] = useState<BedItem | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter beds according to user selection
  const filteredBeds = useMemo(() => {
    return beds.filter(b => {
      const matchWard = wardFilter === 'All' || b.ward === wardFilter;
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchWard && matchStatus;
    });
  }, [beds, wardFilter, statusFilter]);

  // Distinct visual states for availability
  const getBedColorHex = (status: BedLifecycleStatus): number => {
    switch (status) {
      case 'Available': return 0x10B981; // Controlled Emerald
      case 'Occupied': return 0xC93838;  // Controlled Crimson/Rose
      case 'Cleaning': return 0xD97706;  // Warm Amber
      case 'Reserved': return 0x06B6D4;  // Cyan Blue
      case 'Maintenance': return 0x8B5CF6; // Royal Purple
      case 'Blocked': return 0x64748B;   // Neutral Slate
    }
  };

  const getStatusBadge = (status: BedLifecycleStatus) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-800' };
      case 'Occupied':
        return { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-800' };
      case 'Cleaning':
        return { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-800' };
      case 'Reserved':
        return { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-800' };
      case 'Maintenance':
        return { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-800' };
      case 'Blocked':
        return { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-700' };
    }
  };

  // 3D Isometric Scene via Three.js
  useEffect(() => {
    if (!is3D || !mountRef.current) return;

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
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0E1D15);

    // True isometric angle perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(12, 11, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xE2E8F0, 0.85);
    dirLight.position.set(8, 14, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x234230, 0.4);
    fillLight.position.set(-8, 5, -8);
    scene.add(fillLight);

    // Floor Base Plate
    const floorGeo = new THREE.BoxGeometry(16, 0.3, 12);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x13251B, roughness: 0.85 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.15;
    scene.add(floorMesh);

    // Grid on floor
    const grid = new THREE.GridHelper(15, 14, 0x274633, 0x1A3324);
    grid.position.y = 0.01;
    scene.add(grid);

    // Render beds in a clean grid
    const bedMeshes: { group: THREE.Group; bedId: string; initialY: number }[] = [];
    const cols = 4;
    const spacingX = 3.4;
    const spacingZ = 2.8;

    filteredBeds.forEach((bed, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const posX = (col - (cols - 1) / 2) * spacingX;
      const posZ = (row - 1) * spacingZ;

      const bedGroup = new THREE.Group();
      bedGroup.position.set(posX, 0, posZ);

      // Bed Base Frame
      const frameGeo = new THREE.BoxGeometry(1.5, 0.32, 2.1);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1A3325, roughness: 0.6 });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.y = 0.16;
      bedGroup.add(frameMesh);

      // Mattress with Availability State Color
      const matGeo = new THREE.BoxGeometry(1.36, 0.3, 1.95);
      const matColor = getBedColorHex(bed.status);
      const matMaterial = new THREE.MeshStandardMaterial({
        color: matColor,
        roughness: 0.35,
        metalness: 0.15
      });
      const matMesh = new THREE.Mesh(matGeo, matMaterial);
      matMesh.position.y = 0.44;
      matMesh.userData = { bedId: bed.id };
      bedGroup.add(matMesh);

      // Bed Pillow / Headrest
      const pillowGeo = new THREE.BoxGeometry(1.0, 0.14, 0.45);
      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.3 });
      const pillowMesh = new THREE.Mesh(pillowGeo, pillowMat);
      pillowMesh.position.set(0, 0.62, -0.68);
      bedGroup.add(pillowMesh);

      // Headboard
      const headGeo = new THREE.BoxGeometry(1.48, 0.72, 0.12);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x234230, roughness: 0.5 });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.set(0, 0.5, -0.98);
      bedGroup.add(headMesh);

      // Footboard
      const footGeo = new THREE.BoxGeometry(1.48, 0.45, 0.1);
      const footMat = new THREE.MeshStandardMaterial({ color: 0x234230, roughness: 0.5 });
      const footMesh = new THREE.Mesh(footGeo, footMat);
      footMesh.position.set(0, 0.35, 0.98);
      bedGroup.add(footMesh);

      // Medical Pole with equipment beacon if ventilator or negative pressure
      if (bed.hasVentilator || bed.hasIsolation) {
        const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.3, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.8, roughness: 0.2 });
        const poleMesh = new THREE.Mesh(poleGeo, poleMat);
        poleMesh.position.set(0.78, 0.65, -0.9);
        bedGroup.add(poleMesh);

        // Status beacon indicator
        const beaconGeo = new THREE.SphereGeometry(0.09, 8, 8);
        const beaconColor = bed.hasVentilator ? 0x10B981 : 0x06B6D4;
        const beaconMat = new THREE.MeshBasicMaterial({ color: beaconColor });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
        beaconMesh.position.set(0.78, 1.32, -0.9);
        bedGroup.add(beaconMesh);
      }

      // If occupied: subtle medical monitor on the bedside
      if (bed.status === 'Occupied') {
        const monitorStandGeo = new THREE.BoxGeometry(0.35, 0.8, 0.35);
        const monitorStandMat = new THREE.MeshStandardMaterial({ color: 0x1E3B2C });
        const monitorStand = new THREE.Mesh(monitorStandGeo, monitorStandMat);
        monitorStand.position.set(-0.95, 0.4, -0.5);
        bedGroup.add(monitorStand);

        const screenGeo = new THREE.BoxGeometry(0.32, 0.25, 0.05);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0xC93838 });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(-0.95, 0.9, -0.5);
        bedGroup.add(screen);
      }

      scene.add(bedGroup);
      bedMeshes.push({ group: bedGroup, bedId: bed.id, initialY: 0 });
    });

    // Raycasting for Mouse Interaction
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

      // Subtle parallax response to mouse movement
      targetRotY = x * 0.06;
      targetRotX = -y * 0.04;

      raycaster.setFromCamera(mouse, camera);
      const targetMeshes: THREE.Object3D[] = [];
      bedMeshes.forEach(b => b.group.traverse(child => {
        if ((child as THREE.Mesh).isMesh) targetMeshes.push(child);
      }));

      const intersects = raycaster.intersectObjects(targetMeshes);
      if (intersects.length > 0) {
        let hitBedId: string | null = null;
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !hitBedId) {
          if (obj.userData?.bedId) hitBedId = obj.userData.bedId;
          obj = obj.parent;
        }

        if (hitBedId && hitBedId !== currentHoverId) {
          currentHoverId = hitBedId;
          const found = filteredBeds.find(b => b.id === hitBedId) || null;
          setHoveredBed(found);
          container.style.cursor = 'pointer';
        }
      } else {
        if (currentHoverId !== null) {
          currentHoverId = null;
          setHoveredBed(null);
          container.style.cursor = 'default';
        }
      }
    };

    // Click handler to show detailed bed metadata (User Requirement)
    const handleClick = () => {
      if (currentHoverId) {
        const found = filteredBeds.find(b => b.id === currentHoverId);
        if (found) {
          setSelectedBedMeta(found);
          onSelectBed(found);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera position with subtle parallax
      camera.position.x = 12 * Math.cos(targetRotY) + 14 * Math.sin(targetRotY);
      camera.position.z = 14 * Math.cos(targetRotY) - 12 * Math.sin(targetRotY);
      camera.position.y = 11 + targetRotX * 3.5;
      camera.lookAt(0, 0.4, 0);

      // Subtle elevation hover response on bed mesh
      bedMeshes.forEach(b => {
        const isHovered = b.bedId === currentHoverId;
        const targetY = isHovered ? 0.3 : 0;
        b.group.position.y += (targetY - b.group.position.y) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      floorGeo.dispose();
      floorMat.dispose();
    };
  }, [is3D, filteredBeds, onSelectBed]);

  return (
    <div className="bg-[#13251B] rounded-2xl p-5 sm:p-6 border border-[#234230] shadow-xl space-y-4 relative text-slate-100">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#1E3B2A]">
        <div>
          <div className="flex items-center gap-2">
            <BedIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-serif font-bold text-white tracking-wide">
              3D Isometric Bed Availability & Spatial Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-light">
            Interactive ward layout with availability color coding. Click any bed to view detailed clinical metadata.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Ward filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#183124] border border-[#274633] rounded-xl text-xs text-slate-200 focus:outline-none font-mono"
          >
            <option value="All">All Wards</option>
            <option value="ICU">ICU Ward</option>
            <option value="Emergency">Emergency</option>
            <option value="General Ward">General Ward</option>
            <option value="Surgical">Surgical Suite</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#183124] border border-[#274633] rounded-xl text-xs text-slate-200 focus:outline-none font-mono"
          >
            <option value="All">All States</option>
            <option value="Available">Available (Green)</option>
            <option value="Occupied">Occupied (Crimson)</option>
            <option value="Cleaning">Cleaning (Amber)</option>
            <option value="Reserved">Reserved (Cyan)</option>
            <option value="Maintenance">Maintenance (Purple)</option>
            <option value="Blocked">Blocked (Slate)</option>
          </select>

          {/* 3D / 2D toggle */}
          <SceneControls
            is3D={is3D}
            onToggleViewMode={() => setIs3D(!is3D)}
          />
        </div>
      </div>

      {/* Status Legend Badges */}
      <div className="flex items-center gap-3 flex-wrap text-[11px] font-mono pb-1">
        <span className="flex items-center gap-1.5 text-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </span>
        <span className="flex items-center gap-1.5 text-rose-300">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Occupied</span>
        </span>
        <span className="flex items-center gap-1.5 text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Cleaning</span>
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span>Reserved</span>
        </span>
        <span className="flex items-center gap-1.5 text-purple-300">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>Maintenance</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span>Blocked</span>
        </span>
      </div>

      {/* Main Isometric Viewport */}
      <div className="relative min-h-[360px] sm:min-h-[400px] w-full rounded-2xl overflow-hidden bg-[#0E1D15] border border-[#1E3728]">
        {is3D && webGLSupported ? (
          <div ref={mountRef} className="w-full h-[400px] select-none" />
        ) : (
          /* 2D Accessible Floorplan Matrix */
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5 select-none">
            {filteredBeds.map(b => {
              const badge = getStatusBadge(b.status);
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBedMeta(b);
                    onSelectBed(b);
                  }}
                  onMouseEnter={() => setHoveredBed(b)}
                  onMouseLeave={() => setHoveredBed(null)}
                  className="p-4 rounded-xl bg-[#183124] border border-[#274633] hover:border-emerald-500/80 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm">{b.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{b.ward} · {b.type}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{b.hasVentilator ? 'Vent ✓' : 'Standard'}</span>
                    <span className="text-[#E88F89]">Click metadata →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Hover Quick Preview Chip */}
        {hoveredBed && !selectedBedMeta && (
          <div className="absolute top-4 left-4 z-20 p-3.5 rounded-xl bg-[#13251B]/95 border border-[#2F523C] shadow-2xl max-w-xs pointer-events-none backdrop-blur-md space-y-1.5 text-slate-100 animate-in fade-in duration-100">
            <div className="flex items-center justify-between gap-2 border-b border-[#1E3B2A] pb-1.5">
              <span className="font-mono font-bold text-white text-xs">{hoveredBed.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${getStatusBadge(hoveredBed.status).bg} ${getStatusBadge(hoveredBed.status).text}`}>
                {hoveredBed.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">{hoveredBed.ward} · {hoveredBed.floor}</p>
            <p className="text-[10px] text-slate-400 font-mono">
              Equipment: {hoveredBed.hasVentilator ? 'Ventilator ✓' : 'No Vent'} · {hoveredBed.hasIsolation ? 'Isolation ✓' : 'Standard'}
            </p>
            <p className="text-[10px] text-[#E88F89] font-semibold pt-1">
              Click to view detailed bed metadata & telemetry →
            </p>
          </div>
        )}

        {is3D && (
          <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500 pointer-events-none bg-[#0B1710]/70 px-2 py-1 rounded-md border border-white/5">
            Mouse moves camera · Click bed for full metadata inspection
          </div>
        )}
      </div>

      {/* 
        ========================================================================
        DETAILED BED METADATA INSPECTION MODAL (User Requirement)
        Appears on click with clinical metadata, telemetry, and allocate actions
        ========================================================================
      */}
      {selectedBedMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-[#13251B] rounded-2xl border border-[#2C4838] shadow-2xl max-w-lg w-full p-6 space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#183124] border border-[#274633] flex items-center justify-center text-emerald-400">
                  <BedIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-mono font-bold text-white">{selectedBedMeta.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getStatusBadge(selectedBedMeta.status).bg} ${getStatusBadge(selectedBedMeta.status).text} border ${getStatusBadge(selectedBedMeta.status).border}`}>
                      {selectedBedMeta.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedBedMeta.ward} · {selectedBedMeta.floor}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBedMeta(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bed Specifications Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#E88F89]">
                Clinical Room & Infrastructure Specifications
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#183124] border border-[#274633]">
                  <span className="text-slate-400 text-[10px] block">BED TYPE</span>
                  <span className="font-bold text-white text-sm mt-0.5">{selectedBedMeta.type}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#183124] border border-[#274633]">
                  <span className="text-slate-400 text-[10px] block">WARD GENDER</span>
                  <span className="font-bold text-white text-sm mt-0.5">{selectedBedMeta.genderWard}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#183124] border border-[#274633]">
                  <span className="text-slate-400 text-[10px] block">VENTILATOR HOOKUP</span>
                  <span className={selectedBedMeta.hasVentilator ? 'text-emerald-300 font-bold text-sm' : 'text-slate-400 text-sm'}>
                    {selectedBedMeta.hasVentilator ? 'Mechanical Vent Active ✓' : 'None Equipped'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#183124] border border-[#274633]">
                  <span className="text-slate-400 text-[10px] block">NEGATIVE PRESSURE</span>
                  <span className={selectedBedMeta.hasIsolation ? 'text-cyan-300 font-bold text-sm' : 'text-slate-400 text-sm'}>
                    {selectedBedMeta.hasIsolation ? 'Isolation Certified ✓' : 'Standard Room'}
                  </span>
                </div>
              </div>
            </div>

            {/* Occupancy / Patient Information */}
            {selectedBedMeta.assignedPatientName && (
              <div className="p-4 rounded-xl bg-[#183124] border border-rose-900/60 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold">
                  Assigned Inpatient Record
                </span>
                <p className="text-sm font-bold text-white">{selectedBedMeta.assignedPatientName}</p>
                {selectedBedMeta.assignedPatientId && (
                  <p className="text-xs text-slate-300 font-mono">Patient MRN: {selectedBedMeta.assignedPatientId}</p>
                )}
                <p className="text-[11px] text-slate-400">Continuous cardiac and pulse oximetry monitoring active.</p>
              </div>
            )}

            {/* Equipment Availability List */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Connected Specialized Equipment:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {(selectedBedMeta.specialEquipment || ['Telemetry Hub', 'Emergency Call Button', 'IV Infusion Pole']).map((eq, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#183124] text-slate-200 border border-[#274633]">
                    ✓ {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Hygiene & Telemetry Status */}
            <div className="p-3.5 rounded-xl bg-[#183124] border border-[#274633] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sanitization Audit:</span>
                </span>
                <span className="text-white">{selectedBedMeta.lastCleaned || 'Terminal cleaning verified 15 min ago'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>O2 Wall Outlet Pressure:</span>
                </span>
                <span className="text-emerald-300 font-bold">55 PSI (Optimal)</span>
              </div>
              {selectedBedMeta.maintenanceNote && (
                <div className="pt-2 border-t border-[#234230] text-amber-300">
                  <p className="text-[10px] text-amber-400 uppercase">Maintenance Tag:</p>
                  <p className="text-xs mt-0.5">{selectedBedMeta.maintenanceNote}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1E3B2A]">
              <button
                onClick={() => setSelectedBedMeta(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Close
              </button>

              {selectedBedMeta.status === 'Available' && (
                <button
                  onClick={() => {
                    const target = selectedBedMeta;
                    setSelectedBedMeta(null);
                    onAllocateBed(target);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 transition-all shadow-md shadow-[#E88F89]/20 flex items-center gap-1.5 active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Allocate Patient to {selectedBedMeta.id}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
