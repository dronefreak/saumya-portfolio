// ─── EDIT THIS FILE to add/remove live HuggingFace demos ─────────────────────
// embedUrl: the iframe src for the Space
// spaceUrl: the direct HuggingFace link

export const demos = [
  {
    id: 'visdrone',
    title: 'Aerial Object Detection',
    description:
      'Upload a drone image or video frame and detect objects across 10 categories using models from the VisDrone benchmark model zoo. YOLO variants running on Hugging Face ZeroGPU.',
    embedUrl: 'https://dronefreak-visdrone-aerial-detection.hf.space',
    spaceUrl: 'https://huggingface.co/spaces/dronefreak/visdrone-aerial-detection',
    tags: ['YOLOv8', 'Object Detection', 'Aerial', 'Zero GPU'],
  },
  {
    id: 'uavid',
    title: 'Aerial Semantic Segmentation',
    description:
      'Upload a drone image or video frame and segment images across 8 categories using models from the UAVid benchmark model zoo. Model variants running on Hugging Face ZeroGPU.',
    embedUrl: 'https://dronefreak-uavid-aerial-segmentation.hf.space',
    spaceUrl: 'https://huggingface.co/spaces/dronefreak/uavid-aerial-segmentation',
    tags: ['Semantic Segmentation', 'Aerial', 'Zero GPU', 'YOLO26'],
  },
  {
    id: 'clearview',
    title: 'ClearView: Image Deraining',
    description:
      'Real-time single-image deraining using a custom DNN. Upload a rain-degraded image and see the restored output. Demonstrates learned image restoration under adverse conditions.',
    embedUrl: 'https://dronefreak-clearview-derain-demo.hf.space',
    spaceUrl: 'https://huggingface.co/spaces/dronefreak/clearview-derain-demo',
    tags: ['Image Restoration', 'Deraining', 'DNN'],
  },
  {
    id: 'histoformer',
    title: 'Joint Desnowing and Dehazing',
    description:
      'Unofficial demo of dronefreak/Histoformer, an easy-to-use mirror of Histoformer (ECCV 2024) by Sun, Ren, Gao, Wang, and Cao. (paper, official repo). A single model removes rain, raindrops, and snow from a picture.',
    embedUrl: 'https://dronefreak-histoformer-weather-restoration.hf.space',
    spaceUrl: 'https://huggingface.co/spaces/dronefreak/histoformer-weather-restoration',
    tags: ['Image Restoration', 'Deraining', 'Desnowing', 'DNN'],
  },
]
