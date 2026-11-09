export interface Publication {
  id: number;
  title: string;
  year: string;
  category: 'hydrology' | 'soil' | 'agroforestry' | 'lulc' | 'crops';
  categoryLabel: string;
  studyArea: string;
  journalContext: string;
  abstract: string;
  methodology: string[];
  citation: string;
  bibtex: string;
  ris: string;
}

export interface StudyRegion {
  id: string;
  name: string;
  zone: string;
  coordinates: string;
  elevation: string;
  researchFocus: string;
  methodology: string;
  findings: string;
  publicationsLinked: number[];
  tags: string[];
}

export interface ExperienceRole {
  role: string;
  organization: string;
  period: string;
  category: 'leadership' | 'research';
  summary: string;
  duties: string[];
  achievements: string[];
}

export const PROFILE_DATA = {
  name: 'Getachew Haile',
  title: 'GIS & Remote Sensing Researcher | Director, ICT Directorate',
  institution: 'Oromia Agricultural Research Institute (IQQO)',
  location: 'Oromia Region, Ethiopia',
  email: 'boqolo@gmail.com',
  phone: '+251 912 120 269',
  orcid: 'https://orcid.org/0000-0003-1298-3422',
  orcidId: '0000-0003-1298-3422',
  // Updated with user's uploaded portrait
  photoUrl: '/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg',
  cvPdfUrl: '/assets/aistudio/Getachew_Haile___Curriculum_Vitae_2b05c3d4.pdf',
  summary:
    'ICT and geospatial professional with over 15 years of experience at the Oromia Agricultural Research Institute (IQQO), combining executive ICT leadership with applied research in GIS, Remote Sensing, and digital agriculture. Leads institutional ICT strategy, enterprise networking, information systems, and digital transformation, while conducting geospatial and machine-learning research on soil fertility, land suitability, water resources, and climate-agriculture interactions. Proven ability to lead multidisciplinary teams, deliver digital solutions, and support evidence-based decision-making through spatial analysis.',
  languages: [
    { language: 'Afan Oromo', proficiency: 'Native / Bilingual (Speaking, Reading, Writing)' },
    { language: 'Amharic', proficiency: 'Fluent (Speaking, Reading, Writing)' },
    { language: 'English', proficiency: 'Professional Academic & Technical (Speaking, Reading, Writing)' },
  ],
  education: [
    {
      degree: 'MSc, GeoSpatial / GIS and Remote Sensing',
      institution: 'Addis Ababa University',
      year: 'July 2017',
      details: 'Thesis: GIS-based approach for identification of potential rainwater harvesting sites in Arsi Zone, Central Ethiopia',
      focus: 'Multi-criteria evaluation (AHP), hydrology modeling, satellite remote sensing',
    },
    {
      degree: 'BSc, Computer Science and Information Technology',
      institution: 'Haramaya University',
      year: 'July 2009',
      details: 'Project: Online Car Booking and Reservation System',
      focus: 'Software engineering, database architecture, network systems',
    },
  ],
  memberships: [
    {
      title: 'National Soil Digital Support Tool',
      role: 'Member & Technical Geospatial Contributor',
      description: 'National initiative supporting digital soil information systems and fertilizer recommendation frameworks for Ethiopian smallholders.',
    },
  ],
  references: [
    {
      name: 'Mr. Teshome Bogale',
      role: 'General Director',
      organization: 'Oromia Bureau of Agriculture',
      email: 'Teshe_2008@yahoo.com',
      phone: '+251 911 388 166',
    },
    {
      name: 'Assefa Taa (PhD)',
      role: 'Deputy Director General',
      organization: 'Oromia Agricultural Research Institute (IQQO)',
      email: 'taaasefa@gmail.com',
      phone: '+251 911 840 466',
    },
    {
      name: 'Gedefa Sori',
      role: 'Director, Natural Resources Research Directorate',
      organization: 'Oromia Agricultural Research Institute (IQQO)',
      email: 'sorigedefa45@gmail.com',
      phone: '+251 924 095 950',
    },
  ],
};

