import { Project, Publication, Experience, SkillCategory } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Lohith Sahu',
  rollNumber: '2026BTAI036',
  program: 'B.Tech in Artificial Intelligence',
  batch: 'Class of 2026',
  university: 'National Institute of Technology / School of Computer Science & AI',
  cgpa: '9.22 / 10.0',
  academicStanding: 'Ranked in Top 2% (Dean’s Honor List)',
  email: 'lohithsahu120@gmail.com',
  github: 'https://github.com/lohithsahu120',
  linkedin: 'https://linkedin.com/in/lohithsahu',
  kaggle: 'https://kaggle.com/lohithsahu',
  huggingface: 'https://huggingface.co/lohithsahu',
  status: 'Open to Summer 2026 Internships & 2026 Graduating Full-Time AI/ML Engineering & Research Roles',
  location: 'Bangalore / Remote',
  photo: '/src/assets/images/lohith_sahu_photo_1794388328665.jpg',
  heroImage: '/src/assets/images/lohith_hero_research_1794387521696.jpg',
  about: `I am a fourth-year AI engineer and deep learning researcher graduating in 2026 with a B.Tech in Artificial Intelligence (ID: 2026BTAI036). My work bridges fundamental computer vision, multimodal foundation models, agentic retrieval systems, and low-latency edge deployment. I specialize in building mission-critical machine learning systems—from self-correcting enterprise knowledge graphs to clinical diagnostic models with verifiable spatial explainability.`,
};

export const HIGHLIGHT_METRICS = [
  { value: '9.22', unit: '/ 10.0', label: 'Academic CGPA', detail: 'Consistent Dean’s List for 6 Consecutive Semesters' },
  { value: '96.4%', unit: 'AUC-ROC', label: 'Clinical Vision Benchmark', detail: 'NeuroVision-X multi-label pathology localization' },
  { value: '48.2', unit: 'FPS', label: 'Edge Vision Throughput', detail: 'TensorRT INT8 on Jetson Orin under 5W envelope' },
  { value: '42%', unit: 'Reduction', label: 'RAG Hallucination Drop', detail: 'Hybrid Neo4j Knowledge Graph + Vector traversal' },
];

