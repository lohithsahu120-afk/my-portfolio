import React, { useState } from 'react';
import { Eye, Network, Cpu, Sliders, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface InteractiveLabProps {
  initialTab?: 'vision' | 'rag' | 'edge';
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ initialTab = 'vision' }) => {
  const [activeTab, setActiveTab] = useState<'vision' | 'rag' | 'edge'>(initialTab);

  // --- State for Module 1: Grad-CAM Explorer ---
  const [selectedScan, setSelectedScan] = useState<'pneumonia' | 'cardiomegaly' | 'nodule'>('pneumonia');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(75);
  const [threshold, setThreshold] = useState<number>(45);

  const scanData = {
    pneumonia: {
      title: 'Scan #104: Bilateral Infiltration & Consolidation',
      probabilities: [
        { name: 'Consolidation', prob: 94.6, color: 'bg-rose-500' },
        { name: 'Infiltration', prob: 88.2, color: 'bg-amber-500' },
        { name: 'Pleural Effusion', prob: 41.3, color: 'bg-blue-500' },
        { name: 'Atelectasis', prob: 18.7, color: 'bg-slate-500' },
      ],
      hotspot: { x: '58%', y: '48%', size: '130px', shape: 'rounded-full' },
      hotspotSecondary: { x: '34%', y: '52%', size: '90px', shape: 'rounded-full' },
      finding: 'Grad-CAM localizes significant dense opacities in both lower lung zones consistent with lobar infiltration.',
    },
    cardiomegaly: {
      title: 'Scan #218: Cardiac Silhouette Enlargement',
      probabilities: [
        { name: 'Cardiomegaly', prob: 97.8, color: 'bg-rose-500' },
        { name: 'Enlarged Cardiomediastinum', prob: 79.4, color: 'bg-amber-500' },
        { name: 'Edema', prob: 32.1, color: 'bg-blue-500' },
        { name: 'Pneumothorax', prob: 3.2, color: 'bg-slate-500' },
      ],
      hotspot: { x: '46%', y: '56%', size: '170px', shape: 'rounded-2xl' },
      hotspotSecondary: null,
      finding: 'Cardiac diameter exceeds 50% of the maximum thoracic diameter, focal activation centered on transverse cardiac axis.',
    },
    nodule: {
      title: 'Scan #342: Right Upper Lobe Solitary Nodule',
      probabilities: [
        { name: 'Nodule / Mass', prob: 92.1, color: 'bg-rose-500' },
        { name: 'Fibrosis', prob: 28.5, color: 'bg-amber-500' },
        { name: 'Pneumonia', prob: 12.0, color: 'bg-blue-500' },
        { name: 'Emphysema', prob: 8.4, color: 'bg-slate-500' },
      ],
      hotspot: { x: '68%', y: '32%', size: '65px', shape: 'rounded-full' },
      hotspotSecondary: null,
      finding: 'Well-circumscribed high-density nodular lesion (14mm) in right superior segment accurately bracketed.',
    },
  };

  const currentScan = scanData[selectedScan];

  // --- State for Module 2: RAG Simulator ---
  const [ragQuery, setRagQuery] = useState<string>('How do we prevent gradient instability during 4-bit QLoRA sequence packing?');
  const [ragWeight, setRagWeight] = useState<number>(50); // 0 = 100% Vector, 100 = 100% Graph
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [ragResultStep, setRagResultStep] = useState<number>(3);

  const runRagSimulation = (query: string) => {
    setRagQuery(query);
    setIsSimulating(true);
    setRagResultStep(1);
    setTimeout(() => setRagResultStep(2), 250);
    setTimeout(() => {
      setRagResultStep(3);
      setIsSimulating(false);
    }, 550);
  };

  // --- State for Module 3: Edge Quantization Calculator ---
  const [edgeDevice, setEdgeDevice] = useState<'jetson-orin-nano' | 'jetson-agx' | 'rpi-hailo' | 'rtx-4090'>('jetson-orin-nano');
  const [precision, setPrecision] = useState<'fp32' | 'fp16' | 'int8' | 'int4'>('int8');

  const edgeSpecs = {
    'jetson-orin-nano': { name: 'NVIDIA Jetson Orin Nano (8GB)', baseTdp: '7W', memory: '8 GB LPDDR5' },
    'jetson-agx': { name: 'NVIDIA Jetson AGX Orin (64GB)', baseTdp: '30W', memory: '64 GB LPDDR5' },
    'rpi-hailo': { name: 'Raspberry Pi 5 + Hailo-8 NPU', baseTdp: '5W', memory: '8 GB LPDDR4' },
    'rtx-4090': { name: 'NVIDIA GeForce RTX 4090 (Desktop)', baseTdp: '350W', memory: '24 GB GDDR6X' },
  };

  const calculateEdgeMetrics = () => {
    let baseFps = 12;
    let baseMem = 620; // MB
    let baseLatency = 83; // ms

    if (edgeDevice === 'jetson-orin-nano') {
      baseFps = 15;
      baseMem = 580;
      baseLatency = 66;
    } else if (edgeDevice === 'jetson-agx') {
      baseFps = 45;
      baseMem = 580;
      baseLatency = 22;
    } else if (edgeDevice === 'rpi-hailo') {
      baseFps = 14;
      baseMem = 480;
      baseLatency = 71;
    } else {
      baseFps = 140;
      baseMem = 620;
      baseLatency = 7.1;
    }

    const mults = {
      fp32: { fps: 1.0, mem: 1.0, lat: 1.0, acc: '100% (Baseline)' },
      fp16: { fps: 2.1, mem: 0.52, lat: 0.48, acc: '99.8% (Negligible delta)' },
      int8: { fps: 3.4, mem: 0.28, lat: 0.29, acc: '99.1% (Calibrated PTQ)' },
      int4: { fps: 4.6, mem: 0.16, lat: 0.22, acc: '96.4% (Quantization loss)' },
    };

    const factor = mults[precision];
    const finalFps = (baseFps * factor.fps).toFixed(1);
    const finalMem = Math.round(baseMem * factor.mem);
    const finalLat = (baseLatency * factor.lat).toFixed(1);

    return {
      fps: finalFps,
      memMb: finalMem,
      latencyMs: finalLat,
      accuracy: factor.acc,
    };
  };

  const edgeMetrics = calculateEdgeMetrics();

  return (
    <section id="interactive-lab" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              02. Interactive AI Lab
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Verifiable Simulation & Architectural Testbed
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Interact directly with the core algorithms powering Lohith's research systems: examine localized medical Grad-CAM heatmaps, test hybrid RAG vector/graph fusion, and profile edge quantization envelopes.
            </p>
          </div>

          {/* Module Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab('vision')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'vision'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Grad-CAM Vision</span>
            </button>
            <button
              onClick={() => setActiveTab('rag')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'rag'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Hybrid Graph RAG</span>
            </button>
            <button
              onClick={() => setActiveTab('edge')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'edge'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Edge Quantization</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Grad-CAM Explorer */}
        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Visual Canvas Viewport */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentScan.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  DenseNet-121 + Clinical ViT
                </div>
              </div>

              {/* Synthetic Medical Radiograph Screen */}
              <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center select-none">
                {/* Stylized background anatomical radiograph texture */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black" />
                <div className="absolute inset-x-12 inset-y-8 rounded-full border border-slate-800/60 pointer-events-none" />
                <div className="absolute inset-x-20 inset-y-16 rounded-full border border-slate-800/40 pointer-events-none" />

                {/* Simulated Rib & Spine Structure Lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-64 bg-slate-800/40 blur-[1px]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-1 bg-slate-800/50 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-56 h-1 bg-slate-800/50 rounded-full" />
                <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-52 h-1 bg-slate-800/50 rounded-full" />

                {/* Simulated Grad-CAM Activation Heatmaps */}
                <div
                  className={`absolute ${currentScan.hotspot.shape} pointer-events-none transition-all duration-300`}
                  style={{
                    left: currentScan.hotspot.x,
                    top: currentScan.hotspot.y,
                    transform: 'translate(-50%, -50%)',
                    width: currentScan.hotspot.size,
                    height: currentScan.hotspot.size,
                    opacity: heatmapOpacity >= threshold ? heatmapOpacity / 100 : 0.05,
                    background: 'radial-gradient(circle, rgba(239,68,68,0.95) 0%, rgba(245,158,11,0.7) 45%, rgba(59,130,246,0.3) 80%, transparent 100%)',
                    filter: 'blur(12px)',
                  }}
                />

                {currentScan.hotspotSecondary && (
                  <div
                    className={`absolute ${currentScan.hotspotSecondary.shape} pointer-events-none transition-all duration-300`}
                    style={{
                      left: currentScan.hotspotSecondary.x,
                      top: currentScan.hotspotSecondary.y,
                      transform: 'translate(-50%, -50%)',
                      width: currentScan.hotspotSecondary.size,
                      height: currentScan.hotspotSecondary.size,
                      opacity: heatmapOpacity >= threshold ? (heatmapOpacity * 0.8) / 100 : 0.05,
                      background: 'radial-gradient(circle, rgba(245,158,11,0.85) 0%, rgba(59,130,246,0.5) 50%, transparent 90%)',
                      filter: 'blur(10px)',
                    }}
                  />
                )}

                {/* Spatial Crosshair & Telemetry Overlay */}
                <div className="absolute top-4 left-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                  FOV: 350x350mm · DICOM 16-bit
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 bg-slate-950/80 backdrop-blur-sm p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>{currentScan.finding}</span>
                  <span className="font-mono text-emerald-400 shrink-0 ml-2">AUC 96.4%</span>
                </div>
              </div>

              {/* Scan Selector Tabs */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { id: 'pneumonia', label: 'Scan 104 (Infiltration)' },
                  { id: 'cardiomegaly', label: 'Scan 218 (Cardiomegaly)' },
                  { id: 'nodule', label: 'Scan 342 (Solitary Nodule)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScan(s.id as any)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg text-center transition-all ${
                      selectedScan === s.id
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Controls & Prediction Probabilities */}
            <div className="lg:col-span-5 flex flex-col justify-between pt-2 lg:pt-0">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  Grad-CAM Attention Parameters
                </h4>

                {/* Heatmap Opacity Slider */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Activation Heatmap Opacity</span>
                    <span className="font-mono tabular-nums">{heatmapOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={heatmapOpacity}
                    onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>0% (Raw Radiograph)</span>
                    <span>100% (High Intensity)</span>
                  </div>
                </div>

                {/* Threshold Slider */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <span>Activation Gate Threshold</span>
                    <span className="font-mono tabular-nums">{threshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>Suppress Low Attention Noise</span>
                    <span>Focal Peak Only</span>
                  </div>
                </div>

                {/* Multilabel Predictions */}
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Ensemble Multi-Label Posterior Probabilities
                </h4>
                <div className="space-y-3">
                  {currentScan.probabilities.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <div className="flex justify-between text-xs font-medium text-slate-800 dark:text-slate-200 mb-1">
                        <span>{item.name}</span>
                        <span className="font-mono font-semibold tabular-nums">{item.prob}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.prob}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Footnote */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Corresponds to Lohith Sahu's thesis paper under review at IEEE TMI (2025). Grad-CAM backpropagates gradients from the 14th dense block layer into the cross-attention tokens.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hybrid Graph RAG Simulator */}
        {activeTab === 'rag' && (
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Query Config & Ratio Slider */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Omnix-RAG Query Engine
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    Hybrid fusion between Qdrant high-dimensional vector spaces and Neo4j relational subgraphs with reciprocal rank fusion (RRF).
                  </p>

                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Sample Technical Queries:
                  </div>
                  <div className="space-y-2 mb-6">
                    {[
                      'How do we prevent gradient instability during 4-bit QLoRA sequence packing?',
                      'What cross-attention mechanism fuses DenseNet with Clinical ViT tokens?',
                      'How does INT8 entropy calibration maintain precision under 5W on Jetson?',
                    ].map((sample, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => runRagSimulation(sample)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                          ragQuery === sample
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-medium'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  {/* Fusion Ratio Slider */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4">
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      <span>Fusion Balance Ratio</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {100 - ragWeight}% Vector · {ragWeight}% Graph
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ragWeight}
                      onChange={(e) => setRagWeight(Number(e.target.value))}
                      className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Dense Cosine Only</span>
                      <span>Balanced RRF</span>
                      <span>Graph Subgraph Only</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => runRagSimulation(ragQuery)}
                  disabled={isSimulating}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>Execute Retrieval Traversal</span>
                </button>
              </div>

              {/* Right Column: Execution Flow & Synthesized Result */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                    Multi-Stage Traversal Trace
                  </h4>

                  {/* Pipeline Steps */}
                  <div className="space-y-3 mb-6">
                    {/* Step 1: Entity & Vector */}
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white mb-1">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>1. Vector Search (Qdrant Dense Embeddings)</span>
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">Cosine: 0.892</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Retrieved 8 top semantic chunks from 1,536-dimensional BGE embedding index.
                      </p>
                    </div>

                    {/* Step 2: Neo4j Subgraph Expansion */}
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white mb-1">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>2. Graph Traversal (Neo4j Property Subgraphs)</span>
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">2 Hops Expanded</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Identified structural nodes: <code className="text-blue-500">(:Concept &#123;name: 'QLoRA'&#125;) -[:MITIGATES]-&gt; (:Failure &#123;name: 'OOM'&#125;)</code>
                      </p>
                    </div>

                    {/* Step 3: RRF & Self-Correction */}
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white mb-1">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>3. Reciprocal Rank Fusion & Faithfulness Gate</span>
                        </span>
                        <span className="font-mono text-emerald-500 text-[11px]">Passed (94.2%)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Zero hallucination flag triggered; context verified against authoritative source nodes.
                      </p>
                    </div>
                  </div>

                  {/* Synthesized Output Display */}
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Synthesized Context with Provenance Citations:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      "To prevent gradient instability during sequence packing in 4-bit QLoRA, dynamic cross-document attention masks are injected into the attention matrix, preventing attention bleed across unrelated concatenated sequences. Concurrently, double-dequantization scales the FP32 optimizer states without precision underflow."
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Latency: <strong className="font-mono text-slate-700 dark:text-slate-300">42ms</strong></span>
                      <span>Hallucination Reduction: <strong className="font-mono text-emerald-600 dark:text-emerald-400">-42%</strong></span>
                      <span>Verified Citations: <strong className="font-mono text-slate-700 dark:text-slate-300">3 Nodes</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Edge Quantization Calculator */}
        {activeTab === 'edge' && (
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Target Hardware & Precision Selection */}
              <div className="lg:col-span-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Edge AI Optimization Engine
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  Profile how TensorRT INT8 post-training quantization, weight pruning, and layer fusion impact latency, throughput, and power efficiency across target robotics hardware.
                </p>

                {/* Device Selector */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Target Embedded Platform
                  </label>
                  <div className="space-y-2">
                    {(Object.keys(edgeSpecs) as Array<keyof typeof edgeSpecs>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setEdgeDevice(key)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border text-left transition-all ${
                          edgeDevice === key
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{edgeSpecs[key].name}</div>
                          <div className="text-[11px] text-slate-400">Shared Unified RAM: {edgeSpecs[key].memory}</div>
                        </div>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {edgeSpecs[key].baseTdp}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precision Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Quantization Scheme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'fp32', label: 'FP32' },
                      { id: 'fp16', label: 'FP16' },
                      { id: 'int8', label: 'INT8 (TRT)' },
                      { id: 'int4', label: 'INT4' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPrecision(p.id as any)}
                        className={`py-2 px-1 text-xs font-semibold rounded-lg text-center transition-all ${
                          precision === p.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Real-Time Performance Matrix */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                    Computed Telemetry & Resource Envelope
                  </h4>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Metric 1: FPS */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Sustained Throughput</div>
                      <div className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                        {edgeMetrics.fps} <span className="text-sm font-normal">FPS</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Real-time camera pipeline</div>
                    </div>

                    {/* Metric 2: Latency */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Sensor-to-Actuator Latency</div>
                      <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                        {edgeMetrics.latencyMs} <span className="text-sm font-normal">ms</span>
                      </div>
                      <div className="text-[11px] text-emerald-500 mt-1">Low-jitter flight control</div>
                    </div>

                    {/* Metric 3: Memory Footprint */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Model Memory Footprint</div>
                      <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
                        {edgeMetrics.memMb} <span className="text-sm font-normal">MB</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Unified DRAM consumption</div>
                    </div>

                    {/* Metric 4: Accuracy Preservation */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy vs FP32 Baseline</div>
                      <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                        {edgeMetrics.accuracy}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Calibrated on COCO val2017</div>
                    </div>
                  </div>

                  {/* Architecture Note */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">
                      Lohith's Edge Engineering Methodology:
                    </div>
                    Custom YOLOv10 backbone with layer-fused convolution-batchnorm sequences. Post-training INT8 quantization utilizes Kullback-Leibler (KL) divergence calibration over 2,000 representative driving/flight frames to avoid catastrophic quantization outlier clipping.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