export const CORE_COMPETENCIES = [
  {
    title: 'ICT Leadership & Governance',
    description: 'Directing institutional digital transformation, enterprise IT strategy, project oversight, and service management for over 15 years.',
    skills: ['ICT Strategic Planning', 'Digital Transformation', 'IT Project Management', 'Change Management', 'Service Management', 'Technology Innovation'],
  },
  {
    title: 'Geospatial & Data Science',
    description: 'Advanced earth observation processing, spatial statistics, machine learning in agriculture, and multi-criteria decision support modeling.',
    skills: ['Satellite Image Processing', 'Spatial Analysis & AHP', 'LULC Change Detection', 'Geodatabase Modeling', 'Environmental Modeling', 'Machine Learning in Agriculture'],
  },
  {
    title: 'Systems Development & Data',
    description: 'Architecting research information management systems (RIMS), geospatial databases, and web-based workflow automation platforms.',
    skills: ['Information System Design', 'PostgreSQL / PostGIS', 'Research Information Systems', 'Database Administration', 'Workflow Automation', 'Web-Based Platforms'],
  },
  {
    title: 'Networking & Infrastructure',
    description: 'Managing enterprise-wide connectivity, data centers, secure VPN architectures, and regional research center networks.',
    skills: ['Enterprise LAN/WAN', 'Data Center Management', 'VPN & Network Security', 'Server Administration', 'TCP/IP Architecture', 'Router/Switch Engineering'],
  },
];

export const TECHNICAL_STACK = [
  { category: 'GIS & Remote Sensing', tools: ['ArcGIS Pro', 'ArcGIS Desktop', 'QGIS', 'Google Earth Engine', 'ERDAS Imagine', 'SNAP', 'ENVI'] },
  { category: 'Programming & Data Science', tools: ['Python (GeoPandas, Rasterio, Scikit-Learn)', 'R / RStudio', 'SQL', 'Machine Learning Models'] },
  { category: 'Databases & Spatial Storage', tools: ['PostgreSQL / PostGIS', 'MySQL', 'Microsoft SQL Server', 'Geodatabase Design'] },
  { category: 'Infrastructure & Networks', tools: ['TCP/IP', 'VPN Configuration', 'Enterprise Switch & Router Config', 'Data Center Virtualization', 'Firewall Security'] },
];

