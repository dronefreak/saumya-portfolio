// ─── EDIT THIS FILE to add/remove/update featured projects ───────────────────
// GitHub repo stats (stars/forks) are fetched live from the API.
// 'staticStars' is the fallback shown while loading or if API fails.

export const projects = [
  {
    id: 'human-action',
    title: 'Human Action Classification',
    description:
      'Pose- and video-based action classification (MediaPipe, 3D CNN), 100+ architecture variants, real-time modular benchmarking pipeline.',
    tags: ['PyTorch', 'MediaPipe', '3D CNN', 'UCF-101'],
    category: 'Computer Vision',
    githubRepo: 'human-action-classification',
    staticStars: 0,
    staticForks: 0,
    links: {
      github: 'https://github.com/dronefreak/human-action-classification',
      huggingface: 'https://huggingface.co/collections/dronefreak/human-action-classification-model-zoo',
    },
    featured: true,
    badge: 'Action Recognition',
  },
  {
    id: 'visdrone-toolkit',
    title: 'VisDrone Detection Toolkit',
    description:
      '33 aerial detection models (Torchvision + YOLO) with training, benchmarking, annotation conversion, and video inference built in.',
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
      'Context Aggregation Network for low-latency semantic segmentation, published at ICRA 2021, built for real-time inference on embedded hardware.',
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
      'Real-time instance segmentation for DJI Tello drones (YOLOv8, Detectron2) with autonomous target tracking.',
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
      'Real-time monocular depth estimation for DJI Tello collision avoidance (TF2.x PyDNet + MiDaS) with autonomous navigation.',
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
      'Autonomous DJI Tello tracking combining YOLOv8 detection with PID control for real-time multi-target tracking.',
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
      'Motor-imagery EEG classification for hands-free drone control, 73% cross-subject accuracy (generalizing to unseen users) with PyTorch.',
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
      'YOLO26 (nano to XL) and CABiNet variants trained on UAVid, 1.9K+ dataset downloads, plug-and-play for segmentation benchmarking.',
    tags: ['YOLO26', 'UAVid', 'Semantic Segmentation'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: null,
    hfCollectionSlug: 'dronefreak/uavid-semantic-segmentation-model-zoo',  // sums downloads across all models in the zoo
    hfDownloads: 392, // fallback while live collection data loads
    hfLikes: 21,
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
      'YOLO-based detection models fine-tuned on VisDrone for aerial imagery, spanning YOLOv8 through YOLO26.',
    tags: ['YOLO26', 'VisDrone', 'Object Detection'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: null,
    hfCollectionSlug: 'dronefreak/visdrone-detection-model-zoo',  // sums downloads across all models in the zoo
    hfDownloads: 2678, // fallback while live collection data loads
    hfLikes: 0,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/visdrone-detection-model-zoo',
    },
    featured: true,
    badge: 'Hugging Face',
  },
  {
    id: 'adverse-weather-zoo',
    title: 'Adverse Weather Removal Zoo',
    description:
      '9 end-to-end weather-removal models (UNet, NAFNet, Restormer, ResNetX-UNet, Histoformer) plus 4 curated rain-removal datasets, single-pass restoration.',
    tags: ['Image Restoration', 'Derain', 'NAFNet', 'Restormer'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: null,
    hfCollectionSlug: 'dronefreak/end-to-end-adverse-weather-removal',  // sums downloads across all models + datasets in the zoo
    hfDownloads: 4752, // fallback while live collection data loads
    hfLikes: 13,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/end-to-end-adverse-weather-removal',
      demo: 'https://huggingface.co/spaces/dronefreak/histoformer-weather-restoration',
    },
    featured: true,
    badge: 'Hugging Face',
  },
  {
    id: 'seadronessee-zoo',
    title: 'SeaDronesSee Model Zoo',
    description:
      'YOLO and RF-DETR detection models fine-tuned on SeaDronesSee for maritime UAV imagery, spanning YOLOv8 through YOLO26.',
    tags: ['YOLO26', 'RF-DETR', 'Maritime UAV'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: null,
    hfCollectionSlug: 'dronefreak/seadronessee-object-detection-model-zoo',
    hfDownloads: 3460, // fallback while live collection data loads
    hfLikes: 19,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/seadronessee-object-detection-model-zoo',
    },
    featured: true,
    badge: 'Hugging Face',
  },
  {
    id: 'lisa-zoo',
    title: 'LISA Traffic Lights Model Zoo',
    description:
      'YOLO and RF-DETR detection models fine-tuned on LISA for autonomous-driving traffic-light detection.',
    tags: ['YOLO26', 'RF-DETR', 'Autonomous Driving'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: null,
    hfCollectionSlug: 'dronefreak/lisa-traffic-lights-detection-model-zoo',
    hfDownloads: 1164, // fallback while live collection data loads
    hfLikes: 20,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/lisa-traffic-lights-detection-model-zoo',
    },
    featured: true,
    badge: 'Hugging Face',
  },
  {
    id: 'exdark-zoo',
    title: 'ExDark Model Zoo',
    description:
      '19 YOLO and RF-DETR detection models fine-tuned on ExDark for robust nighttime and low-light object detection.',
    tags: ['YOLO26', 'RF-DETR', 'Low-Light Detection'],
    category: 'Open Source',
    githubRepo: null,
    staticStars: null,
    staticForks: null,
    hfRepoId: null,
    hfCollectionSlug: 'dronefreak/exdark-object-detection-model-zoo',
    hfDownloads: 1905, // fallback while live collection data loads
    hfLikes: 18,
    links: {
      huggingface: 'https://huggingface.co/collections/dronefreak/exdark-object-detection-model-zoo',
    },
    featured: true,
    badge: 'Hugging Face',
  },
  {
    id: 'more-model-zoos',
    title: 'More Model Zoos',
    description:
      'DetectionBench standardizes evaluation of YOLO/RF-DETR/CABiNet beyond COCO, powering 11 fine-tuned model zoos across UAV, maritime, traffic-light, agricultural, and low-light detection.',
    tags: ['YOLO26', 'RF-DETR', 'CABiNet'],
    category: 'Open Source',
    githubRepo: 'DetectionBench',
    staticStars: 6,
    staticForks: 3,
    links: {
      github: 'https://github.com/dronefreak/DetectionBench',
      huggingface: 'https://huggingface.co/dronefreak/collections',
    },
    featured: true,
    badge: 'Hugging Face',
  },
]
