// Sample data for the layout stage. Replace with database data later.
// icon: Ionicons name by default, or MaterialCommunityIcons when lib is 'mci'.
export const REVIEWERS = [
  {
    id: '1',
    title: 'Data Structures',
    color: '#6366F1',
    cards: 32,
    done: 80,
    reviewed: 4,
    inProgress: 0,
    summary:
      'This reviewer explores core data structures, including arrays, linked lists, stacks, queues, trees, graphs, and efficient data organization.',
    stats: { questions: 40, words: 2840, flashcards: 32, quizzes: 5 },
    topics: [
      { title: 'Arrays and Linked Lists', concepts: 12, icon: 'format-list-bulleted', lib: 'mci' },
      { title: 'Stacks and Queues', concepts: 10, icon: 'layers-outline' },
      { title: 'Trees and Binary Search Trees', concepts: 14, icon: 'git-branch-outline' },
      { title: 'Graphs and Traversal', concepts: 12, icon: 'vector-polyline', lib: 'mci' },
      { title: 'Hash Tables and Complexity', concepts: 10, icon: 'pound', lib: 'mci' },
    ],
  },
  {
    id: '2',
    title: 'Network Security',
    color: '#F5A84B',
    cards: 24,
    done: 65,
    reviewed: 3,
    inProgress: 1,
    summary:
      'This reviewer covers essential network security concepts, including cyber threats, encryption, access control, firewalls, and secure protocols.',
    stats: { questions: 30, words: 2460, flashcards: 24, quizzes: 4 },
    topics: [
      { title: 'Security Principles and Threats', concepts: 10, icon: 'shield-alert-outline', lib: 'mci' },
      { title: 'Cryptography and Encryption', concepts: 12, icon: 'key-outline' },
      { title: 'Authentication and Access Control', concepts: 8, icon: 'lock-closed-outline' },
      { title: 'Firewalls and Intrusion Detection', concepts: 10, icon: 'shield-checkmark-outline' },
      { title: 'Secure Protocols and VPNs', concepts: 8, icon: 'globe-outline' },
    ],
  },
  {
    id: '3',
    title: 'Philippine History',
    color: '#B75DDB',
    cards: 18,
    done: 42,
    reviewed: 2,
    inProgress: 1,
    summary:
      'This reviewer traces Philippine history from precolonial societies through colonial rule, the revolution, independence, and the modern republic.',
    stats: { questions: 25, words: 3180, flashcards: 18, quizzes: 3 },
    topics: [
      { title: 'Precolonial Philippine Societies', concepts: 8, icon: 'bank-outline', lib: 'mci' },
      { title: 'Spanish Colonial Period', concepts: 12, icon: 'script-text-outline', lib: 'mci' },
      { title: 'Reform Movement and Revolution', concepts: 10, icon: 'flag-outline' },
      { title: 'American Rule and Japanese Occupation', concepts: 10, icon: 'book-outline' },
      { title: 'Independence and the Modern Republic', concepts: 8, icon: 'business-outline' },
    ],
  },
  {
    id: '4',
    title: 'Computer Networks',
    color: '#4F7CF5',
    cards: 150,
    done: 60,
    reviewed: 3,
    inProgress: 0,
    extra: '6 quizzes available',
    summary:
      'This reviewer covers the fundamental concepts of computer networks, including network models, topologies, protocols, and IP addressing.',
    stats: { questions: 120, words: 5320, flashcards: 150, quizzes: 8 },
    topics: [
      { title: 'Introduction to Networking', concepts: 12, icon: 'git-network-outline' },
      { title: 'Network Models (OSI & TCP/IP)', concepts: 18, icon: 'layers-outline' },
      { title: 'Network Topologies', concepts: 10, icon: 'share-social-outline' },
      { title: 'Communication Protocols', concepts: 14, icon: 'radio-outline' },
      { title: 'IP Addressing and Subnetting', concepts: 20, icon: 'code-slash-outline' },
    ],
  },
];

// Sample flashcards per reviewer id. chapter = index into reviewer.topics.
export const FLASHCARDS = {
  '1': [
    { chapter: 1, q: 'What is a stack?', a: 'A LIFO structure where the last item added is the first one removed.' },
    { chapter: 0, q: 'What is a linked list?', a: 'A sequence of nodes where each node points to the next one.' },
    { chapter: 2, q: 'What is a binary search tree?', a: 'A tree where left children are smaller and right children are larger than their parent.' },
    { chapter: 4, q: 'What is a hash table?', a: 'A structure that maps keys to values using a hash function.' },
  ],
  '2': [
    { chapter: 0, q: 'What is the CIA triad?', a: 'Confidentiality, Integrity, and Availability.' },
    { chapter: 1, q: 'What is encryption?', a: 'Converting data into an unreadable form so only authorized parties can read it.' },
    { chapter: 2, q: 'What is multi-factor authentication?', a: 'Verifying identity with two or more independent factors.' },
    { chapter: 3, q: 'What does a firewall do?', a: 'It filters network traffic based on security rules.' },
  ],
  '3': [
    { chapter: 0, q: 'What was a barangay?', a: 'The basic pre-colonial community unit, led by a datu.' },
    { chapter: 2, q: 'Who founded the Katipunan in 1892?', a: 'Andrés Bonifacio and fellow revolutionaries.' },
    { chapter: 2, q: 'When was independence from Spain declared?', a: 'June 12, 1898, in Kawit, Cavite.' },
    { chapter: 3, q: 'What did the Treaty of Paris (1898) do?', a: 'Spain ceded the Philippines to the United States.' },
  ],
  '4': [
    { chapter: 0, q: 'What is a computer network?', a: 'A group of interconnected devices that share data and resources.' },
    { chapter: 0, q: 'What does LAN stand for?', a: 'Local Area Network, a network covering a small area like a home or school.' },
    { chapter: 1, q: 'Which OSI layer handles routing?', a: 'The Network layer (Layer 3).' },
    { chapter: 3, q: 'What is a protocol?', a: 'A set of rules that defines how devices communicate.' },
    { chapter: 4, q: 'What does an IP address identify?', a: "A device's logical address on a network." },
  ],
};

