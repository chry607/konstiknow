import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'constitution-principles',
    title: 'Philippine Principles',
    description: 'Understanding the core principles of the Philippine Constitution',
    icon: '📜',
    completed: false,
    locked: false,
    stars: 0,
    maxStars: 3,
    questions: [
      {
        id: 'q1',
        question: 'Sovereignty resides in the ______.',
        options: ['President', 'Congress', 'people', 'judiciary'],
        correctAnswer: 2,
        explanation: 'The Constitution declares that the Philippines is a democratic and republican State, and sovereignty resides in the people, from whom all government authority emanates. Article II, Section 1'
      },
      {
        id: 'q2',
        question: 'The Philippines renounces war as an instrument of ______.',
        options: ['taxation', 'national policy', 'legislation', 'commerce'],
        correctAnswer: 1,
        explanation: 'The Constitution adopts the renunciation of war as an instrument of national policy, while adhering to international law and peaceful relations among nations. Article II, Section 2'
      },
      {
        id: 'q3',
        question: 'Civilian authority is, at all times, supreme over the ______.',
        options: ['police power', 'military', 'judiciary', 'electorate'],
        correctAnswer: 1,
        explanation: 'The Constitution clearly states that civilian authority is always supreme over the military, and the Armed Forces is the protector of the people and the State. Article II, Section 3'
      },
      {
        id: 'q4',
        question: 'The separation of Church and State shall be ______.',
        options: ['flexible', 'inviolable', 'temporary', 'conditional'],
        correctAnswer: 1,
        explanation: 'The Constitution expressly provides that the separation of Church and State must remain inviolable, preserving religious liberty and preventing state establishment of religion. Article II, Section 6'
      },
      {
        id: 'q5',
        question: 'The Philippines adopts the generally accepted principles of ______ as part of the law of the land.',
        options: ['civil procedure', 'taxation', 'international law', 'local ordinance'],
        correctAnswer: 2,
        explanation: 'The Constitution incorporates generally accepted principles of international law into Philippine law and commits the State to peace, equality, justice, freedom, cooperation, and amity with all nations. Article II, Section 2'
      },
      {
        id: 'q6',
        question: 'The State values the dignity of every human person and guarantees full respect for ______.',
        options: ['property rights only', 'human rights', 'voting rights only', 'contractual rights only'],
        correctAnswer: 1,
        explanation: 'The Constitution emphasizes the worth of every human person and commands the State to guarantee full respect for human rights. Article II, Section 11'
      },
      {
        id: 'q7',
        question: 'The State recognizes the sanctity of ______ and shall protect and strengthen the family as a basic autonomous social institution.',
        options: ['public office', 'family life', 'private contracts', 'foreign relations'],
        correctAnswer: 1,
        explanation: 'The Constitution gives special protection to family life and recognizes the family as a basic autonomous social institution that the State must strengthen. Article II, Section 12'
      },
      {
        id: 'q8',
        question: 'The State recognizes the vital role of the youth in ______.',
        options: ['taxation', 'nation-building', 'judicial review', 'foreign trade'],
        correctAnswer: 1,
        explanation: 'The Constitution directs the State to recognize the youth\'s role in nation-building and to promote and protect their physical, moral, spiritual, intellectual, and social well-being. Article II, Section 13'
      },
      {
        id: 'q9',
        question: 'Public office is a public ______.',
        options: ['privilege', 'trust', 'reward', 'inheritance'],
        correctAnswer: 1,
        explanation: 'The Constitution teaches that public officials and employees must at all times be accountable to the people and serve them with responsibility, integrity, loyalty, and efficiency. Article XI, Section 1'
      },
      {
        id: 'q10',
        question: 'The State shall ensure the autonomy of ______.',
        options: ['all private corporations', 'local governments', 'foreign embassies', 'political parties'],
        correctAnswer: 1,
        explanation: 'The Constitution provides that the State must ensure local autonomy so local governments can govern more effectively within the framework of law. Article II, Section 25'
      }
    ]
  },
  {
    id: 'bill-of-rights',
    title: 'Our Rights',
    description: 'Master the fundamental rights and freedoms guaranteed by the Constitution',
    icon: '⚖️',
    completed: false,
    locked: true,
    stars: 0,
    maxStars: 3,
    questions: [
      {
        id: 'q11',
        question: 'No person shall be deprived of life, liberty, or property without _____, nor shall any person be denied the equal protection of the laws.',
        options: ['a warrant of arrest', 'due process of law', 'a public trial', 'written consent'],
        correctAnswer: 1,
        explanation: 'The state cannot arbitrarily take away a person\'s right to life, liberty, or property. The "due process of law" guarantees fundamental fairness, meaning that proper legal procedures must be followed. Article III, Section 1'
      },
      {
        id: 'q12',
        question: 'Who has the authority to issue a search warrant or warrant of arrest after personally determining probable cause?',
        options: ['the President', 'the prosecutor', 'the Chief of Police', 'the judge'],
        correctAnswer: 3,
        explanation: 'To protect citizens from unreasonable searches and arrests, the Constitution requires a neutral magistrate to personally examine the evidence if there is probable cause before issuing a warrant. The Constitution states that only a judge can do so. Article III, Section 2'
      },
      {
        id: 'q13',
        question: 'Which of the following is NOT explicitly protected under the freedom of expression provision in Article III, Section 4?',
        options: ['right to peaceably assemble', 'right to bear arms', 'freedom of speech', 'freedom of the press'],
        correctAnswer: 1,
        explanation: 'The Philippine Constitution, under this section, only specifically safeguards the freedom of speech, of expression, or of the press, or the right of the people peaceably to assemble and petition the Government for redress of grievances. Article III, Section 4'
      },
      {
        id: 'q14',
        question: 'Which of the following can a citizen exercise without undergoing a religious test?',
        options: ['property ownership', 'right to travel', 'business transactions', 'civil or political rights'],
        correctAnswer: 3,
        explanation: 'To uphold the separation of Church and State and guarantee the free exercise of religion, the Constitution guarantees that a person\'s religious beliefs (or lack thereof) can never be used as a prerequisite to exercise their civil and political rights. Article III, Section 5'
      },
      {
        id: 'q15',
        question: 'Private property shall not be taken for public use without ____.',
        options: ['a public hearing', 'presidential approval', 'just compensation', 'prior written notice'],
        correctAnswer: 2,
        explanation: 'Under the state\'s inherent power, the government has the authority to expropriate private property for public use (like building a road or hospital). However, the Constitution mandates that the state must pay the property owner "just compensation", which is the full and fair market equivalent of the property taken. Article III, Section 9'
      },
      {
        id: 'q16',
        question: 'The right of the people to information on matters of public concern shall be recognized. Access to official records shall be afforded the citizen, subject to such limitations as may be provided by ____.',
        options: ['law', 'the President', 'the Supreme Court', 'the agency head'],
        correctAnswer: 0,
        explanation: 'The Constitution adheres to the principle of transparency giving the public the right to access government transactions and records; however, this is not absolute, and is subject to limitations provided by law (it is up to Congress to decide on specific exceptions). Article III, Section 7'
      },
      {
        id: 'q17',
        question: 'Any person under investigation for the commission of an offense shall have the right to be informed of his right to remain silent and to have competent and independent counsel preferably of his own choice. If the person cannot afford the services of counsel, he must be provided with one. These rights cannot be waived except in which situation?',
        options: ['in writing and in presence of counsel', 'if the crime is a heinous offense', 'by signing a confession', 'none, these rights cannot be waived'],
        correctAnswer: 0,
        explanation: 'The Philippine Constitution outlines the fundamental rights of a person under custodial investigation to prevent police coercion and abuse. To ensure that these rights are truly protected, it is strictly required that any waiver of these rights must be put in writing and with a lawyer present. Article III, Section 12 (1)'
      },
      {
        id: 'q18',
        question: 'The liberty of abode and of changing the same within the limits prescribed by law shall not be impaired except upon which case?',
        options: ['suspicion of a crime', 'order of the local mayor', 'lawful order of the court', 'a national state of emergency'],
        correctAnswer: 2,
        explanation: 'The liberty of abode protects a person\'s right to choose where to live and travel; this is highly protected to prevent arbitrary relocations or forced evictions by the government. It can only be restricted by a formal, lawful order from the court. Article III, Section 6'
      },
      {
        id: 'q19',
        question: 'The privacy of communication and correspondence shall be inviolable except upon lawful order of the court, or when ____requires otherwise as prescribed by law.',
        options: ['public safety or order', 'national economic security', 'a police investigation', 'martial law'],
        correctAnswer: 0,
        explanation: 'The privacy of personal communication is strictly protected, and the state can only intrude upon these if they either secure a lawful order or if the legislature has passed a specific law stating that "public safety or order" necessitates it. Article III, Section 3 (1)'
      },
      {
        id: 'q20',
        question: 'No person shall be compelled to be a witness against himself. This is commonly known as the right against ____.',
        options: ['unlawful arrest', 'involuntary servitude', 'double jeopardy', 'self-incrimination'],
        correctAnswer: 3,
        explanation: 'The right against self-incrimination allows an individual to refuse to answer questions or give testimony that could expose them to criminal prosecution. This ensures that the burden of proof remains entirely on the government without forcing the accused to assist in their own conviction. Article III, Section 17'
      }
    ]
  },
  {
    id: 'government-branches',
    title: 'Government Branches',
    description: 'Understand the powers and structure of the three branches of government',
    icon: '🏛️',
    completed: false,
    locked: true,
    stars: 0,
    maxStars: 3,
    questions: [
      {
        id: 'q21',
        question: 'Which branch of government is primarily tasked with the power to create, amend, and repeal laws?',
        options: ['Executive Branch', 'Judicial Branch', 'Legislative Branch', 'Constitutional Commission'],
        correctAnswer: 2,
        explanation: 'The legislative power is vested in the Congress of the Philippines, which consists of the Senate and the House of Representatives. Article VI, Section 1'
      },
      {
        id: 'q22',
        question: 'Who serves as the Commander-in-Chief of all armed forces of the Philippines?',
        options: ['The Chief Justice', 'The Senate President', 'The President', 'The Secretary of National Defense'],
        correctAnswer: 2,
        explanation: 'As the head of the Executive branch, the President exercises control over all executive departments and serves as the Commander-in-Chief. Article VII, Section 18'
      },
      {
        id: 'q23',
        question: 'Which body has the "sole power to try and decide all cases of impeachment"?',
        options: ['The Supreme Court', 'The Senate', 'The House of Representatives', 'The Sandiganbayan'],
        correctAnswer: 1,
        explanation: 'While the House of Representatives has the exclusive power to initiate impeachment cases, the Senate acts as the court for impeachment trials. Article VI, Section 21'
      },
      {
        id: 'q24',
        question: 'How many Associate Justices serve in the Supreme Court of the Philippines, excluding the Chief Justice?',
        options: ['12', '14', '15', '10'],
        correctAnswer: 1,
        explanation: 'The Supreme Court is composed of a Chief Justice and fourteen Associate Justices, totaling 15 members. Article VIII, Section 4'
      },
      {
        id: 'q25',
        question: 'This power allows the President to refuse to sign a bill passed by Congress, preventing it from becoming a law unless overridden.',
        options: ['Pardon', 'Veto', 'Amnesty', 'Impeachment'],
        correctAnswer: 1,
        explanation: 'Every bill passed by Congress must be presented to the President. If he does not approve, he vetoes it and returns it to the House where it originated. Article VI, Section 27'
      },
      {
        id: 'q26',
        question: 'The Supreme Court has the power of "Judicial Review," which allows them to declare a law or treaty unconstitutional.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Judicial power includes the duty to settle actual controversies and determine whether there has been a grave abuse of discretion or if an act is unconstitutional. Article VIII, Section 1'
      },
      {
        id: 'q27',
        question: 'Which of the following is NOT a qualification to be appointed as a Member of the Supreme Court?',
        options: ['Natural-born citizen', 'At least 40 years of age', 'At least 15 years of practice as a judge or lawyer', 'A former member of Congress'],
        correctAnswer: 3,
        explanation: 'While many are, it is not a constitutional requirement. The actual requirements focus on age, citizenship, and legal experience. Article VIII, Section 7'
      },
      {
        id: 'q28',
        question: 'What is the minimum age requirement to be elected as a member of the Senate?',
        options: ['25 years old', '30 years old', '35 years old', '40 years old'],
        correctAnswer: 2,
        explanation: 'A Senator must be a natural-born citizen, at least 35 on election day, able to read and write, a registered voter, and a resident for at least 2 years. Article VI, Section 3'
      },
      {
        id: 'q29',
        question: 'This principle ensures that no single branch of government becomes too powerful by allowing branches to limit each other\'s powers.',
        options: ['Separation of Powers', 'Checks and Balances', 'Martial Law', 'Parliamentary Sovereignty'],
        correctAnswer: 1,
        explanation: 'This system allows, for example, the Judiciary to check the Legislature via judicial review, or the Executive to check the Legislature via veto.'
      },
      {
        id: 'q30',
        question: 'If both the President and the Vice President are unable to serve (due to death or disability), who is next in the line of succession?',
        options: ['Speaker of the House', 'Chief Justice', 'Senate President', 'Secretary of Foreign Affairs'],
        correctAnswer: 2,
        explanation: 'In case of death, permanent disability, removal from office, or resignation of both, the President of the Senate shall act as President. Article VII, Section 8'
      }
    ]
  },
  {
    id: 'elections-voting',
    title: 'Elections - Voters Rights and Mechanics',
    description: 'Learn about voting rights, election mechanics, and qualifications for office',
    icon: '🗳️',
    completed: false,
    locked: true,
    stars: 0,
    maxStars: 3,
    questions: [
      {
        id: 'q31',
        question: 'According to the Constitution, literacy, property, or wealth are required in order for someone to vote?',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'Voting is a right that may be exercised by all citizens of the Philippines, regardless of their literacy, ownership of property, or social status. Article V, Section 1, 1987 Philippine Constitution'
      },
      {
        id: 'q32',
        question: 'What is the minimum age to vote in the Philippines?',
        options: ['21 Years Old', '16 Years Old', '18 Years Old', '17 Years old'],
        correctAnswer: 2,
        explanation: 'Filipinos at least eighteen years old can vote. Article V, Section 1, 1987 Philippine Constitution'
      },
      {
        id: 'q33',
        question: 'Which of the following choices is not a requirement to be able to run for president in the Philippines?',
        options: ['Natural-Born Citizen of the Philippines', 'Able to read and write', 'At least 40 years of age', 'A college graduate'],
        correctAnswer: 3,
        explanation: 'Being a college graduate is not a requirement to be the President of the Philippines. The following are the qualifications required for one to become a president: Natural-born citizen of the Philippines, Registered voter, Able to read and write, At least 40 years of age on election day, A resident of the Philippines for at least ten years. Article VII Section 2, 1987 Philippine Constitution'
      },
      {
        id: 'q34',
        question: 'What is the purpose of the party-list system in elections?',
        options: ['To elect the President', 'To represent marginalized sectors in Congress', 'To manage elections', 'To replace the Senate'],
        correctAnswer: 1,
        explanation: 'Party-lists have pambato that gets voted into the House of Representatives.'
      },
      {
        id: 'q35',
        question: 'How many consecutive terms may a Senator serve in office?',
        options: ['2 terms', '1 term', '3 terms', 'Senators are not allowed to have consecutive terms'],
        correctAnswer: 0,
        explanation: 'No senator shall serve more than 2 consecutive terms. Article VI Section 4, 1987 Philippine Constitution'
      },
      {
        id: 'q36',
        question: 'How long is a single term of office for the President, Vice President and Senators?',
        options: ['3 Years', '6 Years', '4 Years', '5 Years'],
        correctAnswer: 1,
        explanation: 'All public officials, which include the President, Vice President, and Senators serve for six years in a single term. Article VI Section 4, Article VII Section 4, 1987 Philippine Constitution'
      },
      {
        id: 'q37',
        question: 'How many consecutive terms may a Member of the House of Representatives serve?',
        options: ['2 terms', '1 term', '3 terms', 'A member of the House of Representatives are not allowed to have consecutive terms'],
        correctAnswer: 2,
        explanation: 'A member of the House of Representatives serves 3-year terms and can hold their position for 3 consecutive terms. Article VI, Section 7, 1987 Philippine Constitution'
      },
      {
        id: 'q38',
        question: 'What is the duty of the Commission on Elections Chairman and Commissioners on Elections?',
        options: ['Create laws', 'Supervise and enforce election laws', 'Appoint the President', 'Control the military'],
        correctAnswer: 1,
        explanation: 'The Chairman and Commissioners must maintain an impartial and objective approach in enforcing laws related to the election of public officials. Article IX-C, Section 2, 1987 Philippine Constitution'
      },
      {
        id: 'q39',
        question: 'Which government body is responsible for supervising elections and ensuring they are free, orderly, honest, and credible?',
        options: ['Supreme Court', 'Congress', 'Commission on Elections', 'President'],
        correctAnswer: 2,
        explanation: 'The Commission on Elections, also known as COMELEC, is an independent constitutional body responsible for elections. Article IX-C, Section 2, 1987 Philippine Constitution'
      },
      {
        id: 'q40',
        question: 'What percentage of seats in the House of Representatives is reserved for party-list representatives?',
        options: ['10%', '15%', '20%', '30%'],
        correctAnswer: 2,
        explanation: 'Party-list representatives make up 20% or 64 out of the total 318 members of the House of Representatives, which includes those under the party-list system. Article VI, Section 5(2), 1987 Philippine Constitution'
      }
    ]
  },
  {
    id: 'social-justice',
    title: 'Social Justice',
    description: 'Explore the Constitution\'s provisions on social justice and workers\' rights',
    icon: '✊',
    completed: false,
    locked: true,
    stars: 0,
    maxStars: 3,
    questions: [
      {
        id: 'q41',
        question: 'Under Article XIII, Section 1, Congress shall give highest priority to measures that primarily aim to:',
        options: ['Increase military spending', 'Protect human dignity and reduce social, economic, and political inequalities', 'Expand foreign trade incentives', 'Centralize all political power in Congress'],
        correctAnswer: 1,
        explanation: 'Congress must prioritize measures that protect and enhance human dignity, reduce inequalities, and remove cultural inequities by diffusing wealth and political power for the common good. Article XIII, Section 1'
      },
      {
        id: 'q42',
        question: 'The promotion of social justice shall include the commitment to create economic opportunities based on freedom of initiative and ______.',
        options: ['foreign intervention', 'self-reliance', 'monopoly control', 'military supervision'],
        correctAnswer: 1,
        explanation: 'The Constitution states that social justice includes creating economic opportunities based on freedom of initiative and self-reliance. Article XIII, Section 2'
      },
      {
        id: 'q43',
        question: 'Which workers are covered by the State\'s duty to afford full protection to labor?',
        options: ['only union members', 'only local workers', 'only overseas workers', 'local and overseas, organized and unorganized workers'],
        correctAnswer: 3,
        explanation: 'Protection of labor extends to local and overseas, organized and unorganized workers. Article XIII, Section 3'
      },
      {
        id: 'q44',
        question: 'Which of the following is expressly guaranteed to workers under the Constitution?',
        options: ['right to inherit public office', 'right to strike in accordance with law', 'right to avoid taxation', 'right to fixed profits'],
        correctAnswer: 1,
        explanation: 'Workers are guaranteed rights such as self-organization, collective bargaining, security of tenure, humane working conditions, living wage, and the right to strike in accordance with law. Article XIII, Section 3'
      },
      {
        id: 'q45',
        question: 'Agrarian reform shall be founded on the right of farmers and regular farmworkers who are landless to own directly or collectively the lands they ______.',
        options: ['inherit', 'inspect', 'till', 'mortgage'],
        correctAnswer: 2,
        explanation: 'Agrarian reform is based on the right of landless farmers and regular farmworkers to own directly or collectively the lands they till. Article XIII, Section 4'
      },
      {
        id: 'q46',
        question: 'Under the Constitution, the State shall protect the rights of subsistence fishermen to the preferential use of:',
        options: ['airport facilities', 'communal marine and fishing resources', 'all private fishponds', 'reclaimed commercial ports'],
        correctAnswer: 1,
        explanation: 'The Constitution protects subsistence fishermen, especially local communities, in the preferential use of communal marine and fishing resources. Article XIII, Section 7'
      },
      {
        id: 'q47',
        question: 'Urban or rural poor dwellers shall not be evicted nor their dwellings demolished except:',
        options: ['by mere verbal order of an official', 'in accordance with law and in a just and humane manner', 'upon demand of any private claimant', 'after publication in a newspaper only'],
        correctAnswer: 1,
        explanation: 'Eviction and demolition are allowed only in accordance with law and in a just and humane manner. Article XIII, Section 10'
      },
      {
        id: 'q48',
        question: 'The State shall endeavor to provide free medical care to ______.',
        options: ['tourists', 'government officers', 'paupers', 'all voters'],
        correctAnswer: 2,
        explanation: 'The Constitution directs the State to make essential health services available and to endeavor to provide free medical care to paupers. Article XIII, Section 11'
      },
      {
        id: 'q49',
        question: 'Which constitutional protection is specifically granted to working women?',
        options: ['exemption from labor law coverage', 'guaranteed government office', 'safe and healthful working conditions, taking into account maternal functions', 'automatic retirement benefits regardless of service'],
        correctAnswer: 2,
        explanation: 'The Constitution protects working women by providing safe and healthful working conditions, considering their maternal functions. Article XIII, Section 14'
      },
      {
        id: 'q50',
        question: 'The Commission on Human Rights may investigate all forms of human rights violations involving:',
        options: ['customs duties only', 'civil and political rights', 'private contract disputes only', 'corporate profits'],
        correctAnswer: 1,
        explanation: 'The CHR is empowered to investigate human rights violations involving civil and political rights. Article XIII, Section 18'
      }
    ]
  }
];
