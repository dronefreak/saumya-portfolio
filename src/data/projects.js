// ─── EDIT THIS FILE to add/remove/update featured projects ───────────────────
// GitHub repo stats (stars/forks) are fetched live from the API.
// 'staticStars' is the fallback shown while loading or if API fails.

export const projects = [
  {
    id: 'human-action',
    title: 'Human Action Classification',
    description:
      'Pose-based (MediaPipe) and video-based (3D CNN) action classification with 100+ architecture variants. Real-time inference pipeline with modular design for rapid benchmarking.',
    tags: ['PyTorch', 'MediaPipe', '3D CNN', 'UCF-101'],
    category: 'Computer Vision',
    githubRepo: 'human-action-classification',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/human-action-classification',
    },
    featured: true,
    badge: 'Action Recognition',
  },
  {
    id: 'visdrone-toolkit',
    title: 'VisDrone Detection Toolkit',
    description:
      'Aerial object detection toolkit covering 33 models (Torchvision + YOLO), with training pipelines, benchmarking, annotation conversion, and video inference built-in.',
    tags: ['YOLO', 'UAVs', 'Benchmark'],
    category: 'Perception',
    githubRepo: 'VisDrone-dataset-python-toolkit',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/VisDrone-dataset-python-toolkit',
      huggingface: 'https://huggingface.co/collections/dronefreak/visdrone-detection-model-zoo',
      demo: 'https://huggingface.co/spaces/dronefreak/visdrone-aerial-detection',
    },
    featured: true,
    badge: 'Object Detection',
  },
  {
    id: 'cabinet',
    title: 'CABiNet (ICRA 2021)',
    description:
      'Context Aggregation Network for low-latency semantic segmentation. Published at ICRA 2021. Efficient architecture designed for real-time performance on embedded platforms.',
    tags: ['ICRA 2021', 'MobileNetv3', 'Real-time', 'UAVs'],
    category: 'Research',
    githubRepo: 'CABiNet',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/CABiNet',
      paper: 'https://arxiv.org/abs/2011.00993',
      huggingface: 'https://huggingface.co/dronefreak/cabinet-mobilenetv3-small-uavid',
      demo: 'https://huggingface.co/spaces/dronefreak/uavid-aerial-segmentation',
    },
    featured: true,
    badge: 'Semantic Segmentation',
  },
  {
    id: 'tello-segmentation',
    title: 'UAVs: Instance Segmentation',
    description:
      'Modern instance segmentation for DJI Tello drones using YOLOv8 and Detectron2. Real-time performance with modular design and autonomous target tracking.',
    tags: ['YOLOv8', 'Detectron2', 'DJI Tello'],
    category: 'Perception',
    githubRepo: 'dji-tello-object-detection-segmentation',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/dji-tello-object-detection-segmentation',
    },
    featured: true,
    badge: 'Instance Segmentation',
  },
  {
    id: 'tello-depth',
    title: 'UAVs: Collision Avoidance',
    description:
      'Real-time monocular depth estimation for DJI Tello drone collision avoidance. TF2.x PyDNet + MiDaS implementation with autonomous navigation and comprehensive test suite.',
    tags: ['Depth Estimation', 'PyDNet', 'MiDaS'],
    category: 'Perception',
    githubRepo: 'dji-tello-collision-avoidance-pydnet',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/dji-tello-collision-avoidance-pydnet',
    },
    featured: true,
    badge: 'Depth Estimation',
  },
  {
    id: 'tello-tracking',
    title: 'UAVs: Object Tracking',
    description:
      'Modern autonomous drone tracking using YOLOv8 deep learning and PID control for DJI Tello drones with real-time object detection and multi-target tracking.',
    tags: ['YOLOv8', 'PID Control', 'DJI Tello'],
    category: 'Perception',
    githubRepo: 'dji-tello-target-tracking',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/dji-tello-target-tracking',
    },
    featured: true,
    badge: 'Object Tracking',
  },

  {
    id: 'neural-flight',
    title: 'UAVs: EEG Flight Control',
    description:
  'Neural control framework for drones using motor imagery EEG classification. 73% cross-subject accuracy with PyTorch — cross-subject being the hard version, where the model generalises to users it has never seen. Enables hands-free drone control through imagined hand and feet movements.',
    tags: ['EEG', 'Motor Imagery', 'PyTorch'],
    category: 'Brain-Computer Interface',
    githubRepo: 'NeuralFlight',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/NeuralFlight',
    },
    featured: true,
    badge: 'Flight Control',
  },

  {
    id: 'uavid-zoo',
    title: 'UAVid Model Zoo',
    description:
      'Open-source model zoo on Hugging Face: YOLO26 (nano → XL) and CABiNet variants trained on UAVid. 1.9K+ dataset downloads. Plug-and-play for aerial segmentation benchmarking.',
    tags: ['YOLO26', 'UAVid', 'Semantic Segmentation'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: 'dronefreak/UAVid-2020',  // dataset where the download count lives
    hfRepoType: 'dataset',
    hfDownloads: 0,
    hfLikes: 0,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/uavid-semantic-segmentation-model-zoo',
    },
    featured: true,
    badge: 'Hugging Face',
  },
  {
    id: 'visdrone-zoo',
    title: 'VisDrone Model Zoo',
    description:
      'A collection of YOLO-based object detection models fine-tuned on the VisDrone benchmark for aerial imagery.',
    tags: ['YOLO26', 'VisDrone', 'Object Detection'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: 'dronefreak/visdrone-yolov11x',  // dataset where the download count lives
    hfRepoType: 'model',
    hfDownloads: 0,
    hfLikes: 0,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/visdrone-detection-model-zoo',
    },
    featured: true,
    badge: 'Hugging Face',
  },
]
