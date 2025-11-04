// Enhanced Case Intelligence Service - AI-powered case analysis and similarity matching
import { TranslationResult } from './translationService';

export interface ExtractedEntity {
  text: string;
  type: 'PERSON' | 'ORG' | 'DATE' | 'LEGAL_TERM' | 'MEDICAL_TERM' | 'TECHNICAL_TERM' | 'LOCATION' | 'MONEY' | 'MISC';
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface SimilarCase {
  id: string;
  title: string;
  summary: string;
  date: string;
  domain: string;
  confidence: number;
  relevanceScore: number;
  source: string;
  citationLink?: string;
  keyTerms: string[];
  jurisdiction?: string;
  caseType?: string;
  tags?: string[];
  complexity?: 'low' | 'medium' | 'high';
}

export interface CaseIntelligenceResult {
  detectedDomain: string;
  domainConfidence: number;
  domainReasoning: string;
  extractedEntities: ExtractedEntity[];
  similarCases: SimilarCase[];
  insights: string[];
  processingTime: number;
  statistics?: {
    totalMatches: number;
    averageConfidence: number;
  };
}

// Domain-specific knowledge base
const LEGAL_CASES: SimilarCase[] = [
  {
    id: 'legal-001',
    title: 'Miranda v. Arizona (1966)',
    summary: 'Landmark Supreme Court case establishing the requirement for police to inform suspects of their constitutional rights before interrogation.',
    date: '1966-06-13',
    domain: 'legal',
    confidence: 95,
    relevanceScore: 88,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/384/436/',
    keyTerms: ['constitutional rights', 'due process', 'criminal proceedings', 'interrogation'],
    jurisdiction: 'Federal',
    caseType: 'Constitutional Law',
    tags: ['landmark', 'criminal rights', 'police procedure'],
    complexity: 'high'
  },
  {
    id: 'legal-002',
    title: 'Gideon v. Wainwright (1963)',
    summary: 'Supreme Court ruling that established the right to legal counsel for defendants in criminal cases, even if they cannot afford an attorney.',
    date: '1963-03-18',
    domain: 'legal',
    confidence: 92,
    relevanceScore: 85,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/372/335/',
    keyTerms: ['right to counsel', 'legal representation', 'criminal defense', 'sixth amendment'],
    jurisdiction: 'Federal',
    caseType: 'Constitutional Law',
    tags: ['right to counsel', 'criminal defense', 'sixth amendment'],
    complexity: 'high'
  },
  {
    id: 'legal-003',
    title: 'Brady v. Maryland (1963)',
    summary: 'Established the Brady Rule requiring prosecutors to disclose exculpatory evidence to the defense in criminal cases.',
    date: '1963-05-13',
    domain: 'legal',
    confidence: 90,
    relevanceScore: 82,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/373/83/',
    keyTerms: ['exculpatory evidence', 'prosecutorial misconduct', 'due process', 'criminal procedure'],
    jurisdiction: 'Federal',
    caseType: 'Criminal Procedure',
    tags: ['evidence disclosure', 'prosecutorial duty', 'fair trial'],
    complexity: 'high'
  },
  {
    id: 'legal-004',
    title: 'Strickland v. Washington (1984)',
    summary: 'Supreme Court case that established the standard for determining when a criminal defendant has received ineffective assistance of counsel.',
    date: '1984-05-14',
    domain: 'legal',
    confidence: 94,
    relevanceScore: 87,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/466/668/',
    keyTerms: ['ineffective assistance of counsel', 'legal representation', 'criminal defense', 'constitutional rights'],
    jurisdiction: 'Federal',
    caseType: 'Constitutional Law',
    tags: ['ineffective counsel', 'defense standards', 'legal representation'],
    complexity: 'high'
  },
  {
    id: 'legal-005',
    title: 'Ex parte Milligan (1866)',
    summary: 'Civil War era case establishing limits on military tribunals and the importance of habeas corpus during wartime.',
    date: '1866-04-03',
    domain: 'legal',
    confidence: 89,
    relevanceScore: 79,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/71/2/',
    keyTerms: ['habeas corpus', 'military tribunals', 'constitutional rights', 'wartime powers'],
    jurisdiction: 'Federal',
    caseType: 'Constitutional Law',
    tags: ['habeas corpus', 'military law', 'wartime', 'civil liberties'],
    complexity: 'high'
  },
  {
    id: 'legal-006',
    title: 'Brown v. Board of Education (1954)',
    summary: 'Landmark decision declaring racial segregation in public schools unconstitutional, overturning Plessy v. Ferguson.',
    date: '1954-05-17',
    domain: 'legal',
    confidence: 96,
    relevanceScore: 91,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/347/483/',
    keyTerms: ['equal protection', 'civil rights', 'segregation', 'constitutional rights', 'education'],
    jurisdiction: 'Federal',
    caseType: 'Civil Rights',
    tags: ['desegregation', 'education', 'equal protection', 'landmark'],
    complexity: 'high'
  },
  {
    id: 'legal-007',
    title: 'Roe v. Wade (1973)',
    summary: 'Supreme Court decision establishing constitutional right to abortion under the Due Process Clause of the Fourteenth Amendment.',
    date: '1973-01-22',
    domain: 'legal',
    confidence: 93,
    relevanceScore: 89,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/410/113/',
    keyTerms: ['due process', 'privacy rights', 'constitutional rights', 'reproductive rights'],
    jurisdiction: 'Federal',
    caseType: 'Constitutional Law',
    tags: ['privacy rights', 'reproductive rights', 'due process'],
    complexity: 'high'
  },
  {
    id: 'legal-008',
    title: 'Marbury v. Madison (1803)',
    summary: 'Established the principle of judicial review, giving the Supreme Court power to declare laws unconstitutional.',
    date: '1803-02-24',
    domain: 'legal',
    confidence: 97,
    relevanceScore: 94,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/5/137/',
    keyTerms: ['judicial review', 'constitutional law', 'separation of powers', 'supreme court'],
    jurisdiction: 'Federal',
    caseType: 'Constitutional Law',
    tags: ['judicial review', 'separation of powers', 'foundational'],
    complexity: 'high'
  },
  {
    id: 'legal-009',
    title: 'Mapp v. Ohio (1961)',
    summary: 'Applied the Fourth Amendment exclusionary rule to state courts, prohibiting use of illegally obtained evidence.',
    date: '1961-06-19',
    domain: 'legal',
    confidence: 91,
    relevanceScore: 86,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/367/643/',
    keyTerms: ['fourth amendment', 'exclusionary rule', 'search and seizure', 'evidence'],
    jurisdiction: 'Federal',
    caseType: 'Criminal Procedure',
    tags: ['fourth amendment', 'exclusionary rule', 'evidence'],
    complexity: 'medium'
  },
  {
    id: 'legal-010',
    title: 'Terry v. Ohio (1968)',
    summary: 'Established the "Terry stop" allowing police to briefly detain and frisk suspects based on reasonable suspicion.',
    date: '1968-06-10',
    domain: 'legal',
    confidence: 88,
    relevanceScore: 83,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/392/1/',
    keyTerms: ['reasonable suspicion', 'stop and frisk', 'fourth amendment', 'police powers'],
    jurisdiction: 'Federal',
    caseType: 'Criminal Procedure',
    tags: ['stop and frisk', 'reasonable suspicion', 'police powers'],
    complexity: 'medium'
  },
  {
    id: 'legal-011',
    title: 'New York Times Co. v. Sullivan (1964)',
    summary: 'Established "actual malice" standard for defamation cases involving public figures, protecting freedom of press.',
    date: '1964-03-09',
    domain: 'legal',
    confidence: 89,
    relevanceScore: 84,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/376/254/',
    keyTerms: ['first amendment', 'freedom of press', 'defamation', 'actual malice', 'public figures'],
    jurisdiction: 'Federal',
    caseType: 'First Amendment',
    tags: ['press freedom', 'defamation', 'actual malice', 'public figures'],
    complexity: 'medium'
  },
  {
    id: 'legal-012',
    title: 'Korematsu v. United States (1944)',
    summary: 'Controversial decision upholding Japanese American internment during WWII, later widely criticized and overruled.',
    date: '1944-12-18',
    domain: 'legal',
    confidence: 85,
    relevanceScore: 78,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/323/214/',
    keyTerms: ['equal protection', 'wartime powers', 'civil rights', 'internment', 'racial discrimination'],
    jurisdiction: 'Federal',
    caseType: 'Civil Rights',
    tags: ['internment', 'wartime', 'racial discrimination', 'controversial'],
    complexity: 'high'
  },
  {
    id: 'legal-013',
    title: 'Loving v. Virginia (1967)',
    summary: 'Struck down laws prohibiting interracial marriage, establishing marriage as a fundamental right.',
    date: '1967-06-12',
    domain: 'legal',
    confidence: 92,
    relevanceScore: 87,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/388/1/',
    keyTerms: ['equal protection', 'due process', 'marriage rights', 'civil rights', 'racial discrimination'],
    jurisdiction: 'Federal',
    caseType: 'Civil Rights',
    tags: ['marriage equality', 'interracial marriage', 'civil rights'],
    complexity: 'medium'
  },
  {
    id: 'legal-014',
    title: 'Tinker v. Des Moines (1969)',
    summary: 'Protected student free speech rights in schools, establishing that students do not "shed their constitutional rights at the schoolhouse gate."',
    date: '1969-02-24',
    domain: 'legal',
    confidence: 87,
    relevanceScore: 81,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/393/503/',
    keyTerms: ['first amendment', 'student rights', 'free speech', 'education', 'constitutional rights'],
    jurisdiction: 'Federal',
    caseType: 'First Amendment',
    tags: ['student rights', 'free speech', 'education', 'youth rights'],
    complexity: 'medium'
  },
  {
    id: 'legal-015',
    title: 'Griswold v. Connecticut (1965)',
    summary: 'Established constitutional right to privacy in marital relations, striking down laws banning contraceptives.',
    date: '1965-06-07',
    domain: 'legal',
    confidence: 90,
    relevanceScore: 85,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/381/479/',
    keyTerms: ['privacy rights', 'due process', 'marriage', 'reproductive rights', 'constitutional rights'],
    jurisdiction: 'Federal',
    caseType: 'Privacy Rights',
    tags: ['privacy rights', 'contraception', 'marriage', 'reproductive rights'],
    complexity: 'medium'
  },
  {
    id: 'legal-016',
    title: 'Citizens United v. FEC (2010)',
    summary: 'Controversial decision allowing unlimited corporate spending in elections under First Amendment protection.',
    date: '2010-01-21',
    domain: 'legal',
    confidence: 86,
    relevanceScore: 80,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/558/310/',
    keyTerms: ['first amendment', 'campaign finance', 'corporate speech', 'election law', 'political spending'],
    jurisdiction: 'Federal',
    caseType: 'Election Law',
    tags: ['campaign finance', 'corporate speech', 'political spending', 'controversial'],
    complexity: 'high'
  },
  {
    id: 'legal-017',
    title: 'District of Columbia v. Heller (2008)',
    summary: 'Landmark Second Amendment case establishing individual right to bear arms, striking down DC handgun ban.',
    date: '2008-06-26',
    domain: 'legal',
    confidence: 91,
    relevanceScore: 86,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/554/570/',
    keyTerms: ['second amendment', 'gun rights', 'individual rights', 'constitutional interpretation'],
    jurisdiction: 'Federal',
    caseType: 'Second Amendment',
    tags: ['gun rights', 'individual rights', 'second amendment'],
    complexity: 'high'
  },
  {
    id: 'legal-018',
    title: 'Obergefell v. Hodges (2015)',
    summary: 'Established constitutional right to same-sex marriage under Equal Protection and Due Process Clauses.',
    date: '2015-06-26',
    domain: 'legal',
    confidence: 93,
    relevanceScore: 88,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/576/644/',
    keyTerms: ['equal protection', 'due process', 'marriage equality', 'civil rights', 'same-sex marriage'],
    jurisdiction: 'Federal',
    caseType: 'Civil Rights',
    tags: ['marriage equality', 'same-sex marriage', 'civil rights', 'landmark'],
    complexity: 'high'
  },
  {
    id: 'legal-019',
    title: 'Katz v. United States (1967)',
    summary: 'Established reasonable expectation of privacy test for Fourth Amendment protection in electronic surveillance.',
    date: '1967-12-18',
    domain: 'legal',
    confidence: 89,
    relevanceScore: 84,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/389/347/',
    keyTerms: ['fourth amendment', 'privacy rights', 'electronic surveillance', 'reasonable expectation'],
    jurisdiction: 'Federal',
    caseType: 'Privacy Rights',
    tags: ['electronic surveillance', 'privacy rights', 'fourth amendment'],
    complexity: 'medium'
  },
  {
    id: 'legal-020',
    title: 'United States v. Nixon (1974)',
    summary: 'Established limits on executive privilege, requiring President Nixon to turn over Watergate tapes.',
    date: '1974-07-24',
    domain: 'legal',
    confidence: 94,
    relevanceScore: 89,
    source: 'U.S. Supreme Court',
    citationLink: 'https://supreme.justia.com/cases/federal/us/418/683/',
    keyTerms: ['executive privilege', 'separation of powers', 'presidential powers', 'watergate'],
    jurisdiction: 'Federal',
    caseType: 'Executive Power',
    tags: ['executive privilege', 'watergate', 'presidential powers', 'separation of powers'],
    complexity: 'high'
  }
];

const MEDICAL_CASES: SimilarCase[] = [
  {
    id: 'medical-001',
    title: 'Acute Myocardial Infarction (Heart Attack) - STEMI',
    summary: 'Emergency case: 65-year-old patient with severe chest pain, elevated troponin levels, and ST-elevation on ECG requiring immediate cardiac catheterization.',
    date: '2023-08-15',
    domain: 'medical',
    confidence: 91,
    relevanceScore: 84,
    source: 'Journal of Cardiology',
    keyTerms: ['myocardial infarction', 'heart attack', 'chest pain', 'cardiac enzymes', 'troponin', 'ECG', 'STEMI', 'cardiac catheterization'],
    jurisdiction: 'Clinical',
    caseType: 'Cardiology',
    tags: ['emergency', 'cardiac', 'acute care', 'interventional cardiology'],
    complexity: 'high'
  },
  {
    id: 'medical-002',
    title: 'Type 2 Diabetes Mellitus - Comprehensive Management',
    summary: 'Complete treatment protocol for newly diagnosed Type 2 diabetes: lifestyle modifications, metformin initiation, blood glucose monitoring, and HbA1c targets.',
    date: '2023-09-22',
    domain: 'medical',
    confidence: 88,
    relevanceScore: 81,
    source: 'Endocrinology Review',
    keyTerms: ['diabetes mellitus', 'type 2 diabetes', 'blood glucose', 'blood sugar', 'insulin resistance', 'metformin', 'HbA1c', 'glycemic control'],
    jurisdiction: 'Clinical',
    caseType: 'Endocrinology',
    tags: ['chronic disease', 'metabolic', 'lifestyle', 'endocrine'],
    complexity: 'medium'
  },
  {
    id: 'medical-003',
    title: 'Surgical Site Infection Prevention Protocol',
    summary: 'Evidence-based guidelines for preventing post-operative infections: antibiotic prophylaxis, sterile technique, wound care, and infection surveillance.',
    date: '2023-07-10',
    domain: 'medical',
    confidence: 86,
    relevanceScore: 78,
    source: 'Surgical Infection Control',
    keyTerms: ['post-operative', 'surgery', 'infection prevention', 'surgical site infection', 'antibiotic prophylaxis', 'wound care', 'sterile technique'],
    jurisdiction: 'Clinical',
    caseType: 'Surgery',
    tags: ['infection control', 'surgery', 'prevention', 'post-operative care'],
    complexity: 'medium'
  },
  {
    id: 'medical-004',
    title: 'Chronic Kidney Disease (CKD) Stage 4 - Advanced Management',
    summary: 'Advanced CKD management: GFR monitoring, mineral bone disorder treatment, anemia management, and dialysis preparation protocols.',
    date: '2023-06-18',
    domain: 'medical',
    confidence: 89,
    relevanceScore: 83,
    source: 'Nephrology Clinical Practice',
    keyTerms: ['chronic kidney disease', 'CKD', 'kidney disease', 'renal function', 'GFR', 'dialysis', 'kidney transplant', 'nephrology'],
    jurisdiction: 'Clinical',
    caseType: 'Nephrology',
    tags: ['chronic disease', 'renal', 'dialysis', 'nephrology'],
    complexity: 'high'
  },
  {
    id: 'medical-005',
    title: 'Psychiatric Emergency - Crisis Intervention',
    summary: 'Emergency psychiatric protocol: suicide risk assessment, crisis de-escalation, involuntary commitment procedures, and safety planning.',
    date: '2023-05-25',
    domain: 'medical',
    confidence: 87,
    relevanceScore: 80,
    source: 'Emergency Psychiatry Journal',
    keyTerms: ['mental health', 'psychiatric emergency', 'suicide risk', 'crisis intervention', 'depression', 'anxiety', 'psychiatric evaluation'],
    jurisdiction: 'Clinical',
    caseType: 'Psychiatry',
    tags: ['mental health', 'emergency', 'crisis intervention', 'psychiatry'],
    complexity: 'high'
  },
  {
    id: 'medical-016',
    title: 'Hypertension (High Blood Pressure) Management',
    summary: 'Comprehensive hypertension management: lifestyle modifications, ACE inhibitors, ARBs, diuretics, and cardiovascular risk reduction.',
    date: '2023-10-12',
    domain: 'medical',
    confidence: 90,
    relevanceScore: 85,
    source: 'Hypertension Management Guidelines',
    keyTerms: ['hypertension', 'high blood pressure', 'blood pressure', 'ACE inhibitors', 'ARBs', 'diuretics', 'cardiovascular risk'],
    jurisdiction: 'Clinical',
    caseType: 'Cardiology',
    tags: ['hypertension', 'cardiovascular', 'chronic disease'],
    complexity: 'medium'
  },
  {
    id: 'medical-017',
    title: 'Pneumonia - Community Acquired Treatment',
    summary: 'Community-acquired pneumonia management: chest X-ray diagnosis, antibiotic selection, severity assessment, and hospitalization criteria.',
    date: '2023-09-28',
    domain: 'medical',
    confidence: 88,
    relevanceScore: 82,
    source: 'Pulmonology Clinical Guidelines',
    keyTerms: ['pneumonia', 'respiratory infection', 'chest X-ray', 'antibiotics', 'lung infection', 'cough', 'fever'],
    jurisdiction: 'Clinical',
    caseType: 'Pulmonology',
    tags: ['respiratory', 'infection', 'antibiotics'],
    complexity: 'medium'
  },
  {
    id: 'medical-018',
    title: 'Appendicitis - Acute Surgical Emergency',
    summary: 'Acute appendicitis diagnosis and management: clinical presentation, CT imaging, laparoscopic appendectomy, and post-operative care.',
    date: '2023-08-05',
    domain: 'medical',
    confidence: 92,
    relevanceScore: 88,
    source: 'Emergency Surgery Journal',
    keyTerms: ['appendicitis', 'abdominal pain', 'surgery', 'appendectomy', 'CT scan', 'emergency surgery'],
    jurisdiction: 'Clinical',
    caseType: 'General Surgery',
    tags: ['emergency surgery', 'abdominal', 'acute care'],
    complexity: 'high'
  },
  {
    id: 'medical-019',
    title: 'Bone Fracture - Orthopedic Management',
    summary: 'Fracture management protocol: X-ray diagnosis, fracture classification, casting, surgical fixation, and rehabilitation planning.',
    date: '2023-07-18',
    domain: 'medical',
    confidence: 86,
    relevanceScore: 80,
    source: 'Orthopedic Surgery Review',
    keyTerms: ['fracture', 'broken bone', 'X-ray', 'cast', 'orthopedic surgery', 'bone healing', 'rehabilitation'],
    jurisdiction: 'Clinical',
    caseType: 'Orthopedics',
    tags: ['orthopedics', 'trauma', 'bone', 'rehabilitation'],
    complexity: 'medium'
  },
  {
    id: 'medical-020',
    title: 'Cancer Diagnosis and Treatment Planning',
    summary: 'Comprehensive cancer care: biopsy confirmation, staging, chemotherapy protocols, radiation therapy, and multidisciplinary team approach.',
    date: '2023-06-30',
    domain: 'medical',
    confidence: 94,
    relevanceScore: 90,
    source: 'Oncology Treatment Guidelines',
    keyTerms: ['cancer', 'tumor', 'biopsy', 'chemotherapy', 'radiation therapy', 'oncology', 'staging', 'malignancy'],
    jurisdiction: 'Clinical',
    caseType: 'Oncology',
    tags: ['cancer', 'oncology', 'chemotherapy', 'radiation'],
    complexity: 'high'
  },
  {
    id: 'medical-021',
    title: 'Asthma - Chronic Respiratory Management',
    summary: 'Asthma management protocol: inhaler therapy, peak flow monitoring, trigger avoidance, and acute exacerbation treatment.',
    date: '2023-05-15',
    domain: 'medical',
    confidence: 87,
    relevanceScore: 83,
    source: 'Respiratory Medicine Journal',
    keyTerms: ['asthma', 'inhaler', 'bronchodilator', 'respiratory', 'wheezing', 'shortness of breath', 'peak flow'],
    jurisdiction: 'Clinical',
    caseType: 'Pulmonology',
    tags: ['respiratory', 'chronic disease', 'inhaler therapy'],
    complexity: 'medium'
  },
  {
    id: 'medical-022',
    title: 'Migraine Headache - Neurological Management',
    summary: 'Migraine treatment approach: trigger identification, preventive medications, acute treatment, and lifestyle modifications.',
    date: '2023-04-22',
    domain: 'medical',
    confidence: 85,
    relevanceScore: 81,
    source: 'Neurology Clinical Practice',
    keyTerms: ['migraine', 'headache', 'neurological', 'pain management', 'triggers', 'medication'],
    jurisdiction: 'Clinical',
    caseType: 'Neurology',
    tags: ['neurology', 'pain management', 'headache'],
    complexity: 'medium'
  },
  {
    id: 'medical-023',
    title: 'Gastroenteritis - Digestive System Infection',
    summary: 'Gastroenteritis management: fluid replacement, dietary modifications, antiemetic therapy, and infection control measures.',
    date: '2023-03-10',
    domain: 'medical',
    confidence: 83,
    relevanceScore: 78,
    source: 'Gastroenterology Review',
    keyTerms: ['gastroenteritis', 'stomach flu', 'diarrhea', 'vomiting', 'dehydration', 'fluid replacement'],
    jurisdiction: 'Clinical',
    caseType: 'Gastroenterology',
    tags: ['gastroenterology', 'infection', 'digestive'],
    complexity: 'low'
  },
  {
    id: 'medical-024',
    title: 'Urinary Tract Infection (UTI) Treatment',
    summary: 'UTI diagnosis and treatment: urine analysis, antibiotic selection, recurrence prevention, and complicated UTI management.',
    date: '2023-02-18',
    domain: 'medical',
    confidence: 89,
    relevanceScore: 84,
    source: 'Urology Clinical Guidelines',
    keyTerms: ['urinary tract infection', 'UTI', 'urine analysis', 'antibiotics', 'bladder infection', 'kidney infection'],
    jurisdiction: 'Clinical',
    caseType: 'Urology',
    tags: ['urology', 'infection', 'antibiotics'],
    complexity: 'low'
  },
  {
    id: 'medical-025',
    title: 'Skin Conditions - Dermatological Assessment',
    summary: 'Common skin conditions: eczema, psoriasis, dermatitis diagnosis, topical treatments, and dermatological referral criteria.',
    date: '2023-01-25',
    domain: 'medical',
    confidence: 84,
    relevanceScore: 79,
    source: 'Dermatology Practice Guidelines',
    keyTerms: ['skin condition', 'eczema', 'psoriasis', 'dermatitis', 'rash', 'topical treatment', 'dermatology'],
    jurisdiction: 'Clinical',
    caseType: 'Dermatology',
    tags: ['dermatology', 'skin', 'topical treatment'],
    complexity: 'low'
  },
  {
    id: 'medical-006',
    title: 'COVID-19 Acute Respiratory Distress Syndrome',
    summary: 'Management of severe COVID-19 patients with ARDS requiring mechanical ventilation and prone positioning.',
    date: '2023-03-12',
    domain: 'medical',
    confidence: 92,
    relevanceScore: 87,
    source: 'Critical Care Medicine',
    keyTerms: ['COVID-19', 'ARDS', 'mechanical ventilation', 'respiratory failure', 'intensive care'],
    jurisdiction: 'Clinical',
    caseType: 'Critical Care',
    tags: ['COVID-19', 'critical care', 'respiratory'],
    complexity: 'high'
  },
  {
    id: 'medical-007',
    title: 'Pediatric Asthma Exacerbation Management',
    summary: 'Emergency treatment protocol for children presenting with severe asthma attacks and respiratory distress.',
    date: '2023-04-08',
    domain: 'medical',
    confidence: 89,
    relevanceScore: 84,
    source: 'Pediatric Emergency Medicine',
    keyTerms: ['pediatric asthma', 'respiratory distress', 'bronchodilators', 'emergency treatment'],
    jurisdiction: 'Clinical',
    caseType: 'Pediatrics',
    tags: ['pediatric', 'respiratory', 'emergency'],
    complexity: 'medium'
  },
  {
    id: 'medical-008',
    title: 'Stroke Thrombolysis Treatment Protocol',
    summary: 'Time-sensitive administration of tissue plasminogen activator (tPA) for acute ischemic stroke patients.',
    date: '2023-02-20',
    domain: 'medical',
    confidence: 94,
    relevanceScore: 90,
    source: 'Neurology Clinical Practice',
    keyTerms: ['stroke', 'thrombolysis', 'tPA', 'ischemic stroke', 'neurological emergency'],
    jurisdiction: 'Clinical',
    caseType: 'Neurology',
    tags: ['stroke', 'emergency', 'neurology', 'time-critical'],
    complexity: 'high'
  },
  {
    id: 'medical-009',
    title: 'Sepsis Recognition and Early Management',
    summary: 'Implementation of sepsis bundles and early goal-directed therapy in emergency department settings.',
    date: '2023-01-15',
    domain: 'medical',
    confidence: 91,
    relevanceScore: 86,
    source: 'Emergency Medicine Journal',
    keyTerms: ['sepsis', 'septic shock', 'early goal-directed therapy', 'infection', 'emergency medicine'],
    jurisdiction: 'Clinical',
    caseType: 'Emergency Medicine',
    tags: ['sepsis', 'emergency', 'infection', 'critical'],
    complexity: 'high'
  },
  {
    id: 'medical-010',
    title: 'Breast Cancer Screening and Diagnosis',
    summary: 'Comprehensive approach to breast cancer screening using mammography, ultrasound, and biopsy techniques.',
    date: '2023-05-30',
    domain: 'medical',
    confidence: 88,
    relevanceScore: 82,
    source: 'Oncology Screening Review',
    keyTerms: ['breast cancer', 'mammography', 'cancer screening', 'biopsy', 'oncology'],
    jurisdiction: 'Clinical',
    caseType: 'Oncology',
    tags: ['cancer screening', 'oncology', 'prevention'],
    complexity: 'medium'
  },
  {
    id: 'medical-011',
    title: 'Hypertensive Emergency Management',
    summary: 'Acute management of severe hypertension with end-organ damage in emergency department settings.',
    date: '2023-07-22',
    domain: 'medical',
    confidence: 87,
    relevanceScore: 81,
    source: 'Hypertension Management',
    keyTerms: ['hypertensive emergency', 'blood pressure', 'end-organ damage', 'antihypertensive therapy'],
    jurisdiction: 'Clinical',
    caseType: 'Cardiology',
    tags: ['hypertension', 'emergency', 'cardiovascular'],
    complexity: 'medium'
  },
  {
    id: 'medical-012',
    title: 'Alzheimer Disease Early Intervention',
    summary: 'Early detection and intervention strategies for mild cognitive impairment and early-stage Alzheimer disease.',
    date: '2023-06-05',
    domain: 'medical',
    confidence: 85,
    relevanceScore: 79,
    source: 'Geriatric Medicine Review',
    keyTerms: ['alzheimer disease', 'dementia', 'cognitive impairment', 'neurodegeneration', 'geriatrics'],
    jurisdiction: 'Clinical',
    caseType: 'Geriatrics',
    tags: ['dementia', 'geriatrics', 'neurodegenerative'],
    complexity: 'medium'
  },
  {
    id: 'medical-013',
    title: 'Trauma Resuscitation Protocol',
    summary: 'Advanced trauma life support protocols for multi-system trauma patients in emergency settings.',
    date: '2023-08-28',
    domain: 'medical',
    confidence: 93,
    relevanceScore: 88,
    source: 'Trauma Surgery Journal',
    keyTerms: ['trauma resuscitation', 'ATLS', 'multi-system trauma', 'emergency surgery', 'shock'],
    jurisdiction: 'Clinical',
    caseType: 'Trauma Surgery',
    tags: ['trauma', 'emergency surgery', 'resuscitation'],
    complexity: 'high'
  },
  {
    id: 'medical-014',
    title: 'Antibiotic Resistance Management',
    summary: 'Strategies for managing multidrug-resistant bacterial infections and antibiotic stewardship programs.',
    date: '2023-04-18',
    domain: 'medical',
    confidence: 86,
    relevanceScore: 80,
    source: 'Infectious Disease Control',
    keyTerms: ['antibiotic resistance', 'MRSA', 'infection control', 'antimicrobial stewardship'],
    jurisdiction: 'Clinical',
    caseType: 'Infectious Disease',
    tags: ['antibiotic resistance', 'infection control', 'stewardship'],
    complexity: 'medium'
  },
  {
    id: 'medical-015',
    title: 'Pregnancy Complications Management',
    summary: 'Management of high-risk pregnancies including preeclampsia, gestational diabetes, and preterm labor.',
    date: '2023-09-10',
    domain: 'medical',
    confidence: 90,
    relevanceScore: 85,
    source: 'Obstetrics & Gynecology',
    keyTerms: ['pregnancy complications', 'preeclampsia', 'gestational diabetes', 'preterm labor', 'obstetrics'],
    jurisdiction: 'Clinical',
    caseType: 'Obstetrics',
    tags: ['pregnancy', 'obstetrics', 'complications'],
    complexity: 'medium'
  }
];

const TECHNICAL_CASES: SimilarCase[] = [
  {
    id: 'technical-001',
    title: 'Microservices Architecture Implementation',
    summary: 'Comprehensive guide for migrating monolithic applications to microservices architecture with containerization and orchestration.',
    date: '2023-09-01',
    domain: 'technical',
    confidence: 93,
    relevanceScore: 89,
    source: 'Software Architecture Review',
    keyTerms: ['microservices', 'containerization', 'kubernetes', 'system architecture', 'scalability'],
    jurisdiction: 'Technical',
    caseType: 'Software Architecture',
    tags: ['microservices', 'architecture', 'scalability'],
    complexity: 'high'
  },
  {
    id: 'technical-002',
    title: 'Cloud Security Best Practices Framework',
    summary: 'Enterprise-grade security framework for cloud infrastructure including identity management, encryption, and compliance.',
    date: '2023-08-20',
    domain: 'technical',
    confidence: 90,
    relevanceScore: 86,
    source: 'Cloud Security Alliance',
    keyTerms: ['cloud security', 'encryption', 'identity management', 'compliance', 'security framework'],
    jurisdiction: 'Technical',
    caseType: 'Cybersecurity',
    tags: ['cloud security', 'encryption', 'compliance'],
    complexity: 'high'
  },
  {
    id: 'technical-003',
    title: 'Machine Learning Model Deployment Pipeline',
    summary: 'End-to-end MLOps pipeline for deploying and monitoring machine learning models in production environments.',
    date: '2023-07-30',
    domain: 'technical',
    confidence: 88,
    relevanceScore: 84,
    source: 'AI Engineering Journal',
    keyTerms: ['machine learning', 'MLOps', 'model deployment', 'monitoring', 'production pipeline'],
    jurisdiction: 'Technical',
    caseType: 'Machine Learning',
    tags: ['machine learning', 'MLOps', 'deployment'],
    complexity: 'high'
  },
  {
    id: 'technical-004',
    title: 'Database Performance Optimization Strategies',
    summary: 'Advanced techniques for optimizing database performance including indexing, query optimization, and caching strategies.',
    date: '2023-06-12',
    domain: 'technical',
    confidence: 85,
    relevanceScore: 81,
    source: 'Database Administration Quarterly',
    keyTerms: ['database optimization', 'indexing', 'query performance', 'caching', 'database tuning'],
    jurisdiction: 'Technical',
    caseType: 'Database Management',
    tags: ['database', 'performance', 'optimization'],
    complexity: 'medium'
  },
  {
    id: 'technical-005',
    title: 'API Gateway Design Patterns',
    summary: 'Design patterns and best practices for implementing API gateways in distributed systems with focus on security and scalability.',
    date: '2023-05-08',
    domain: 'technical',
    confidence: 87,
    relevanceScore: 82,
    source: 'Systems Design Review',
    keyTerms: ['API gateway', 'distributed systems', 'API security', 'rate limiting', 'load balancing'],
    jurisdiction: 'Technical',
    caseType: 'System Design',
    tags: ['API gateway', 'distributed systems', 'security'],
    complexity: 'medium'
  },
  {
    id: 'technical-006',
    title: 'DevOps CI/CD Pipeline Implementation',
    summary: 'Complete continuous integration and deployment pipeline using Jenkins, Docker, and Kubernetes for automated software delivery.',
    date: '2023-10-15',
    domain: 'technical',
    confidence: 91,
    relevanceScore: 87,
    source: 'DevOps Engineering',
    keyTerms: ['CI/CD', 'jenkins', 'docker', 'kubernetes', 'automation', 'deployment pipeline'],
    jurisdiction: 'Technical',
    caseType: 'DevOps',
    tags: ['CI/CD', 'automation', 'deployment'],
    complexity: 'medium'
  },
  {
    id: 'technical-007',
    title: 'Blockchain Smart Contract Security Audit',
    summary: 'Comprehensive security audit methodology for Ethereum smart contracts including common vulnerabilities and testing frameworks.',
    date: '2023-09-25',
    domain: 'technical',
    confidence: 89,
    relevanceScore: 85,
    source: 'Blockchain Security Review',
    keyTerms: ['blockchain', 'smart contracts', 'ethereum', 'security audit', 'cryptocurrency'],
    jurisdiction: 'Technical',
    caseType: 'Blockchain',
    tags: ['blockchain', 'smart contracts', 'security audit'],
    complexity: 'high'
  },
  {
    id: 'technical-008',
    title: 'Real-time Data Streaming Architecture',
    summary: 'Implementation of real-time data processing using Apache Kafka, Apache Spark, and stream processing frameworks.',
    date: '2023-08-12',
    domain: 'technical',
    confidence: 86,
    relevanceScore: 82,
    source: 'Big Data Engineering',
    keyTerms: ['real-time processing', 'apache kafka', 'apache spark', 'stream processing', 'big data'],
    jurisdiction: 'Technical',
    caseType: 'Data Engineering',
    tags: ['real-time', 'big data', 'streaming'],
    complexity: 'high'
  },
  {
    id: 'technical-009',
    title: 'Zero Trust Network Security Model',
    summary: 'Implementation of zero trust security architecture with identity verification, micro-segmentation, and continuous monitoring.',
    date: '2023-07-18',
    domain: 'technical',
    confidence: 92,
    relevanceScore: 88,
    source: 'Network Security Journal',
    keyTerms: ['zero trust', 'network security', 'identity verification', 'micro-segmentation', 'security architecture'],
    jurisdiction: 'Technical',
    caseType: 'Network Security',
    tags: ['zero trust', 'network security', 'identity'],
    complexity: 'high'
  },
  {
    id: 'technical-010',
    title: 'Serverless Computing Best Practices',
    summary: 'Design patterns and optimization strategies for serverless applications using AWS Lambda, Azure Functions, and Google Cloud Functions.',
    date: '2023-06-28',
    domain: 'technical',
    confidence: 84,
    relevanceScore: 80,
    source: 'Serverless Architecture',
    keyTerms: ['serverless', 'AWS lambda', 'azure functions', 'cloud functions', 'event-driven architecture'],
    jurisdiction: 'Technical',
    caseType: 'Cloud Computing',
    tags: ['serverless', 'cloud functions', 'event-driven'],
    complexity: 'medium'
  },
  {
    id: 'technical-011',
    title: 'IoT Device Management Platform',
    summary: 'Scalable IoT platform architecture for device provisioning, monitoring, and over-the-air updates with edge computing integration.',
    date: '2023-05-20',
    domain: 'technical',
    confidence: 87,
    relevanceScore: 83,
    source: 'IoT Systems Design',
    keyTerms: ['IoT', 'device management', 'edge computing', 'OTA updates', 'sensor networks'],
    jurisdiction: 'Technical',
    caseType: 'IoT Systems',
    tags: ['IoT', 'edge computing', 'device management'],
    complexity: 'medium'
  },
  {
    id: 'technical-012',
    title: 'Quantum Computing Algorithm Implementation',
    summary: 'Implementation of quantum algorithms for cryptography and optimization problems using Qiskit and quantum simulators.',
    date: '2023-04-14',
    domain: 'technical',
    confidence: 83,
    relevanceScore: 78,
    source: 'Quantum Computing Research',
    keyTerms: ['quantum computing', 'quantum algorithms', 'qiskit', 'cryptography', 'quantum simulation'],
    jurisdiction: 'Technical',
    caseType: 'Quantum Computing',
    tags: ['quantum computing', 'algorithms', 'cryptography'],
    complexity: 'high'
  },
  {
    id: 'technical-013',
    title: 'Distributed Database Sharding Strategy',
    summary: 'Horizontal scaling approach for large-scale databases using consistent hashing and automated shard management.',
    date: '2023-03-22',
    domain: 'technical',
    confidence: 88,
    relevanceScore: 84,
    source: 'Distributed Systems',
    keyTerms: ['database sharding', 'horizontal scaling', 'consistent hashing', 'distributed databases'],
    jurisdiction: 'Technical',
    caseType: 'Database Systems',
    tags: ['database sharding', 'scaling', 'distributed'],
    complexity: 'high'
  },
  {
    id: 'technical-014',
    title: 'Computer Vision Object Detection Pipeline',
    summary: 'End-to-end computer vision pipeline using YOLO, OpenCV, and TensorFlow for real-time object detection and tracking.',
    date: '2023-02-16',
    domain: 'technical',
    confidence: 90,
    relevanceScore: 86,
    source: 'Computer Vision Research',
    keyTerms: ['computer vision', 'object detection', 'YOLO', 'opencv', 'tensorflow', 'image processing'],
    jurisdiction: 'Technical',
    caseType: 'Computer Vision',
    tags: ['computer vision', 'object detection', 'AI'],
    complexity: 'high'
  },
  {
    id: 'technical-015',
    title: 'High-Frequency Trading System Architecture',
    summary: 'Low-latency trading system design with microsecond response times using FPGA acceleration and optimized networking.',
    date: '2023-01-10',
    domain: 'technical',
    confidence: 85,
    relevanceScore: 81,
    source: 'Financial Technology',
    keyTerms: ['high-frequency trading', 'low latency', 'FPGA', 'financial systems', 'algorithmic trading'],
    jurisdiction: 'Technical',
    caseType: 'Financial Technology',
    tags: ['high-frequency trading', 'low latency', 'financial'],
    complexity: 'high'
  }
];

// Domain detection patterns
const DOMAIN_PATTERNS = {
  legal: [
    'court', 'judge', 'jury', 'legal', 'law', 'attorney', 'counsel', 'petition', 'case', 'trial',
    'constitutional', 'rights', 'due process', 'habeas corpus', 'evidence', 'witness', 'testimony',
    'criminal', 'civil', 'defendant', 'plaintiff', 'prosecution', 'defense', 'verdict', 'ruling',
    'jurisdiction', 'statute', 'regulation', 'precedent', 'appeal', 'motion', 'brief', 'hearing'
  ],
  medical: [
    'patient', 'doctor', 'physician', 'medical', 'hospital', 'clinic', 'treatment', 'diagnosis',
    'symptoms', 'disease', 'condition', 'medication', 'prescription', 'therapy', 'surgery',
    'clinical', 'healthcare', 'nursing', 'examination', 'test', 'laboratory', 'radiology',
    'pathology', 'cardiology', 'neurology', 'oncology', 'pediatrics', 'psychiatry', 'emergency',
    'pain', 'fever', 'infection', 'blood pressure', 'heart attack', 'diabetes', 'cancer',
    'pneumonia', 'fracture', 'asthma', 'migraine', 'hypertension', 'kidney disease',
    'mental health', 'depression', 'anxiety', 'chest pain', 'shortness of breath', 'headache',
    'nausea', 'vomiting', 'diarrhea', 'cough', 'fatigue', 'dizziness', 'rash', 'swelling',
    'blood sugar', 'insulin', 'antibiotics', 'chemotherapy', 'radiation', 'biopsy', 'CT scan',
    'MRI', 'X-ray', 'ultrasound', 'ECG', 'EKG', 'blood test', 'urine test', 'vital signs'
  ],
  technical: [
    'system', 'software', 'hardware', 'technology', 'computer', 'network', 'server', 'database',
    'application', 'programming', 'code', 'development', 'architecture', 'infrastructure',
    'security', 'encryption', 'protocol', 'algorithm', 'data', 'analytics', 'cloud', 'API',
    'framework', 'platform', 'deployment', 'monitoring', 'performance', 'scalability', 'integration'
  ]
};

// Named Entity Recognition patterns
const ENTITY_PATTERNS = {
  PERSON: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
  ORG: /\b(?:Inc\.|Corp\.|LLC|Ltd\.|Company|Corporation|University|Hospital|Court|Department)\b/gi,
  DATE: /\b(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi,
  LEGAL_TERM: /\b(?:habeas corpus|due process|constitutional rights|miranda rights|probable cause|search warrant|grand jury|plea bargain|double jeopardy|statute of limitations)\b/gi,
  MEDICAL_TERM: /\b(?:myocardial infarction|diabetes mellitus|hypertension|pneumonia|appendicitis|fracture|surgery|diagnosis|treatment|medication|prescription)\b/gi,
  TECHNICAL_TERM: /\b(?:API|database|server|network|software|hardware|algorithm|encryption|protocol|framework|architecture|deployment)\b/gi,
  MONEY: /\$[\d,]+(?:\.\d{2})?/g,
  LOCATION: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:State|County|City|District|Court))\b/g
};