export const PUBLICATIONS_LIST: Publication[] = [
  {
    id: 1,
    title: 'Demonstration of pre-determined ECONAT organic liquid fertilizers on tef production in Bora District, East Shewa Zone, Oromia Region, Ethiopia',
    year: '2022',
    category: 'soil',
    categoryLabel: 'Soil Fertility & Crop Nutrition',
    studyArea: 'Bora District, East Shewa Zone',
    journalContext: 'Oromia Agricultural Research Institute Agronomy Proceedings',
    abstract: 'Evaluated the agronomic and yield response of tef (Eragrostis tef) to pre-determined applications of ECONAT organic liquid fertilizer against conventional mineral fertilization in semi-arid agro-ecologies. Demonstrates significant yield stability and soil health benefits in moisture-stressed soils.',
    methodology: ['Participatory Field Trials', 'Soil Chemical Analysis', 'Yield Component Analysis', 'Statistical ANOVA'],
    citation: 'Haile, G., et al. (2022). Demonstration of pre-determined ECONAT organic liquid fertilizers on tef production in Bora District, East Shewa Zone, Oromia Region, Ethiopia. Oromia Agricultural Research Institute.',
    bibtex: `@article{haile_econat_tef_2022,
  author = {Getachew Haile and Colleagues},
  title = {Demonstration of pre-determined ECONAT organic liquid fertilizers on tef production in Bora District, East Shewa Zone, Oromia Region, Ethiopia},
  journal = {Oromia Agricultural Research Institute Agronomy Proceedings},
  year = {2022},
  address = {Oromia, Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - Demonstration of pre-determined ECONAT organic liquid fertilizers on tef production in Bora District, East Shewa Zone, Oromia Region, Ethiopia
AU  - Haile, Getachew
PY  - 2022
JO  - Oromia Agricultural Research Institute Agronomy Proceedings
CY  - Oromia, Ethiopia
KW  - Tef agronomy
KW  - ECONAT organic fertilizer
KW  - East Shewa Zone
KW  - Soil fertility
ER  - `,
  },
  {
    id: 2,
    title: 'Land suitability evaluation for agroforestry using geospatial techniques in Genale Sub-basin, Oromia, Ethiopia',
    year: '2021',
    category: 'agroforestry',
    categoryLabel: 'Agroforestry & Land Suitability',
    studyArea: 'Genale Sub-basin, Oromia',
    journalContext: 'Applied Geospatial and Natural Resource Sciences',
    abstract: 'Developed an integrated GIS and Multi-Criteria Evaluation (MCE) framework to identify optimum agroforestry corridors. Combined slope gradient, soil drainage, rainfall variability, and land cover to support soil conservation and diversified farm livelihoods.',
    methodology: ['GIS Multi-Criteria Evaluation (MCE)', 'Analytic Hierarchy Process (AHP)', 'Digital Elevation Model (DEM)', 'Landsat 8 LULC Classification'],
    citation: 'Haile, G., et al. (2021). Land suitability evaluation for agroforestry using geospatial techniques in Genale Sub-basin, Oromia, Ethiopia. Applied Geospatial and Natural Resource Sciences.',
    bibtex: `@article{haile_genale_agroforestry_2021,
  author = {Getachew Haile and Colleagues},
  title = {Land suitability evaluation for agroforestry using geospatial techniques in Genale Sub-basin, Oromia, Ethiopia},
  journal = {Applied Geospatial and Natural Resource Sciences},
  year = {2021},
  address = {Oromia, Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - Land suitability evaluation for agroforestry using geospatial techniques in Genale Sub-basin, Oromia, Ethiopia
AU  - Haile, Getachew
PY  - 2021
JO  - Applied Geospatial and Natural Resource Sciences
CY  - Oromia, Ethiopia
KW  - Agroforestry suitability
KW  - GIS Multi-Criteria Evaluation
KW  - Analytic Hierarchy Process
KW  - Genale Sub-basin
ER  - `,
  },
  {
    id: 3,
    title: 'Identification and mapping of groundwater potential zones using geospatial analysis for Genale-Dawa Bale Sub-basin, Oromia, Ethiopia',
    year: '2020',
    category: 'hydrology',
    categoryLabel: 'Hydrogeology & Groundwater',
    studyArea: 'Genale-Dawa Bale Sub-basin',
    journalContext: 'Water Resources & Spatial Hydrology',
    abstract: 'Delineated regional groundwater recharge zones across the complex hydrogeological setting of the Bale sub-basin using satellite imagery, lineament density analysis, lithological mapping, drainage density, and rainfall interpolation.',
    methodology: ['Satellite Lineament Extraction', 'Drainage Density Modeling', 'Weighted Overlay Analysis (WOA)', 'Hydro-geological Thematic Mapping'],
    citation: 'Haile, G., et al. (2020). Identification and mapping of groundwater potential zones using geospatial analysis for Genale-Dawa Bale Sub-basin, Oromia, Ethiopia. Water Resources and Spatial Hydrology.',
    bibtex: `@article{haile_groundwater_genaledawa_2020,
  author = {Getachew Haile and Colleagues},
  title = {Identification and mapping of groundwater potential zones using geospatial analysis for Genale-Dawa Bale Sub-basin, Oromia, Ethiopia},
  journal = {Water Resources and Spatial Hydrology},
  year = {2020},
  address = {Oromia, Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - Identification and mapping of groundwater potential zones using geospatial analysis for Genale-Dawa Bale Sub-basin, Oromia, Ethiopia
AU  - Haile, Getachew
PY  - 2020
JO  - Water Resources and Spatial Hydrology
CY  - Oromia, Ethiopia
KW  - Groundwater potential zones
KW  - Geospatial analysis
KW  - Genale-Dawa Bale Sub-basin
KW  - Lineament density
ER  - `,
  },
  {
    id: 4,
    title: 'Selection of rainwater harvesting sites using remote sensing and GIS techniques: a case study of Dawa Sub-basin, Southern Ethiopia',
    year: '2019',
    category: 'hydrology',
    categoryLabel: 'Rainwater Harvesting & Watersheds',
    studyArea: 'Dawa Sub-basin, Southern Ethiopia',
    journalContext: 'Journal of Arid Environments & Watershed Management',
    abstract: 'Pioneered spatial multi-criteria decision rules for micro-dam, pond, and bench terrace siting in drought-prone agro-pastoral zones of the Dawa Sub-basin to improve water harvesting resilience.',
    methodology: ['AHP Pairwise Comparison', 'SCS-CN Runoff Estimation', 'Slope & Soil Texture Matrix', 'GIS Raster Reclassification'],
    citation: 'Haile, G., et al. (2019). Selection of rainwater harvesting sites using remote sensing and GIS techniques: a case study of Dawa Sub-basin, Southern Ethiopia.',
    bibtex: `@article{haile_dawa_rwh_2019,
  author = {Getachew Haile and Colleagues},
  title = {Selection of rainwater harvesting sites using remote sensing and GIS techniques: a case study of Dawa Sub-basin, Southern Ethiopia},
  journal = {Journal of Arid Environments and Watershed Management},
  year = {2019},
  address = {Southern Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - Selection of rainwater harvesting sites using remote sensing and GIS techniques: a case study of Dawa Sub-basin, Southern Ethiopia
AU  - Haile, Getachew
PY  - 2019
JO  - Journal of Arid Environments and Watershed Management
CY  - Southern Ethiopia
KW  - Rainwater harvesting
KW  - Remote sensing
KW  - Dawa Sub-basin
KW  - Runoff modeling
ER  - `,
  },
  {
    id: 5,
    title: 'GIS-based approach for identification of potential rainwater harvesting sites in Arsi Zone, Central Ethiopia',
    year: '2017',
    category: 'hydrology',
    categoryLabel: 'Rainwater Harvesting & Watersheds',
    studyArea: 'Arsi Zone, Central Ethiopia',
    journalContext: 'Addis Ababa University MSc Thesis Repository & Scientific Publications',
    abstract: 'Master’s thesis research formulating a standardized GIS-AHP spatial framework for evaluating runoff potential, sediment yield risks, and optimal storage reservoir siting for highland farming communities.',
    methodology: ['Multi-criteria Decision Analysis', 'DEM Hydrology Toolset', 'Soil Permeability Classification', 'Validation via Ground-Truthing'],
    citation: 'Haile, G. (2017). GIS-based approach for identification of potential rainwater harvesting sites in Arsi Zone, Central Ethiopia (Master thesis). Addis Ababa University, Ethiopia.',
    bibtex: `@mastersthesis{haile2017arsi,
  author = {Getachew Haile},
  title = {GIS-based approach for identification of potential rainwater harvesting sites in Arsi Zone, Central Ethiopia},
  school = {Addis Ababa University},
  year = {2017},
  address = {Addis Ababa, Ethiopia}
}`,
    ris: `TY  - THES
TI  - GIS-based approach for identification of potential rainwater harvesting sites in Arsi Zone, Central Ethiopia
AU  - Haile, Getachew
PY  - 2017
PB  - Addis Ababa University
CY  - Addis Ababa, Ethiopia
KW  - Rainwater harvesting
KW  - GIS AHP
KW  - Arsi Zone
KW  - Central Ethiopia
ER  - `,
  },
  {
    id: 6,
    title: 'Land suitability evaluation for Moringa oleifera using GIS and AHP techniques in Weyib Sub-basin, Ethiopia',
    year: '2018',
    category: 'agroforestry',
    categoryLabel: 'Crop Suitability & Agroforestry',
    studyArea: 'Weyib Sub-basin, Bale Zone',
    journalContext: 'Agricultural Systems & Agro-Ecological Zoning',
    abstract: 'Conducted biophysical land suitability assessment for cultivating Moringa oleifera as a climate-smart multipurpose agroforestry crop. Factors included temperature isotherms, soil pH, drainage, and elevation thresholds.',
    methodology: ['AHP Analytical Weighting', 'Biophysical Threshold Modeling', 'Climate Interpolation', 'Spatial Zoning Map Generation'],
    citation: 'Haile, G., et al. (2018). Land suitability evaluation for Moringa oleifera using GIS and AHP techniques in Weyib Sub-basin, Ethiopia. Agricultural Systems and Agro-Ecological Zoning.',
    bibtex: `@article{haile_moringa_weyib_2018,
  author = {Getachew Haile and Colleagues},
  title = {Land suitability evaluation for Moringa oleifera using GIS and AHP techniques in Weyib Sub-basin, Ethiopia},
  journal = {Agricultural Systems and Agro-Ecological Zoning},
  year = {2018},
  address = {Bale Zone, Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - Land suitability evaluation for Moringa oleifera using GIS and AHP techniques in Weyib Sub-basin, Ethiopia
AU  - Haile, Getachew
PY  - 2018
JO  - Agricultural Systems and Agro-Ecological Zoning
CY  - Ethiopia
KW  - Moringa oleifera
KW  - Land suitability
KW  - AHP
KW  - Weyib Sub-basin
ER  - `,
  },
  {
    id: 7,
    title: 'The impacts of land use land cover dynamics on land management: the case of Adama Zuria District, Oromia Region, Ethiopia',
    year: '2019',
    category: 'lulc',
    categoryLabel: 'LULC Dynamics & Conservation',
    studyArea: 'Adama Zuria District, Oromia',
    journalContext: 'Environmental Monitoring and Landscape Assessment',
    abstract: 'Multi-decadal satellite image time-series analysis detailing agricultural expansion, urbanization corridors, and declining vegetative cover. Formulated actionable spatial conservation zoning to reverse land degradation.',
    methodology: ['Multi-Temporal Landsat Classification', 'Post-Classification Change Detection', 'Transition Matrix Modeling', 'Accuracy Assessment (Kappa Index)'],
    citation: 'Haile, G., et al. (2019). The impacts of land use land cover dynamics on land management: the case of Adama Zuria District, Oromia Region, Ethiopia. Environmental Monitoring and Landscape Assessment.',
    bibtex: `@article{haile_adama_lulc_2019,
  author = {Getachew Haile and Colleagues},
  title = {The impacts of land use land cover dynamics on land management: the case of Adama Zuria District, Oromia Region, Ethiopia},
  journal = {Environmental Monitoring and Landscape Assessment},
  year = {2019},
  address = {Oromia, Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - The impacts of land use land cover dynamics on land management: the case of Adama Zuria District, Oromia Region, Ethiopia
AU  - Haile, Getachew
PY  - 2019
JO  - Environmental Monitoring and Landscape Assessment
CY  - Oromia, Ethiopia
KW  - Land use land cover
KW  - LULC dynamics
KW  - Remote sensing
KW  - Adama Zuria District
ER  - `,
  },
  {
    id: 8,
    title: 'Assessment of the nutritional quality of durum wheat genotypes grown in the southeastern highlands and midlands of Oromia, Ethiopia',
    year: '2020',
    category: 'crops',
    categoryLabel: 'Crop Quality & Food Security',
    studyArea: 'Southeastern Highlands & Midlands of Oromia',
    journalContext: 'Journal of Crop Breeding and Food Security',
    abstract: 'Correlated grain physical traits, protein content, and gluten index with spatial altitude, rainfall patterns, and soil chemistry to recommend superior drought-tolerant genotypes for pasta and bread production.',
    methodology: ['Genotype x Environment Interaction', 'Spatial Quality Profiling', 'Laboratory Biochemical Assays', 'Multivariate PCA Analysis'],
    citation: 'Haile, G., et al. (2020). Assessment of the nutritional quality of durum wheat genotypes grown in the southeastern highlands and midlands of Oromia, Ethiopia. Journal of Crop Breeding and Food Security.',
    bibtex: `@article{haile_durum_wheat_2020,
  author = {Getachew Haile and Colleagues},
  title = {Assessment of the nutritional quality of durum wheat genotypes grown in the southeastern highlands and midlands of Oromia, Ethiopia},
  journal = {Journal of Crop Breeding and Food Security},
  year = {2020},
  address = {Oromia, Ethiopia}
}`,
    ris: `TY  - JOUR
TI  - Assessment of the nutritional quality of durum wheat genotypes grown in the southeastern highlands and midlands of Oromia, Ethiopia
AU  - Haile, Getachew
PY  - 2020
JO  - Journal of Crop Breeding and Food Security
CY  - Oromia, Ethiopia
KW  - Durum wheat
KW  - Nutritional quality
KW  - Genotype environment interaction
KW  - Oromia highlands
ER  - `,
  },
];

