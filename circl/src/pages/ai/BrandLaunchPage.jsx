import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Palette, Calculator, LayoutGrid, Package, Camera, Calendar, Rocket, Users, Bot, TrendingUp, Search } from 'lucide-react';
import { BRANDLAUNCH_TOOLS } from '@config/constants';

const icons = {
  Palette, Calculator, LayoutGrid, Package, Camera, Calendar, Rocket, Users, Bot, TrendingUp, Search
};

const BrandLaunchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in p-md space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface flex items-center gap-1.5">
            BrandLaunch AI Hub <Sparkles className="w-4 h-4 text-primary fill-primary animate-pulse" />
          </h2>
          <p className="text-label-md text-text-muted">Accelerate your local brand with Z.ai GLM 4.6</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3">
        {BRANDLAUNCH_TOOLS.map((tool) => {
          const Icon = icons[tool.icon] || Sparkles;
          return (
            <div
              key={tool.id}
              onClick={() => navigate(`/brandlaunch/${tool.id}`)}
              className="circl-card p-4 border border-outline-variant/10 flex items-start gap-4 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-on-surface text-body-lg">{tool.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-0.5 leading-[1.3]">{tool.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandLaunchPage;
