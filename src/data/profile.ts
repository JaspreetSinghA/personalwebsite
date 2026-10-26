export const profile = {
  name: "Jaspreet Ahluwalia",
  role: "Electrical Engineering @ San José State",
  location: "San Jose, CA",
  email: "jaspreetahluwalia007@gmail.com",
  github: "https://github.com/JaspreetSinghA",
  githubUser: "JaspreetSinghA",
  linkedin: "https://www.linkedin.com/in/jaspreet-ahluwalia007/",
  resume: "/Jaspreet_Ahluwalia_Resume.pdf",
  photo: "/headshot.jpg",
  goatcounter: "jaspreeta",
  seeking: "Seeking Summer 2027 internships in embedded systems, hardware, and electrical engineering.",
  summary:
    "I build embedded systems for an electric race car and tools that measure bias in AI. Currently writing SPI and CAN drivers for Spartan Racing's vehicle control unit, and maintaining BiasLens, an open-source LLM bias-detection toolkit.",
};

export type Experience = {
  org: string;
  orgNote: string;
  role: string;
  period: string;
  location?: string;
  points: string[];
  link?: string;
  /** Blog post id of a case study; only linked once the post is published. */
  writeup?: string;
};

export const experience: Experience[] = [
  {
    org: "Spartan Racing",
    orgNote: "SJSU Formula SAE Electric",
    role: "Electronics & Software — BMS, VCU, Derating",
    period: "Sep 2026 — Present",
    writeup: "spartan-racing-bms-derating",
    points: [
      "Developing SPI and CAN bus drivers for the team's custom vehicle control unit (VCU).",
      "Found the pack's hottest sensors were reading fuselink heating, not cell temperature, and that the derating model predicted only about half the real warming (~4 °C when the pack rose 8–10 °C). Retrained it to cut mean peak-temperature error from 3.76 °C to 1.05 °C.",
      "Built post-run telemetry checks that flag BMS logging failures and dead sensors; showed hard runs left only 2–4 min before a BMS fault.",
    ],
  },
  {
    org: "BiasLens",
    orgNote: "Backed by United Sikhs, a UN-partnered NGO",
    role: "Founder & Sole Developer",
    period: "Jan 2024 — Present",
    link: "https://github.com/JaspreetSinghA/biaslense",
    writeup: "biaslens-llm-as-judge",
    points: [
      "Calibrated a bias scorer against 276 human ratings (6 raters, 3 LLMs), then rebuilt it as a structured LLM-as-judge validated on a held-out split.",
      "Shipped it as a Python SDK on PyPI, a FastAPI REST API, a Streamlit app, and an MCP server.",
    ],
  },
  {
    org: "Rayfield Systems",
    orgNote: "VC-backed energy-efficiency startup",
    role: "AI & Automation Intern — Harvard Undergraduate Ventures-TECH",
    period: "Jun 2025 — Jul 2025",
    location: "Remote",
    points: [
      "Cut manual reporting time 35% and raised data accuracy 25% by automating compliance reporting with a Python tool.",
    ],
  },
];

export type Project = {
  name: string;
  description: string;
  tags: string[];
  href: string;
  writeup?: string;
  /** Live demos, docs, packages. */
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: "BiasLens",
    description:
      "Modular framework to detect and mitigate cultural and religious bias in LLM output. SDK, REST API, Streamlit app, and MCP server.",
    tags: ["Python", "FastAPI", "LLM-as-judge", "MCP"],
    href: "https://github.com/JaspreetSinghA/biaslense",
    writeup: "biaslens-llm-as-judge",
    links: [
      { label: "API docs", href: "https://web-production-59ba5.up.railway.app/docs" },
      { label: "PyPI", href: "https://pypi.org/project/biaslense/" },
    ],
  },
  {
    name: "Emissions Anomaly Dashboard",
    description:
      "Full-stack app for Rayfield Systems: upload facility emissions CSVs, train ML models, flag anomalies, and export plain-English reports.",
    tags: ["TypeScript", "scikit-learn", "Data viz"],
    href: "https://github.com/JaspreetSinghA/rayfield",
  },
];

export const education = [
  {
    school: "San José State University",
    detail: "B.S. Electrical Engineering",
    period: "Expected May 2029",
    note: "EE 30 Microcontrollers (C), Linear Algebra",
  },
  {
    school: "Diablo Valley College",
    detail: "CollegeConnect Dual Enrollment",
    period: "Completed Jun 2026",
    note: "8 transferable courses · 3.90 GPA",
  },
];

export const honors = [
  "AIME Qualifier (2022)",
  "National Merit Commended Scholar",
  "AP Scholar with Distinction",
  "Eagle Scout",
];

export const leadership = [
  {
    org: "Blind Dev, California High School",
    role: "Vice President",
    period: "2023 — 2026",
    text: "Co-led 3 accessibility hackathons with ~90 participants a year; mentored 12 teams building computer-vision tools like AI-powered glasses, OCR readers, and navigation aids.",
  },
  {
    org: "Boy Scouts of America",
    role: "Eagle Scout · Senior Patrol Leader",
    period: "2022 — 2025",
    text: "Led a 120-scout troop through 30+ outings, 10+ service projects, and three 8-day, 50-mile expeditions. Eagle project delivered ~1,400 books and ~1,300 school supplies (>$15,000) to Jaswant Singh Khalra Elementary.",
  },
];

export const skills: Record<string, string[]> = {
  Languages: ["Python", "C", "Java", "TypeScript"],
  "Hardware & Embedded": ["SPI", "CAN bus", "Microcontrollers", "BMS telemetry", "MoTeC i2 Pro"],
  "ML & Data": ["LLM-as-judge", "Prompt engineering", "NLP", "scikit-learn", "pandas", "NumPy"],
  Tools: ["FastAPI", "Streamlit", "OpenAI & Anthropic APIs", "MCP", "pytest", "Git"],
};

export const about = [
  "I like figuring out why things work the way they do. On Spartan Racing I write drivers for our vehicle control unit and dig through battery data. Turns out the hottest sensors in our pack were picking up fuselink heat, not cell temperature.",
  "BiasLens comes from the same instinct, pointed at a question close to home: how do language models describe Sikhs, and can you measure that honestly? It's taught me that a score is only useful if people agree with it.",
  "Outside engineering I dance competitive bhangra with Bhangra Empire All-Stars, run cross country (18:25 5K), and swim.",
];

export const talks = [
  { event: "United Sikhs Summit", year: "2025", text: "Presented BiasLens: how LLMs represent Sikhs and how to measure it." },
  { event: "Diablo Valley College", year: "2026", text: "Student commencement speaker." },
];

export const blogDescription = "Notes on embedded systems, race-car electronics, AI evaluation, and what I'm building.";