// Sample quizzes per reviewer id. answer = index of the correct option.
export const QUIZZES = {
  '1': {
    of: 5, title: 'Core structures',
    questions: [
      { topic: 'STACKS AND QUEUES', text: 'Which principle does a stack follow?', options: ['FIFO', 'LIFO', 'Random access', 'Priority order'], answer: 1, explanation: 'A stack is Last In, First Out: the most recent item is removed first.' },
      { topic: 'TREES', text: 'What is the average search time in a balanced binary search tree?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explanation: 'Each comparison halves the remaining nodes, giving O(log n).' },
      { topic: 'HASH TABLES', text: 'What do hash tables use to find where a value is stored?', options: ['A sorted index', 'A hash function', 'A linked list only', 'A stack'], answer: 1, explanation: 'A hash function converts the key into an array index.' },
    ],
  },
  '2': {
    of: 4, title: 'Security basics',
    questions: [
      { topic: 'SECURITY PRINCIPLES', text: 'What does the "A" in the CIA triad stand for?', options: ['Authentication', 'Authorization', 'Availability', 'Auditing'], answer: 2, explanation: 'CIA stands for Confidentiality, Integrity, and Availability.' },
      { topic: 'CRYPTOGRAPHY', text: 'Which type of encryption uses the same key to encrypt and decrypt?', options: ['Symmetric', 'Asymmetric', 'Hashing', 'Digital signature'], answer: 0, explanation: 'Symmetric encryption uses one shared secret key.' },
      { topic: 'FIREWALLS', text: 'What does a firewall primarily do?', options: ['Speeds up the network', 'Filters traffic by rules', 'Stores passwords', 'Backs up data'], answer: 1, explanation: 'Firewalls allow or block traffic based on security rules.' },
    ],
  },
  '3': {
    of: 3, title: 'Key events',
    questions: [
      { topic: 'PRECOLONIAL SOCIETIES', text: 'Who led a barangay in pre-colonial times?', options: ['A governor', 'A datu', 'A priest', 'A mayor'], answer: 1, explanation: 'A barangay was headed by a datu.' },
      { topic: 'REVOLUTION', text: 'When was Philippine independence declared in Kawit, Cavite?', options: ['June 12, 1898', 'July 4, 1946', 'August 26, 1896', 'December 30, 1896'], answer: 0, explanation: 'Independence was proclaimed on June 12, 1898.' },
      { topic: 'AMERICAN RULE', text: 'Which treaty ceded the Philippines to the United States?', options: ['Treaty of Manila', 'Treaty of Paris', 'Treaty of Tordesillas', 'Treaty of Versailles'], answer: 1, explanation: 'The 1898 Treaty of Paris ended the Spanish-American War.' },
    ],
  },
  '4': {
    of: 6, title: 'Network fundamentals',
    questions: [
      { topic: 'NETWORK MODELS', text: 'Which OSI layer is responsible for routing packets between networks?', options: ['Data Link layer', 'Network layer', 'Transport layer', 'Application layer'], answer: 1, explanation: 'The Network layer (Layer 3) handles logical addressing and routing between networks.' },
      { topic: 'NETWORK TOPOLOGIES', text: 'Which topology connects every device to a central switch or hub?', options: ['Bus', 'Star', 'Ring', 'Mesh'], answer: 1, explanation: 'In a star topology, each device has its own link to a central switch or hub.' },
      { topic: 'PROTOCOLS', text: 'Which protocol is used to load web pages securely?', options: ['FTP', 'SMTP', 'HTTPS', 'DNS'], answer: 2, explanation: 'HTTPS encrypts web traffic using TLS.' },
      { topic: 'IP ADDRESSING', text: 'How many bits are in an IPv4 address?', options: ['16', '32', '64', '128'], answer: 1, explanation: 'IPv4 addresses are 32 bits, usually written as four decimal numbers.' },
      { topic: 'INTRODUCTION', text: 'Which network type covers a city-wide area?', options: ['LAN', 'PAN', 'MAN', 'WAN'], answer: 2, explanation: 'A Metropolitan Area Network (MAN) spans a city or large campus.' },
    ],
  },
};