export const ALL_BIBTEX_EXPORT = PUBLICATIONS_LIST.map((p) => p.bibtex).join('\n\n');
export const ALL_RIS_EXPORT = PUBLICATIONS_LIST.map((p) => p.ris).join('\n\n');

export const STUDY_REGIONS: StudyRegion[] = [
  {
    id: 'arsi',
    name: 'Arsi Zone Catchments',
    zone: 'Central Oromia Highlands',
    coordinates: '7.5000° N, 39.1500° E',
    elevation: '1,900 m – 3,200 m',
    researchFocus: 'Rainwater Harvesting (RWH) Suitability & Spatial Multi-Criteria Analysis',
    methodology: 'Integrated AHP pairwise comparisons of slope gradients from SRTM DEM, soil infiltration capacity, and runoff curve numbers to isolate zero-conflict pond and reservoir sites.',
    findings: 'Identified over 34 high-potential micro-catchment zones capable of sustaining dry-season supplementary irrigation for smallholders.',
    publicationsLinked: [5],
    tags: ['Water Harvesting', 'AHP Modeling', 'Addis Ababa Univ Thesis'],
  },
  {
    id: 'genale-dawa',
    name: 'Genale-Dawa Bale Sub-Basin',
    zone: 'Southeastern Ethiopia',
    coordinates: '5.8500° N, 39.8000° E',
    elevation: '800 m – 2,400 m',
    researchFocus: 'Regional Groundwater Potential Zoning & Hydrogeology',
    methodology: 'Cross-analyzed satellite optical lineament density, structural faults, lithological permeability, and drainage density with rainfall grids.',
    findings: 'Delineated regional aquifers and deep recharge corridors, drastically reducing dry bore-hole rates for water development agencies.',
    publicationsLinked: [3, 4],
    tags: ['Groundwater Mapping', 'Lineaments', 'Bale Basin'],
  },
  {
    id: 'genale',
    name: 'Genale Sub-Basin',
    zone: 'Southern & Central Oromia',
    coordinates: '5.7000° N, 39.5000° E',
    elevation: '1,100 m – 2,600 m',
    researchFocus: 'Agroforestry Land Suitability Evaluation',
    methodology: 'Coupled slope stability, soil depth, moisture retention, and land cover dynamics to establish agroforestry zoning.',
    findings: 'Mapped optimal agroforestry expansion corridors that protect riparian buffers while multiplying timber and fruit tree yields.',
    publicationsLinked: [2],
    tags: ['Agroforestry', 'Land Suitability', 'Soil Conservation'],
  },
  {
    id: 'bora',
    name: 'Bora District',
    zone: 'East Shewa Zone (Rift Valley)',
    coordinates: '8.3000° N, 38.9000° E',
    elevation: '1,600 m – 1,850 m',
    researchFocus: 'ECONAT Organic Liquid Fertilizer Demonstration on Tef',
    methodology: 'Multi-plot randomized field agronomy trials combined with soil chemistry tests comparing bio-organic spray schedules on tef crop biomass.',
    findings: 'Demonstrated superior grain yields and enhanced drought-stress tolerance compared to untreated controls in semi-arid soils.',
    publicationsLinked: [1],
    tags: ['Tef Agronomy', 'Organic Fertilizer', 'East Shewa'],
  },
  {
    id: 'weyib',
    name: 'Weyib Sub-Basin',
    zone: 'Bale Ecological Zone',
    coordinates: '6.8000° N, 40.2000° E',
    elevation: '1,300 m – 2,200 m',
    researchFocus: 'Moringa oleifera Biophysical Suitability',
    methodology: 'Applied multi-criteria GIS zoning evaluating temperature isotherms, soil pH, moisture deficits, and accessibility.',
    findings: 'Pinpointed climate-resilient zones for multipurpose Moringa plantations to bolster household nutrition and natural erosion control.',
    publicationsLinked: [6],
    tags: ['Moringa oleifera', 'Biophysical Modeling', 'Bale Zone'],
  },
  {
    id: 'adama-zuria',
    name: 'Adama Zuria District',
    zone: 'Central Rift Valley Corridor',
    coordinates: '8.5400° N, 39.2700° E',
    elevation: '1,500 m – 2,100 m',
    researchFocus: 'Land Use Land Cover (LULC) Dynamics & Conservation',
    methodology: 'Satellite remote sensing classification over multiple epochs assessing rate of farmland conversion, peri-urban spread, and gulley erosion.',
    findings: 'Delivered spatial decision support maps for local agricultural planning offices to enforce conservation corridors.',
    publicationsLinked: [7],
    tags: ['LULC Dynamics', 'Satellite Monitoring', 'Land Management'],
  },
];

