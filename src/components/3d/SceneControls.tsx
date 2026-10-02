import React from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface SceneControlsProps {
  onResetCamera?: () => void;
  onToggleViewMode?: () => void;
  is3D?: boolean;
}

export const SceneControls: React.FC<SceneControlsProps> = ({
  onResetCamera,
  onToggleViewMode,
  is3D = true
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-[#13251B]/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-[#234230] text-xs font-mono text-slate-300">
      {onToggleViewMode && (
        <button
          onClick={onToggleViewMode}
          className="px-2.5 py-1 rounded-lg bg-[#183124] hover:bg-[#1E3B2A] text-slate-200 transition-colors flex items-center gap-1"
          title="Switch between 3D Spatial and 2D Schematic"
        >
          <span>{is3D ? 'Switch to 2D Plan' : 'Switch to 3D View'}</span>
        </button>
      )}

      {is3D && onResetCamera && (
        <button
          onClick={onResetCamera}
          className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset Camera View"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