export const PROJECTS: Project[] = [
  {
    id: 'neurovision-x',
    title: 'NeuroVision-X',
    subtitle: 'Multimodal Radiology Diagnostic Assistant & Grad-CAM Spatial Grounding',
    category: 'vision',
    categoryLabel: 'Computer Vision & Healthcare',
    year: '2025',
    image: '/src/assets/images/project_multimodal_vision_1794387523204.jpg',
    summary: 'A high-precision diagnostic computer vision framework evaluating 14 pulmonary pathologies from multi-view chest radiographs with interactive spatial Grad-CAM heatmaps for clinical validation.',
    problem: 'Standard convolutional classifiers in medical imaging suffer from high false-positive rates and lack transparent spatial localization, hindering physician trust and diagnostic velocity.',
    solution: 'Designed an ensemble of DenseNet-121 and Clinical Vision Transformer (ViT-B/16) with cross-attention gating and class-activation mapping to localize micro-nodules, cardiomegaly, and pleural effusion with sub-120ms latency.',
    architecture: [
      'DenseNet-121 feature extractor with dense block feature reuse',
      'Clinical ViT tokenization for long-range anatomical spatial context',
      'Cross-Attention Fusion Layer generating calibrated disease probabilities',
      'Guided Grad-CAM backpropagation engine rendering pixel-level heatmaps'
    ],
    metrics: [
      { label: 'Classification AUC', value: '96.4%', detail: 'Evaluated on NIH ChestX-ray14 benchmark' },
      { label: 'Inference Latency', value: '115 ms', detail: 'Benchmarked on NVIDIA RTX 4090 GPU' },
      { label: 'Localization IOU', value: '0.78', detail: 'Intersection-over-union on radiologist annotations' },
    ],
    tags: ['PyTorch', 'Vision Transformer', 'Grad-CAM', 'CUDA', 'TorchScript', 'DICOM'],
    githubUrl: 'https://github.com/lohithsahu120/neurovision-x',
    demoUrl: '#interactive-lab',
    codeSnippet: `class CrossAttentionFusion(nn.Module):
    def __init__(self, c_dim=1024, t_dim=768, hidden=512):
        super().__init__()
        self.proj_cnn = nn.Linear(c_dim, hidden)
        self.proj_vit = nn.Linear(t_dim, hidden)
        self.mha = nn.MultiheadAttention(hidden, num_heads=8, batch_first=True)
        self.classifier = nn.Sequential(
            nn.LayerNorm(hidden),
            nn.Linear(hidden, 14),
            nn.Sigmoid()
        )

    def forward(self, cnn_feat, vit_tokens):
        q = self.proj_cnn(cnn_feat).unsqueeze(1)
        kv = self.proj_vit(vit_tokens)
        fused, _ = self.mha(q, kv, kv)
        return self.classifier(fused.squeeze(1))`
  },
  {
    id: 'omnix-rag',
    title: 'Omnix-RAG',
    subtitle: 'Enterprise Hybrid Knowledge Graph & Agentic Subgraph Traversal',
    category: 'rag',
    categoryLabel: 'Agentic LLMs & Retrieval',
    year: '2025',
    image: '/src/assets/images/project_agentic_rag_1794387523990.jpg',
    summary: 'Self-reflective RAG engine combining dense vector embeddings with Neo4j property knowledge graph traversal to eliminate hallucinations across complex enterprise documentation.',
    problem: 'Pure vector similarity search misses multi-hop relational dependencies, leading to incomplete context retrieval and hallucinated answers on technical manuals and legal contracts.',
    solution: 'Built a dynamic query classifier that routes queries between dense Qdrant vector retrieval and Cypher-based knowledge graph subgraphs, incorporating reciprocal rank fusion (RRF) and self-correction critique loops.',
    architecture: [
      'Query Decomposition & Intent Router (Classifies multi-hop vs factual)',
      'Dual Retrieval Layer: Qdrant vector space + Neo4j property graph',
      'Reciprocal Rank Fusion (RRF) with cross-encoder re-ranking (BGE-Reranker-Large)',
      'Self-Correction Evaluator verifying claim entailment prior to final synthesis'
    ],
    metrics: [
      { label: 'Hallucination Drop', value: '-42%', detail: 'Measured using RAGAS faithfulness benchmark' },
      { label: 'Context Precision', value: '91.8%', detail: 'Across 10k enterprise document chunks' },
      { label: 'Query Routing', value: '45 ms', detail: 'Sub-second end-to-end response budget' },
    ],
    tags: ['Neo4j', 'Qdrant', 'LangChain', 'LlamaIndex', 'Python', 'FastAPI'],
    githubUrl: 'https://github.com/lohithsahu120/omnix-rag',
    demoUrl: '#interactive-lab',
    codeSnippet: `def hybrid_graph_retrieval(query: str, top_k: int = 5):
    # Decompose query & extract named entities
    entities = entity_extractor.extract(query)
    dense_vec = embedder.encode(query)
    
    # 1. Vector similarity search in Qdrant
    vec_results = qdrant_client.search(collection="docs", query_vector=dense_vec, limit=top_k * 2)
    
    # 2. Subgraph expansion in Neo4j
    graph_results = neo4j_driver.traverse_subgraphs(entities, max_depth=2)
    
    # 3. Reciprocal Rank Fusion & Cross-Encoder scoring
    fused_chunks = reciprocal_rank_fusion(vec_results, graph_results, k=60)
    return reranker.rerank(query, fused_chunks)[:top_k]`
  },
  {
    id: 'edgenano-detect',
    title: 'EdgeNano-Detect',
    subtitle: 'Sub-5W TensorRT INT8 Perception Pipeline for Autonomous Robotics',
    category: 'edge',
    categoryLabel: 'Edge AI & Embedded Robotics',
    year: '2024',
    image: '/src/assets/images/project_edge_robotics_1794387523360.jpg',
    summary: 'Hardware-optimized spatial perception system for autonomous mobile robots running real-time object tracking and obstacle avoidance on edge compute modules with strict power limits.',
    problem: 'Deploying heavy vision models onto constrained autonomous platforms causes thermal throttling, frame dropping, and high battery consumption unsuitable for field operations.',
    solution: 'Quantized custom YOLOv10 architecture to INT8 precision with post-training calibration, fused conv-batchnorm layers, and zero-copy memory transfers via NVIDIA Jetson CUDA IPC.',
    architecture: [
      'Structural pruning targeting non-critical convolutional channels',
      'TensorRT INT8 engine optimization with entropy-based quantization',
      'V4L2 camera streaming with asynchronous ring buffer',
      'ByteTrack multi-object association running on CPU core affinity'
    ],
    metrics: [
      { label: 'Frame Rate', value: '48.2 FPS', detail: 'Sustained throughput on Jetson Orin Nano' },
      { label: 'Power Consumption', value: '4.8 W', detail: 'Measured at DC barrel jack under full load' },
      { label: 'Latency', value: '18.4 ms', detail: 'End-to-end sensor-to-control loop latency' },
    ],
    tags: ['TensorRT', 'C++', 'CUDA', 'YOLOv10', 'ROS2', 'OpenCV'],
    githubUrl: 'https://github.com/lohithsahu120/edgenano-detect',
    codeSnippet: `// TensorRT INT8 Execution Context Execution
void EdgeDetector::infer(const cv::Mat& frame, std::vector<BBox>& detections) {
    cudaMemcpyAsync(d_input_, frame.ptr<float>(), input_size_, 
                    cudaMemcpyHostToDevice, stream_);
    context_->enqueueV3(stream_);
    cudaMemcpyAsync(h_output_.data(), d_output_, output_size_, 
                    cudaMemcpyDeviceToHost, stream_);
    cudaStreamSynchronize(stream_);
    postProcessINT8(h_output_, detections);
}`
  },
  {
    id: 'autotrain-ops',
    title: 'AutoTrain-Ops',
    subtitle: 'Distributed LLM Fine-Tuning Pipeline with QLoRA & DeepSpeed ZeRO-3',
    category: 'mlops',
    categoryLabel: 'Distributed MLOps',
    year: '2024',
    image: '/src/assets/images/lohith_hero_research_1794387521696.jpg',
    summary: 'A resilient, automated infrastructure framework for parameter-efficient fine-tuning (PEFT) and continuous evaluation of 7B to 70B open-weights foundation models.',
    problem: 'Full-parameter model adaptation requires prohibitive compute clusters and lacks automated gradient checkpointing, causing costly OOM crashes during long sequence training.',
    solution: 'Constructed an end-to-end pipeline implementing 4-bit NormalFloat quantization, LoRA adapter offloading, DeepSpeed ZeRO-3 parameter sharding, and Triton Inference Server export.',
    architecture: [
      'Dynamic Tokenizer Packing optimizing sequence batching up to 8k context',
      'BitsAndBytes NF4 quantization with double-dequantization',
      'DeepSpeed ZeRO Stage 3 parameter and optimizer state partitioning',
      'Automated MT-Bench and perplexity regression testing harness'
    ],
    metrics: [
      { label: 'GPU Memory Saved', value: '68%', detail: 'Enables 70B fine-tuning on 4x A100 GPUs' },
      { label: 'Training Throughput', value: '2,450 tps', detail: 'Tokens per second across distributed nodes' },
      { label: 'Deploy Artifact', value: 'Triton Ready', detail: 'Automated ONNX/TensorRT-LLM containerization' },
    ],
    tags: ['DeepSpeed', 'PyTorch', 'Hugging Face', 'Docker', 'Kubernetes', 'Triton'],
    githubUrl: 'https://github.com/lohithsahu120/autotrain-ops',
  },
  {
    id: 'gnn-moldiscovery',
    title: 'GNN-MolDiscovery',
    subtitle: 'Graph Neural Networks for Molecular Bio-affinity & Binding Prediction',
    category: 'bio',
    categoryLabel: 'Graph Deep Learning',
    year: '2024',
    image: '/src/assets/images/project_agentic_rag_1794387523990.jpg',
    summary: 'Message-passing neural network evaluating molecular graphs for candidate drug ligand-protein binding affinity, speeding early-stage screening pipelines.',
    problem: 'Conventional molecular docking simulations require minutes per compound, creating computational bottlenecks when screening millions of chemical structures.',
    solution: 'Engineered a directional message-passing neural network (DMPNN) that operates over bond-angle spatial tensors, achieving equivalent predictive accuracy in 4 milliseconds.',
    architecture: [
      'RDKit molecular feature graph extraction (atom hybridization, formal charge)',
      'Directional Message Passing layers incorporating 3D conformer coordinates',
      'Global Readout Pooling layer with multi-task regression heads',
      'Uncertainty calibration via Monte Carlo Dropout estimation'
    ],
    metrics: [
      { label: 'RMSE on BindingDB', value: '0.54', detail: 'Log-affinity error against experimental assays' },
      { label: 'Screening Speedup', value: '850x', detail: 'Compared to AutoDock Vina physics simulation' },
    ],
    tags: ['PyTorch Geometric', 'RDKit', 'Graph Neural Networks', 'SciPy', 'Python'],
    githubUrl: 'https://github.com/lohithsahu120/gnn-moldiscovery',
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'paper-1',
    title: 'Spatial Attention and Grad-CAM Grounding for Multi-Label Pathology Detection in Low-Dose CT Scans',
    authors: 'Lohith Sahu (2026BTAI036), Prof. A. Raman, Dr. K. Mehra',
    venue: 'Under Review — IEEE Transactions on Medical Imaging (Special Issue on Explainable AI)',
    year: '2025',
    badge: 'Primary Author',
    abstract: 'We present a dual-stream hybrid architecture combining deep residual representations with localized vision transformer patches to address the class-imbalance and subtle lesion morphology inherent to low-dose computed tomography (LDCT). By introducing a regulated gradient class-activation mapping loss term into intermediate layers, our framework forces model attention onto clinically relevant radiomic biomarkers, yielding a 4.1% increase in mean Average Precision while reducing clinician verification time by 32%.',
    pdfUrl: 'https://arxiv.org/abs/2026BTAI036-placeholder'
  },
  {
    id: 'paper-2',
    title: 'Knowledge-Graph Augmented Subgraph Traversal for Noise-Tolerant Domain RAG',
    authors: 'Lohith Sahu (2026BTAI036), R. Varma',
    venue: 'Conference on Neural Information Processing Systems (NeurIPS) Workshop on Retrieval-Augmented Generation',
    year: '2024',
    badge: 'Co-Author',
    abstract: 'Dense retrieval systems frequently struggle in specialized industrial domains where multi-hop topological reasoning is mandatory. We present an adaptive query routing schema that dynamically constructs typed subgraphs from property graphs, fusing them with vector distance scores using reciprocal rank heuristics. Empirical results demonstrate a 42% decrease in hallucination rates across technical failure reports.',
    pdfUrl: 'https://arxiv.org/abs/2026BTAI036-rag-placeholder'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    role: 'AI Research Intern',
    organization: 'Cognitive Robotics & Vision Laboratory',
    location: 'Bangalore, India',
    period: 'Jan 2025 – Present',
    type: 'Research Internship',
    achievements: [
      'Architected real-time visual-inertial odometry and obstacle avoidance pipeline for quadcopter navigation in GPS-denied environments.',
      'Reduced edge inference latency by 41% using TensorRT INT8 quantization and customized layer-fusion engines.',
      'Authored comprehensive technical documentation and co-authored workshop paper on spatial attention mechanisms.'
    ],
    technologies: ['PyTorch', 'TensorRT', 'ROS2', 'CUDA C++', 'Jetson Orin']
  },
  {
    id: 'exp-2',
    role: 'Machine Learning Engineering Intern',
    organization: 'NeuroPulse Intelligence Systems',
    location: 'Hyderabad, India (Hybrid)',
    period: 'May 2024 – Aug 2024',
    type: 'Engineering Internship',
    achievements: [
      'Spearheaded development of an enterprise Agentic RAG system indexing 2.4M technical specification documents with sub-second retrieval.',
      'Implemented automated continuous evaluation harness using RAGAS, logging telemetry to MLflow and Weights & Biases.',
      'Designed Dockerized microservices deployed on AWS EKS serving 120+ requests per second.'
    ],
    technologies: ['FastAPI', 'Qdrant', 'Neo4j', 'LangChain', 'Docker', 'AWS EKS']
  },
  {
    id: 'exp-3',
    role: 'Lead AI Engineer',
    organization: 'Autonomous Vehicle Student Consortium',
    location: 'Campus Chapter',
    period: 'Aug 2023 – May 2024',
    type: 'Student Leadership',
    achievements: [
      'Led a team of 8 student engineers building the perception and sensor fusion subsystem for a 1:5 scale autonomous racing vehicle.',
      'Achieved 1st place in National Autonomous Mobility Challenge among 36 universities across India.'
    ],
    technologies: ['PyTorch', 'YOLO', 'OpenCV', 'LiDAR Point Cloud', 'C++']
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Machine Learning & Deep Learning',
    skills: [
      { name: 'PyTorch / TorchScript', level: 'Expert', description: 'Custom autograd, distributed training, profiling' },
      { name: 'Computer Vision', level: 'Advanced', description: 'ViT, DenseNet, YOLOv10, Segmentation, Grad-CAM' },
      { name: 'LLMs & Agentic Systems', level: 'Advanced', description: 'QLoRA, PEFT, LangChain, LlamaIndex, vLLM' },
      { name: 'Graph Neural Networks', level: 'Proficient', description: 'PyTorch Geometric, Message Passing, MolGraph' },
      { name: 'Transformers & PEFT', level: 'Advanced', description: 'LoRA, FlashAttention-2, DeepSpeed ZeRO' },
    ]
  },
  {
    title: 'Languages & Systems',
    skills: [
      { name: 'Python', level: 'Expert', description: 'NumPy, Pandas, SciPy, AsyncIO, Poetry, Cython' },
      { name: 'C++', level: 'Advanced', description: 'Modern C++17/20, STL, CUDA acceleration, ROS2' },
      { name: 'TypeScript / React', level: 'Advanced', description: 'Full-stack UI, Node/Express, Vite, Tailwind CSS' },
      { name: 'SQL & Graph DBs', level: 'Advanced', description: 'PostgreSQL, Neo4j (Cypher), Qdrant, ChromaDB' },
    ]
  },
  {
    title: 'MLOps, Cloud & Infrastructure',
    skills: [
      { name: 'TensorRT & ONNX', level: 'Advanced', description: 'INT8 post-training quantization, engine serialization' },
      { name: 'Docker & Kubernetes', level: 'Proficient', description: 'Containerization, Helm charts, GPU daemon sets' },
      { name: 'AWS & GCP', level: 'Proficient', description: 'SageMaker, Vertex AI, S3, EC2, Cloud Run' },
      { name: 'CI/CD & Monitoring', level: 'Advanced', description: 'GitHub Actions, MLflow, W&B, Triton Server' },
    ]
  }
];