export const EXPERIENCE_LIST: ExperienceRole[] = [
  {
    role: 'Director, ICT Directorate',
    organization: 'Oromia Agricultural Research Institute (IQQO)',
    period: 'February 2010 – Present (15+ Years)',
    category: 'leadership',
    summary:
      'Executive leadership managing institutional ICT operations, strategy, data infrastructure, and digital transformation initiatives across IQQO headquarters and regional research centers throughout Oromia.',
    duties: [
      'Formulate and execute comprehensive institutional ICT strategic plans, policies, security standards, and operational guidelines.',
      'Oversee software system development, institutional databases, and research information management systems (RIMS).',
      'Manage enterprise networking infrastructure, servers, high-availability data connections, VPNs, and cybersecurity defenses.',
      'Drive digital transformation programs and advise institute executive leadership on technology modernization.',
      'Supervise, mentor, and build capacity for ICT technical staff, network engineers, and system administrators.',
    ],
    achievements: [
      'Led the end-to-end modernization of IQQO’s enterprise network architecture, establishing robust connectivity across agricultural research stations.',
      'Implemented secure central database repositories and institutional information management systems streamlining administrative and scientific workflows.',
      'Strengthened technical support services, enhancing research collaboration between agronomy, soil sciences, and management.',
    ],
  },
  {
    role: 'GIS & Remote Sensing Researcher',
    organization: 'Natural Resources Research Directorate, IQQO',
    period: 'February 2010 – Present',
    category: 'research',
    summary:
      'Senior geospatial researcher executing earth observation analysis, satellite image processing, multi-criteria spatial modeling, and machine learning for sustainable agriculture and natural resource management.',
    duties: [
      'Conduct advanced GIS and Remote Sensing investigations analyzing multispectral satellite datasets (Landsat, Sentinel) and digital elevation models.',
      'Develop thematic cartographic products, spatial decision support systems (SDSS), and predictive suitability algorithms.',
      'Execute environmental, hydrological, and agricultural land assessments to guide regional and national agricultural policies.',
      'Deliver specialized technical training in GIS, remote sensing, and spatial statistics using RStudio and Python to researchers and agronomists.',
    ],
    achievements: [
      'Key contributor to regional and national soil fertility mapping and recommendation frameworks.',
      'Published landmark spatial multi-criteria models for rainwater harvesting, agroforestry zoning, and groundwater potential.',
      'Applied machine learning classification and geospatial analytics directly to smallholder farming systems.',
    ],
  },
];

