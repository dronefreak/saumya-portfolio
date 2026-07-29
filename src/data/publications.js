// ─── EDIT THIS FILE to add/remove publications ────────────────────────────────
// venueType: 'journal' | 'conference' | 'preprint'
// highlight: true = amber/cyan badge
// semanticScholarLookup: used by useSemanticScholar to fetch live citation counts
// githubRepo: optional — shows live star + fork counts on the card
// hfRepoId: optional — shows live download count for the paper's open-sourced HF model

export const publications = [
  {
    id: 'isprs-2021',
    title: 'Real-time Semantic Segmentation with Context Aggregation Network',
    venue: 'ISPRS Journal of Photogrammetry and Remote Sensing',
    venueShort: 'ISPRS 2021',
    venueType: 'journal',
    year: 2021,
    authors: 'Yang, Michael Ying; Kumaar, Saumya; Lyu, Ye; Nex, Francesco',
    note: 'Vol. 178, pp. 124–134',
    semanticScholarLookup: { type: 's2id', id: '72fcfee75fdb411895411abcc802c7aef08ef2f7' },
    githubRepo: 'CABiNet',
    hfRepoId: 'dronefreak/cabinet-mobilenetv3-small-uavid',
    links: {
      doi: 'https://doi.org/10.1016/j.isprsjprs.2021.06.007',
      github: 'https://github.com/dronefreak/CABiNet',
      huggingface: 'https://huggingface.co/dronefreak/cabinet-mobilenetv3-small-uavid',
    },
    highlight: true,
  },
  {
    id: 'cabinet-icra',
    title: 'CABiNet: Efficient Context Aggregation Network for Low-Latency Semantic Segmentation',
    venue: 'IEEE ICRA 2021',
    venueShort: 'ICRA 2021',
    venueType: 'conference',
    year: 2021,
    authors: 'Kumaar, Saumya; Lyu, Ye; Nex, Francesco; Yang, Michael Ying',
    note: 'pp. 13517–13524',
    semanticScholarLookup: { type: 's2id', id: '09155c81f5ed73136c02d59c3f0c79c83c1d86b2' },
    githubRepo: 'CABiNet',
    hfRepoId: 'dronefreak/cabinet-mobilenetv3-small-uavid',
    links: {
      doi: 'https://doi.org/10.1109/ICRA48506.2021.9560977',
      arxiv: 'https://arxiv.org/abs/2011.00993',
      github: 'https://github.com/dronefreak/CABiNet',
      huggingface: 'https://huggingface.co/dronefreak/cabinet-mobilenetv3-small-uavid',
    },
    highlight: true,
  },
  {
    id: 'irc-2019',
    title: 'Towards Behavioural Cloning for Autonomous Driving',
    venue: 'IEEE IRC 2019',
    venueShort: 'IRC 2019',
    venueType: 'conference',
    year: 2019,
    authors: 'Saksena, Saumya Kumaar; Navaneethkrishnan, B.; Hegde, Sinchana; Raja, Pragadeesh; Vishwanath, Ravi M.',
    note: 'pp. 560–567',
    semanticScholarLookup: { type: 'doi', id: '10.1109/IRC.2019.00115' },
    links: {
      doi: 'https://doi.org/10.1109/IRC.2019.00115',
      github: 'https://github.com/dronefreak/MAVNet',
    },
    highlight: false,
  },
  {
    id: 'ifac-2018',
    title: 'Vision-based Control for Aerial Obstacle Avoidance in Forest Environments',
    venue: 'IFAC-PapersOnLine 2018',
    venueShort: 'IFAC 2018',
    venueType: 'conference',
    year: 2018,
    authors: 'Mannar, Sumedh; Thummalapeta, Mourya; Saksena, Saumya Kumaar; Omkar, S.N.',
    note: 'Vol. 51, Issue 1, pp. 480–485',
    semanticScholarLookup: { type: 'doi', id: '10.1016/j.ifacol.2018.05.081' },
    links: {
      doi: 'https://doi.org/10.1016/j.ifacol.2018.05.081',
    },
    highlight: false,
  },
  {
    id: 'eeg-irc-2018',
    title: 'A Performance Study of 14-Channel and 5-Channel EEG Systems for Real-Time Control of Unmanned Aerial Vehicles (UAVs)',
    venue: 'IEEE IRC 2018',
    venueShort: 'IRC 2018',
    venueType: 'conference',
    year: 2018,
    // Fixed: these are the correct EEG paper authors, not the JuncNet authors
    authors: 'Vijayendra, Abijith; Saksena, Saumya Kumaar; Vishwanath, Ravi M.; Omkar, S.N.',
    semanticScholarLookup: { type: 'doi', id: '10.1109/IRC.2018.00040' },
    links: {
      doi: 'https://doi.org/10.1109/IRC.2018.00040',
    },
    highlight: false,
  },
  {
    id: 'juncnet-2018',
    title: 'JuncNet: A Deep Neural Network for Road Junction Disambiguation for Autonomous Vehicles',
    venue: 'arXiv 2018',
    venueShort: 'arXiv',
    venueType: 'preprint',
    year: 2018,
    authors: 'Kumaar, Saumya; Mannar, Sumedh; Omkar, S.N.',
    semanticScholarLookup: { type: 'arxiv', id: '1809.01011' },
    links: {
      arxiv: 'https://arxiv.org/abs/1809.01011',
    },
    highlight: false,
  },
]

// Author-level metrics from Semantic Scholar — update manually when checking your profile.
// S2 splits this author across two profiles due to name-variant disambiguation
// ("Saumya Kumaar Saksena" id 40990479, "Saumya Kumaar" id 144838690), so there's no
// single live API call for the merged totals — these are the deduplicated numbers.
export const authorStats = {
  publications: 14, // These are taken manually from Google Scholar
  citations: 343, // These are taken manually from Google Scholar
  hIndex: 8, // These are taken manually from Google Scholar
  i10Index: 7, // These are taken manually from Google Scholar
  highlyInfluentialCitations: 46,
}

// Patents pending — update status and add filing details when available
export const patents = [
  {
    id: 'vitals-patent',
    title: '3 patents pending: respiration rate estimation via DNN-based uncertainty estimation on Cortex Mx microprocessors (ams-OSRAM AG)',
    status: 'pending',
    year: 2024,
  },
]