// Simulate domain detection using keyword analysis
export const detectDomain = (text: string): { domain: string; confidence: number; reasoning: string } => {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  const scores = {
    legal: 0,
    medical: 0,
    technical: 0
  };
  
  // Count domain-specific keywords
  words.forEach(word => {
    if (DOMAIN_PATTERNS.legal.includes(word)) scores.legal++;
    if (DOMAIN_PATTERNS.medical.includes(word)) scores.medical++;
    if (DOMAIN_PATTERNS.technical.includes(word)) scores.technical++;
  });
  
  // Calculate percentages
  const totalWords = words.length;
  const legalPercent = (scores.legal / totalWords) * 100;
  const medicalPercent = (scores.medical / totalWords) * 100;
  const technicalPercent = (scores.technical / totalWords) * 100;
  
  // Determine dominant domain
  let detectedDomain = 'general';
  let confidence = 60;
  let reasoning = 'Document contains general content without strong domain-specific indicators.';
  
  if (legalPercent > medicalPercent && legalPercent > technicalPercent && legalPercent > 2) {
    detectedDomain = 'legal';
    confidence = Math.min(95, 70 + (legalPercent * 5));
    reasoning = `Document contains ${scores.legal} legal terms (${legalPercent.toFixed(1)}% of content), indicating legal domain focus.`;
  } else if (medicalPercent > legalPercent && medicalPercent > technicalPercent && medicalPercent > 2) {
    detectedDomain = 'medical';
    confidence = Math.min(95, 70 + (medicalPercent * 5));
    reasoning = `Document contains ${scores.medical} medical terms (${medicalPercent.toFixed(1)}% of content), indicating medical domain focus.`;
  } else if (technicalPercent > legalPercent && technicalPercent > medicalPercent && technicalPercent > 2) {
    detectedDomain = 'technical';
    confidence = Math.min(95, 70 + (technicalPercent * 5));
    reasoning = `Document contains ${scores.technical} technical terms (${technicalPercent.toFixed(1)}% of content), indicating technical domain focus.`;
  }
  
  return { domain: detectedDomain, confidence, reasoning };
};