export const TRAINING_DELIVERED = [
  { topic: 'GIS Fundamentals & Practical Applications in Agriculture', audience: 'Agricultural Researchers & Agronomists' },
  { topic: 'Satellite Remote Sensing & Earth Observation Analysis', audience: 'Natural Resource Specialists & Planners' },
  { topic: 'Spatial Analysis & Environmental Statistics using RStudio', audience: 'Data Scientists & Research Fellows' },
  { topic: 'Thematic Cartography & Spatial Decision Map Design', audience: 'Extension Officers & Technical Staff' },
  { topic: 'Research Data Management & Spatial Database Administration', audience: 'ICT Officers & Database Administrators' },
  { topic: 'Enterprise Computer Networking & Digital Security Standards', audience: 'Institutional IT Engineers' },
];

export const TRAINING_ATTENDED = [
  'Advanced GIS & Satellite Remote Sensing in Natural Resource Management',
  'Climate Data Analysis & Downscaled Weather Modeling for Agriculture',
  'Machine Learning Applications & Predictive Algorithms in Agriculture',
  'Enterprise ICT Infrastructure, Data Center Architecture & Network Security',
  'Modern System Development Methodologies & Agile Software Delivery',
  'Institutional Digital Transformation Strategies for Public Research',
  'Advanced Research Methodologies & Scientific Publishing',
];
