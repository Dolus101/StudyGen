// Sample notes per reviewer id. One entry per topic (same order as reviewer.topics).
// diagrams[].nodes = [leftNode, centerNode, rightNode], each [ioniconsName, label].
export const NOTES = {
  // Data Structures
  '1': [
    {
      points: [
        'An array stores elements in contiguous memory, giving fast access by index.',
        'A linked list stores nodes that each point to the next node, making insertion and deletion easy.',
        'Arrays have a fixed size, while linked lists can grow and shrink as needed.',
        'Searching either structure without ordering takes O(n) time.',
      ],
      term: { label: 'ARRAY', text: 'A collection of elements stored in contiguous memory and accessed by index.' },
      diagrams: [{ title: 'Linked List', nodes: [['play-outline', 'Head'], ['ellipse-outline', 'Node'], ['close-circle-outline', 'Null']] }],
    },
    {
      points: [
        'A stack follows Last In, First Out (LIFO): push adds and pop removes the top item.',
        'A queue follows First In, First Out (FIFO): enqueue adds at the back and dequeue removes from the front.',
        'Stacks power undo features and function calls, while queues manage scheduling and buffering.',
        'A deque lets you add or remove items at both ends.',
      ],
      term: { label: 'STACK', text: 'A LIFO structure where only the top element can be added or removed.' },
      diagrams: [{ title: 'Stack vs Queue', nodes: [['layers-outline', 'Stack'], ['swap-horizontal-outline', 'LIFO / FIFO'], ['reorder-three-outline', 'Queue']] }],
    },
    {
      points: [
        'A tree is a hierarchy of nodes with a single root and no cycles.',
        'In a binary search tree, left children are smaller and right children are larger than the parent.',
        'In-order traversal of a binary search tree visits values in sorted order.',
        'A balanced binary search tree gives O(log n) search, insert, and delete.',
      ],
      term: { label: 'BST', text: "A binary tree where each node's left subtree holds smaller values and its right subtree larger values." },
      diagrams: [{ title: 'Binary Search Tree', nodes: [['chevron-back-circle-outline', 'Left child'], ['radio-button-on-outline', 'Root'], ['chevron-forward-circle-outline', 'Right child']] }],
    },
    {
      points: [
        'A graph is a set of vertices connected by edges, which may be directed or weighted.',
        'Breadth-first search explores level by level using a queue.',
        'Depth-first search goes as deep as possible first using a stack or recursion.',
        'Graphs are often stored as adjacency lists or adjacency matrices.',
      ],
      term: { label: 'GRAPH', text: 'A set of vertices connected by edges.' },
      diagrams: [{ title: 'BFS vs DFS', nodes: [['layers-outline', 'BFS'], ['share-social-outline', 'Graph'], ['arrow-down-outline', 'DFS']] }],
    },
    {
      points: [
        'A hash table maps keys to values by using a hash function to find an index.',
        'Collisions happen when two keys hash to the same index and are handled by chaining or open addressing.',
        'Average lookup, insert, and delete are O(1) in a well-sized hash table.',
        'Big O notation describes how running time grows as the input size increases.',
      ],
      term: { label: 'BIG O', text: "A notation describing how an algorithm's cost grows with input size." },
      diagrams: [{ title: 'Hashing', nodes: [['key-outline', 'Key'], ['calculator-outline', 'Hash function'], ['list-outline', 'Index']] }],
    },
  ],

  // Network Security
  '2': [
    {
      points: [
        'The CIA triad covers confidentiality, integrity, and availability.',
        'Common threats include malware, phishing, denial-of-service attacks, and man-in-the-middle attacks.',
        'Defense in depth uses several layers of protection instead of relying on one control.',
        'The principle of least privilege gives users only the access they need.',
      ],
      term: { label: 'CIA TRIAD', text: 'Confidentiality, Integrity, and Availability: the core goals of security.' },
      diagrams: [{ title: 'CIA Triad', nodes: [['eye-off-outline', 'Confidentiality'], ['checkmark-done-outline', 'Integrity'], ['pulse-outline', 'Availability']] }],
    },
    {
      points: [
        'Encryption turns readable data into ciphertext that only authorized parties can decrypt.',
        'Symmetric encryption uses one shared key, while asymmetric encryption uses a public and private key pair.',
        'Hash functions create a fixed-size fingerprint used to check integrity.',
        'Digital signatures prove who sent a message and that it was not altered.',
      ],
      term: { label: 'CIPHERTEXT', text: 'Data that has been encrypted and is unreadable without the key.' },
      diagrams: [{ title: 'Encryption Flow', nodes: [['document-text-outline', 'Plaintext'], ['key-outline', 'Encrypt'], ['lock-closed-outline', 'Ciphertext']] }],
    },
    {
      points: [
        'Authentication verifies who you are, while authorization decides what you can do.',
        'Multi-factor authentication combines something you know, something you have, and something you are.',
        'Role-based access control assigns permissions by job role.',
        'Strong passwords and password managers reduce the risk of stolen credentials.',
      ],
      term: { label: 'MFA', text: 'Using two or more independent factors to verify identity.' },
      diagrams: [{ title: 'Multi-factor Login', nodes: [['key-outline', 'Password'], ['shield-checkmark-outline', 'Verify'], ['log-in-outline', 'Access']] }],
    },
    {
      points: [
        'A firewall filters traffic between networks based on security rules.',
        'Stateful firewalls track connections, while packet filters check each packet alone.',
        'An intrusion detection system (IDS) monitors traffic and raises alerts.',
        'An intrusion prevention system (IPS) can also block suspicious traffic.',
      ],
      term: { label: 'FIREWALL', text: 'A device or software that allows or blocks traffic based on rules.' },
      diagrams: [{ title: 'Firewall Placement', nodes: [['globe-outline', 'Internet'], ['flame-outline', 'Firewall'], ['business-outline', 'Internal network']] }],
    },
    {
      points: [
        'TLS secures web traffic, which is why HTTPS replaced HTTP for most sites.',
        'SSH provides encrypted remote login and replaced Telnet.',
        'A VPN creates an encrypted tunnel across an untrusted network such as the internet.',
        'IPsec and WireGuard are common VPN technologies.',
      ],
      term: { label: 'VPN', text: 'An encrypted tunnel that protects traffic over an untrusted network.' },
      diagrams: [{ title: 'VPN Tunnel', nodes: [['phone-portrait-outline', 'Device'], ['lock-closed-outline', 'Encrypted tunnel'], ['server-outline', 'Private network']] }],
    },
  ],

  // Philippine History
  '3': [
    {
      points: [
        'Early Filipinos lived in barangays, small communities led by a datu.',
        'Society was commonly divided into the nobility, freemen, and dependents.',
        'Trade with China, India, and Southeast Asia shaped early culture and the economy.',
        'Baybayin was an early writing system used before the Spanish arrived.',
      ],
      term: { label: 'BARANGAY', text: 'The basic pre-colonial community unit, led by a datu.' },
      diagrams: [{ title: 'Barangay Structure', nodes: [['person-outline', 'Datu'], ['home-outline', 'Barangay'], ['people-outline', 'Community']] }],
    },
    {
      points: [
        'Spain began colonizing in 1565 with the expedition of Miguel López de Legazpi.',
        'The encomienda system let Spaniards collect tribute from local communities.',
        'The Manila–Acapulco galleon trade connected the Philippines to Mexico and the wider world.',
        'Catholicism spread widely through missionary work and parish life.',
      ],
      term: { label: 'ENCOMIENDA', text: 'A system granting Spanish colonists the right to collect tribute from natives.' },
      diagrams: [{ title: 'Galleon Trade', nodes: [['boat-outline', 'Manila'], ['navigate-outline', 'Pacific route'], ['location-outline', 'Acapulco']] }],
    },
    {
      points: [
        'The Propaganda Movement pushed for reforms through writings by Rizal, del Pilar, and others.',
        'Andrés Bonifacio founded the Katipunan in 1892 to seek independence.',
        'The Revolution began in August 1896 and led to the First Philippine Republic.',
        'Independence from Spain was declared on June 12, 1898, in Kawit, Cavite.',
      ],
      term: { label: 'KATIPUNAN', text: 'A secret society founded in 1892 to win independence from Spain.' },
      diagrams: [{ title: 'Road to Revolution', nodes: [['create-outline', 'Reform'], ['flag-outline', 'Katipunan'], ['flame-outline', 'Revolution']] }],
    },
    {
      points: [
        'The Philippines was ceded to the United States under the 1898 Treaty of Paris.',
        'The Philippine–American War followed, and an American civil government was set up.',
        'The Commonwealth period began in 1935 to prepare the country for independence.',
        'Japan occupied the Philippines from 1942 to 1945 during World War II.',
      ],
      term: { label: 'COMMONWEALTH', text: 'The 1935 transitional government preparing the Philippines for independence.' },
      diagrams: [{ title: 'Timeline', nodes: [['flag-outline', '1898'], ['ribbon-outline', '1935'], ['warning-outline', '1942–45']] }],
    },
    {
      points: [
        'The United States recognized Philippine independence on July 4, 1946.',
        'The declaration of martial law in 1972 began a period of authoritarian rule.',
        'The 1986 People Power Revolution restored democracy.',
        'The 1987 Constitution set up the current democratic framework.',
      ],
      term: { label: 'PEOPLE POWER', text: 'The 1986 peaceful uprising that ended the Marcos dictatorship.' },
      diagrams: [{ title: 'Road to Democracy', nodes: [['flag-outline', '1946'], ['lock-closed-outline', '1972'], ['people-outline', '1986']] }],
    },
  ],

  // Computer Networks
  '4': [
    {
      points: [
        'A computer network is a set of interconnected devices that share resources and exchange data.',
        'Networks communicate through agreed rules called protocols, which define how data is formatted and transmitted.',
        'Devices can be connected using wired or wireless media across local and wide geographic areas.',
        'Core network goals include reliability, scalability, performance, and security.',
      ],
      term: { label: 'NETWORK', text: 'Two or more computing devices connected for communication and resource sharing.' },
      diagrams: [
        { title: 'Basic Network Structure', nodes: [['laptop-outline', 'Client'], ['swap-horizontal-outline', 'Switch'], ['server-outline', 'Server']] },
        { title: 'LAN vs WAN', nodes: [['home-outline', 'LAN'], ['git-network-outline', 'Router'], ['globe-outline', 'WAN']] },
        { title: 'Client–Server Model', nodes: [['laptop-outline', 'Client'], ['cloud-outline', 'Internet'], ['server-outline', 'Server']] },
      ],
    },
    {
      points: [
        'The OSI model has seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
        'The TCP/IP model groups these into four layers: Link, Internet, Transport, and Application.',
        'Each layer serves the layer above it and hides the details of the layer below.',
        'Encapsulation adds a header at each layer as data moves down the stack.',
      ],
      term: { label: 'ENCAPSULATION', text: 'Wrapping data with protocol headers as it passes down through each layer.' },
      diagrams: [
        { title: 'OSI vs TCP/IP', nodes: [['layers-outline', 'OSI'], ['swap-horizontal-outline', 'Mapping'], ['layers-outline', 'TCP/IP']] },
        { title: 'Data Flow', nodes: [['laptop-outline', 'Sender'], ['git-network-outline', 'Network'], ['desktop-outline', 'Receiver']] },
      ],
    },
    {
      points: [
        'Topology describes how devices are arranged and connected in a network.',
        'In a star topology, every device connects to a central switch or hub.',
        'Bus uses one shared cable, ring passes data around a loop, and mesh links devices to many others.',
        'Mesh offers the best redundancy but costs the most to build.',
      ],
      term: { label: 'TOPOLOGY', text: 'The physical or logical layout of devices and links in a network.' },
      diagrams: [{ title: 'Star Topology', nodes: [['laptop-outline', 'Device A'], ['git-network-outline', 'Switch'], ['desktop-outline', 'Device B']] }],
    },
    {
      points: [
        'A protocol is a set of rules that lets devices communicate.',
        'HTTP and HTTPS carry web traffic, with HTTPS adding TLS encryption.',
        'TCP provides reliable, ordered delivery, while UDP is faster but does not guarantee delivery.',
        'DNS translates domain names into IP addresses.',
      ],
      term: { label: 'PROTOCOL', text: 'An agreed set of rules for formatting and exchanging data.' },
      diagrams: [
        { title: 'TCP vs UDP', nodes: [['shield-checkmark-outline', 'TCP'], ['swap-horizontal-outline', 'Choose'], ['flash-outline', 'UDP']] },
        { title: 'DNS Lookup', nodes: [['globe-outline', 'Browser'], ['search-outline', 'DNS'], ['server-outline', 'Web server']] },
      ],
    },
    {
      points: [
        'An IP address identifies a device on a network; IPv4 uses 32 bits and IPv6 uses 128 bits.',
        'A subnet mask separates the network portion of an address from the host portion.',
        'Subnetting splits a large network into smaller ones to improve performance and security.',
        'Private ranges like 192.168.x.x are used inside local networks.',
      ],
      term: { label: 'SUBNET MASK', text: 'A value that marks which bits of an IP address identify the network.' },
      diagrams: [{ title: 'Subnetting', nodes: [['git-network-outline', 'Network'], ['funnel-outline', 'Subnet mask'], ['grid-outline', 'Subnets']] }],
    },
  ],
};