// Extract entities using pattern matching
export const extractEntities = (text: string): ExtractedEntity[] => {
  const entities: ExtractedEntity[] = [];
  
  Object.entries(ENTITY_PATTERNS).forEach(([type, pattern]) => {
    const matches = Array.from(text.matchAll(pattern));
    matches.forEach(match => {
      if (match.index !== undefined) {
        entities.push({
          text: match[0],
          type: type as ExtractedEntity['type'],
          confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
    });
  });
  
  // Remove duplicates and sort by position
  const uniqueEntities = entities.filter((entity, index, self) => 
    index === self.findIndex(e => e.text === entity.text && e.type === entity.type)
  ).sort((a, b) => a.startIndex - b.startIndex);
  
  return uniqueEntities.slice(0, 20); // Limit to top 20 entities
};

// Calculate semantic similarity (simplified)
const calculateSimilarity = (text: string, caseData: SimilarCase): number => {
  const textWords = text.toLowerCase().split(/\s+/);
  const caseWords = [...caseData.title.toLowerCase().split(/\s+/), ...caseData.summary.toLowerCase().split(/\s+/), ...caseData.keyTerms.join(' ').toLowerCase().split(/\s+/)];
  
  const commonWords = textWords.filter(word => caseWords.includes(word) && word.length > 3);
  const similarity = (commonWords.length / Math.max(textWords.length, caseWords.length)) * 100;
  
  return Math.min(95, similarity * 2); // Boost similarity and cap at 95%
};

// Find similar cases
export const findSimilarCases = (text: string, domain: string, entities: ExtractedEntity[]): SimilarCase[] => {
  let knowledgeBase: SimilarCase[] = [];
  
  switch (domain) {
    case 'legal':
      knowledgeBase = LEGAL_CASES;
      break;
    case 'medical':
      knowledgeBase = MEDICAL_CASES;
      break;
    case 'technical':
      knowledgeBase = TECHNICAL_CASES;
      break;
    default:
      knowledgeBase = [...LEGAL_CASES, ...MEDICAL_CASES, ...TECHNICAL_CASES];
  }
  
  // Calculate similarity scores
  const scoredCases = knowledgeBase.map(case_ => ({
    ...case_,
    relevanceScore: calculateSimilarity(text, case_)
  }));
  
  // Filter and sort by relevance
  return scoredCases
    .filter(case_ => case_.relevanceScore > 30) // Minimum 30% similarity
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10); // Top 10 matches
};

// Generate AI insights
export const generateInsights = (domain: string, entities: ExtractedEntity[], similarCases: SimilarCase[]): string[] => {
  const insights: string[] = [];
  
  // Domain-specific insights
  if (domain === 'legal') {
    insights.push(`Legal analysis identified ${entities.filter(e => e.type === 'LEGAL_TERM').length} specialized legal terms requiring careful interpretation.`);
    if (similarCases.length > 0) {
      const avgConfidence = similarCases.reduce((sum, case_) => sum + case_.confidence, 0) / similarCases.length;
      insights.push(`Found ${similarCases.length} relevant legal precedents with average confidence of ${avgConfidence.toFixed(1)}%.`);
    }
    insights.push('Constitutional rights and due process considerations should be reviewed by qualified legal counsel.');
  } else if (domain === 'medical') {
    insights.push(`Medical analysis detected ${entities.filter(e => e.type === 'MEDICAL_TERM').length} clinical terms requiring professional medical interpretation.`);
    if (similarCases.length > 0) {
      insights.push(`Identified ${similarCases.length} similar medical cases that may provide relevant clinical context.`);
    }
    insights.push('All medical terminology and recommendations should be validated by licensed healthcare professionals.');
  } else if (domain === 'technical') {
    insights.push(`Technical analysis found ${entities.filter(e => e.type === 'TECHNICAL_TERM').length} specialized technical terms and concepts.`);
    if (similarCases.length > 0) {
      insights.push(`Located ${similarCases.length} comparable technical implementations and best practices.`);
    }
    insights.push('Technical specifications should be reviewed by qualified engineers before implementation.');
  }
  
  // General insights
  if (entities.filter(e => e.type === 'PERSON').length > 0) {
    insights.push(`Document references ${entities.filter(e => e.type === 'PERSON').length} individuals who may be key stakeholders.`);
  }
  
  if (entities.filter(e => e.type === 'ORG').length > 0) {
    insights.push(`${entities.filter(e => e.type === 'ORG').length} organizations mentioned may require additional research or contact.`);
  }
  
  if (similarCases.length === 0) {
    insights.push('No highly similar cases found in current knowledge base. Consider expanding search criteria or consulting domain experts.');
  }
  
  return insights;
};

// Main analysis function
export const analyzeCaseIntelligence = async (
  text: string, 
  domainOverride: 'auto' | 'legal' | 'medical' | 'technical' = 'auto'
): Promise<CaseIntelligenceResult> => {
  const startTime = Date.now();
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Domain detection
  const domainResult = domainOverride === 'auto' 
    ? detectDomain(text) 
    : { domain: domainOverride, confidence: 95, reasoning: `Domain manually specified as ${domainOverride}.` };
  
  // Entity extraction
  const entities = extractEntities(text);
  
  // Find similar cases
  const similarCases = findSimilarCases(text, domainResult.domain, entities);
  
  // Generate insights
  const insights = generateInsights(domainResult.domain, entities, similarCases);
  
  const processingTime = Date.now() - startTime;
  
  const statistics = {
    totalMatches: similarCases.length,
    averageConfidence: similarCases.length > 0 
      ? similarCases.reduce((sum, c) => sum + c.confidence, 0) / similarCases.length 
      : 0
  };
  
  return {
    detectedDomain: domainResult.domain,
    domainConfidence: domainResult.confidence,
    domainReasoning: domainResult.reasoning,
    extractedEntities: entities,
    similarCases,
    insights,
    processingTime,
    statistics
  };
};