export interface EventData {
  id: string;
  title: string;
  organizer: string;
  sport: "Cycling" | "Running" | "Swimming";
  date: string;
  time: string;
  distance: string;
  imageUrl: string;
  location: string;
  elevation: string;
  targetPace: string;
  capacity: string;
  about: string;
  faqs: { question: string; answer: string }[];
}

// Simple mutable state to mock a real backend
export const myPassIds = new Set<string>(["2", "4"]); // 2 = Golden Gate, 4 = Marin Headlands

export function addPass(id: string) {
  myPassIds.add(id);
}

export function getMyPasses(): EventData[] {
  return MOCK_EVENTS.filter((e) => myPassIds.has(e.id));
}

export const MOCK_EVENTS: EventData[] = [
  {
    id: "1",
    title: "Dawn Patrol Tempo Ride",
    organizer: "Velo Club Vistas",
    sport: "Cycling",
    date: "Oct 12",
    time: "6:00 AM",
    distance: "45 mi",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmYi1NlwehRQ6ng1jkjyPdpliCLOV04dwqubXaXXnUMCfdAG9pQmee7vVXkgQ-6oCeEm6SRMRSxMuiVcULzSBm6B7LBBJfAQsFKJy1h5hX6C-OBxZ7au62mws0CfJjFy_bUXWm3EPM_rY8M0vYGxncr748CVWmuheL0KsgR8ft4ezFAA3LxXa14qTMFghqSxyo_ClLZRyB6Aaaln9b2BhDCWKMlmUbt67w0bSSgMb6piLnZIiWrqV1jw",
    location: "Sausalito, CA",
    elevation: "2,000 ft",
    targetPace: "18-20 mph",
    capacity: "25 / 50",
    about:
      "A fast-paced early morning ride across the Golden Gate Bridge into the Marin Headlands. Expect some climbs and gorgeous sunrise views. Not for beginners.",
    faqs: [
      {
        question: "Are e-bikes allowed?",
        answer: "Yes, class 1 and 3 e-bikes are permitted.",
      },
      {
        question: "Is there a sag wagon?",
        answer: "No, please bring your own repair kit and spare tubes.",
      },
    ],
  },
  {
    id: "2",
    title: "Golden Gate Sunrise 10K",
    organizer: "City Striders",
    sport: "Running",
    date: "Oct 24",
    time: "6:00 AM",
    distance: "10.0 km",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkj_r4KTzGQ276GtwblyHU1uDSlWLaODCLGFovt1w1r0YSCNJfOxp_OUtfoa1jTpZBZowJ9ufEVhNlvpTbuJ7cp0Wqh0rMIhCNQIhW2MNmX9ouriLN2djSDX-VsLpd_jxWpoq44KFmfMrhkaaceGGQPF4Jeo6vvYuq2SqwwGvGH_2oedmN2QwIwHafDPVTDTBU3wGuJYJRSg5HTRTcz3pZwQDrgGdxJqje3AYlgE2XIkvEQ1gJqmOcAw",
    location: "Crissy Field, San Francisco",
    elevation: "45 m",
    targetPace: "5:30/km",
    capacity: "50 / 100",
    about:
      "Join us for an invigorating morning run starting at Crissy Field, tracing the coastline with spectacular views of the Golden Gate Bridge as the sun rises. Suitable for intermediate runners aiming for a steady pace. Water stations provided at the halfway mark.",
    faqs: [
      {
        question: "Is there bag drop available?",
        answer:
          "Yes, a secure bag drop will be available near the starting line from 5:30 AM.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Full refunds are available up to 48 hours before the event start time. No refunds thereafter.",
      },
    ],
  },
  {
    id: "3",
    title: "Open Water Masters",
    organizer: "Aquatic Endurance",
    sport: "Swimming",
    date: "Oct 15",
    time: "5:30 PM",
    distance: "3 km",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaG_aBaCEc5pI07eQ24G5ASNXOwezSdSMrzClbc8vNM8prDlWvDyzkEycw2KR2sOz9gyPUgyg6JZo2A6u3ooguBsZOarty0CWTBnbmADRaC3y55h0DDaQhCipqK6Ldxpb-udnJ-uFAdMTsSrxvlk2K26-JKITbfIcjrqchnRLEOSShxakBcRBXcOaqsQ-XVuveDT5a8x8HlB0EPkN7H_dqYJi7ouqa4CQRsB2iDXpZaM2tu614YfmQLg",
    location: "Aquatic Park, San Francisco",
    elevation: "0 m",
    targetPace: "1:30/100m",
    capacity: "15 / 30",
    about:
      "An intense open water swimming session focusing on endurance and sighting. Wetsuits are highly recommended due to the cold bay waters.",
    faqs: [
      {
        question: "Are there lockers available?",
        answer: "Yes, day lockers are available at the club house.",
      },
      {
        question: "Do I need a bright swim cap?",
        answer: "Yes, high visibility swim caps are mandatory for safety.",
      },
    ],
  },
  {
    id: "4",
    title: "Marin Headlands Half",
    organizer: "Trail Runners Co.",
    sport: "Running",
    date: "Nov 12",
    time: "8:00 AM",
    distance: "13.1 mi",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkj_r4KTzGQ276GtwblyHU1uDSlWLaODCLGFovt1w1r0YSCNJfOxp_OUtfoa1jTpZBZowJ9ufEVhNlvpTbuJ7cp0Wqh0rMIhCNQIhW2MNmX9ouriLN2djSDX-VsLpd_jxWpoq44KFmfMrhkaaceGGQPF4Jeo6vvYuq2SqwwGvGH_2oedmN2QwIwHafDPVTDTBU3wGuJYJRSg5HTRTcz3pZwQDrgGdxJqje3AYlgE2XIkvEQ1gJqmOcAw",
    location: "Sausalito, CA",
    elevation: "1,500 ft",
    targetPace: "8:00/mi",
    capacity: "75 / 150",
    about:
      "A scenic and challenging half marathon through the beautiful Marin Headlands. Get ready for steep climbs and rewarding views of the Pacific Ocean.",
    faqs: [
      {
        question: "Are trail shoes required?",
        answer: "Yes, trail running shoes are highly recommended due to loose dirt and rocks.",
      },
    ],
  },
];
