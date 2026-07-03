import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Copy, Check, RotateCw } from 'lucide-react';
import { BRANDLAUNCH_TOOLS } from '@config/constants';
import Button from '@components/common/Button';
import { generateBrandLaunchTool } from '@services/aiService';

const BrandLaunchToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();

  const tool = BRANDLAUNCH_TOOLS.find(t => t.id === toolId) || BRANDLAUNCH_TOOLS[0];

  const [inputs, setInputs] = useState({
    businessName: '',
    businessType: '',
    targetAudience: 'Colony Residents',
    extraNotes: '',
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputs.businessName.trim()) return;
    setLoading(true);
    const res = await generateBrandLaunchTool(toolId, inputs);
    setOutput(res);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in p-md space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface flex items-center gap-1">
            {tool.title} <Sparkles className="w-4 h-4 text-primary fill-primary" />
          </h2>
          <span className="text-[10px] text-text-muted font-bold block">Powered by Z.ai GLM 4.6</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/15">
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Business Name *</label>
          <input
            type="text"
            placeholder="e.g. Sharma Bakery"
            value={inputs.businessName}
            onChange={(e) => setInputs({ ...inputs, businessName: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Niche / Products</label>
          <input
            type="text"
            placeholder="e.g. Sourdough bread, cakes, custom pastries"
            value={inputs.businessType}
            onChange={(e) => setInputs({ ...inputs, businessType: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Extra Context / Notes</label>
          <textarea
            placeholder="Specify any details you want the AI to emphasize..."
            value={inputs.extraNotes}
            onChange={(e) => setInputs({ ...inputs, extraNotes: e.target.value })}
            className="input-field h-20 resize-none"
          />
        </div>
        <Button
          variant="primary"
          size="full"
          icon={Send}
          loading={loading}
          disabled={!inputs.businessName.trim()}
          onClick={handleGenerate}
          className="h-12 !rounded-xl"
        >
          Generate Output
        </Button>
      </div>

      {/* AI Output Section */}
      {output && (
        <div className="animate-fade-in space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-on-surface text-body-lg">AI Generated Result:</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1.5 text-label-md font-bold text-primary"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleGenerate}
                className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-text-muted"
                title="Regenerate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-card rounded-2xl border border-outline-variant/15 text-body-md whitespace-pre-wrap leading-[1.5] shadow-sm">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLaunchToolPage;