export const EDUCATION = {
  degree: 'Bachelor of Technology (B.Tech)',
  major: 'Artificial Intelligence & Machine Learning',
  rollNumber: '2026BTAI036',
  period: '2022 – 2026',
  cgpa: '9.22 / 10.0',
  honors: 'Dean’s Honor List (All Semesters)',
  keyCoursework: [
    'Deep Learning & Neural Networks',
    'Advanced Computer Vision & Visual Perception',
    'Natural Language Processing & LLMs',
    'Reinforcement Learning & Sequential Decision Making',
    'Distributed Systems & Cloud Computing',
    'High-Dimensional Probability & Optimization',
    'Algorithms & Computational Complexity',
    'Graph Theory & Relational Machine Learning'
  ]
};

export const HONORS = [
  { title: '1st Place, National AI Mobility Hackathon', issuer: 'Society of Automotive Engineers', year: '2024', detail: 'Out of 450+ competing university teams nationwide.' },
  { title: 'Kaggle Competitions Expert', issuer: 'Kaggle', year: '2024', detail: 'Top 2% global ranking in biomedical image segmentation challenges.' },
  { title: 'Dean’s Honor Fellowship', issuer: 'Academic Council', year: '2022–2025', detail: 'Awarded for maintaining semester GPA above 9.0 continuously.' },
  { title: 'NVIDIA Certified DLI Specialist', issuer: 'NVIDIA Deep Learning Institute', year: '2024', detail: 'Fundamentals of Deep Learning and Accelerated Computing.' },
];
