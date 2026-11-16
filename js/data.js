/* Lazarus dataset — real dead startups and products.
   Facts are public and widely reported; funding figures are approximate
   and labelled so in the UI. Names are used for historical commentary.
   UMD-style guard: works as a classic browser script and under Node. */
(function (root) {
  "use strict";

  var CAUSES = {
    "no-market":      { label: "No market",       weight: -6  },
    "bad-timing":     { label: "Bad timing",      weight: +18 },
    "unit-economics": { label: "Unit economics",  weight: -12 },
    "cash":           { label: "Ran out of cash", weight: -8  },
    "competition":    { label: "Outcompeted",     weight: -4  },
    "platform-risk":  { label: "Platform risk",   weight: +10 },
    "hardware-cost":  { label: "Hardware cost",   weight: +6  },
    "monetization":   { label: "No monetization", weight: +8  },
    "tech-debt":      { label: "Tech debt",       weight: +10 },
    "regulation":     { label: "Regulation",      weight: -14 },
    "trust":          { label: "Lost trust",      weight: -16 },
    "cannibalized":   { label: "Cannibalized",    weight: +12 }
  };

  /* One line per cause: what the resurrection must bury. */
  var BURY_LINES = {
    "no-market":      "Bury the assumption that everyone wanted it. Find the 1,000 people who desperately did.",
    "bad-timing":     "Bury the launch date, not the idea. The world has caught up.",
    "unit-economics": "Bury the pricing that lost money on every order. Price for survival first.",
    "cash":           "Bury the burn rate. Resurrect lean: three people, six months, one metric.",
    "competition":    "Bury the head-on fight. Find the corner the giants ignore.",
    "platform-risk":  "Bury the dependence on someone else's platform. Own the distribution.",
    "hardware-cost":  "Bury the hardware. Sell the outcome, not the device.",
    "monetization":   "Bury 'we will figure out revenue later.' Charge from day one.",
    "tech-debt":      "Bury the old stack. Rebuild on boring, modern technology.",
    "regulation":     "Bury the legal exposure. Get the lawyers in before launch, not after.",
    "trust":          "Bury the brand damage. New name, radical transparency, proof over promises.",
    "cannibalized":   "Bury the fear of competing with yourself. The market moved on; so should you."
  };

  /* Generic pivots for user-buried ideas, one per primary cause. */
  var GENERIC_PIVOTS = {
    "no-market":      "Shrink to the smallest audience that feels the pain daily, and serve only them.",
    "bad-timing":     "The timing is fixed now. Relaunch the same idea on today's infrastructure.",
    "unit-economics": "Rebuild the pricing so every order makes money, then grow only as fast as the margin allows.",
    "cash":           "Relaunch as a one-person business with no outside money and a paying customer in week one.",
    "competition":    "Stop fighting the giant. Serve the niche it cannot be bothered to serve.",
    "platform-risk":  "Rebuild on open protocols and an owned channel — email, RSS, or your own site.",
    "hardware-cost":  "Drop the device. Deliver the same outcome as a service or a subscription box.",
    "monetization":   "Charge from day one: a paid pilot with ten customers beats a free product with ten thousand users.",
    "tech-debt":      "Rewrite it small and boring: one language, one database, no cleverness.",
    "regulation":     "Redesign inside the rules — a compliant version of the idea, with lawyers in the room from day one.",
    "trust":          "Come back under a new name with proof, not promises: publish the numbers, open the books.",
    "cannibalized":   "The parent company already moved on. The market it abandoned is yours now."
  };

  var CORPSES = [
    {
      id: "quibi", name: "Quibi", born: 2020, died: 2020, category: "Video",
      funding: "≈$1.75B",
      what: "Premium short-form video made for phones, with Hollywood budgets and 10-minute episodes.",
      epitaph: "It spent a fortune to learn that nobody asked for it.",
      causes: ["bad-timing", "no-market", "unit-economics"],
      soul: "Premium short-form storytelling for phones is real — people do watch in ten-minute bursts.",
      pivot: "A vertical-drama studio for TikTok and Reels: an AI-assisted episode factory that revenue-shares with creators instead of paying Hollywood upfront."
    },
    {
      id: "stadia", name: "Google Stadia", born: 2019, died: 2023, category: "Gaming",
      funding: "n/a (Google internal)",
      what: "Cloud gaming: console-quality games streamed to any screen, no downloads, no console.",
      epitaph: "The tech worked. The store did not.",
      causes: ["competition", "monetization", "no-market"],
      soul: "Instant-play, no-download gaming is the future — the streaming itself worked.",
      pivot: "White-label cloud gaming for publishers: instant playable demos in the browser, no store cut, no hardware."
    },
    {
      id: "vine", name: "Vine", born: 2013, died: 2017, category: "Video",
      funding: "n/a (Twitter)",
      what: "Six-second looping videos. Constraint bred a whole comedy language.",
      epitaph: "Six seconds was enough. The money never came.",
      causes: ["monetization", "competition", "platform-risk"],
      soul: "Constraint breeds creativity, and six seconds is a perfect joke unit.",
      pivot: "Creator-owned short video with built-in tipping and remix royalties, so the stars never need to leave."
    },
    {
      id: "juicero", name: "Juicero", born: 2013, died: 2017, category: "Hardware",
      funding: "≈$120M",
      what: "A $400 connected juice press that squeezed proprietary produce packs.",
      epitaph: "The packs could be squeezed by hand. So could the business model.",
      causes: ["hardware-cost", "no-market", "trust"],
      soul: "People will pay for fresh, convenient health — the desire was real.",
      pivot: "Subscription cold-pressed juice with no hardware at all. The press was the mistake; the juice was the business."
    },
    {
      id: "moviepass", name: "MoviePass", born: 2011, died: 2019, category: "Entertainment",
      funding: "≈$70M+",
      what: "A subscription that let you watch a movie in a theater every day for $10 a month.",
      epitaph: "A deal too good to be true, priced accordingly.",
      causes: ["unit-economics", "cash"],
      soul: "Subscription access to cinemas is a real desire — people love a movie habit.",
      pivot: "Cinema subscription with dynamic pricing and a studio revenue share, capped at a volume the math can survive."
    },
    {
      id: "jawbone", name: "Jawbone", born: 1999, died: 2017, category: "Wearables",
      funding: "≈$930M",
      what: "Bluetooth headsets, speakers, and the UP fitness tracker — wearable health before it was cool.",
      epitaph: "It saw the future of wearables and still missed it.",
      causes: ["competition", "tech-debt", "cash"],
      soul: "Wearable health sensing was the right bet, years before the market agreed.",
      pivot: "A clinical-grade wearable for one condition — sleep-apnea screening, sold through doctors, not consumers."
    },
    {
      id: "segway", name: "Segway", born: 2001, died: 2020, category: "Transport",
      funding: "n/a",
      what: "A self-balancing two-wheeled personal transporter, once hyped as the future of cities.",
      epitaph: "The future of cities turned out to have somewhere to park it.",
      causes: ["bad-timing", "regulation", "no-market"],
      soul: "Last-mile micro-mobility is a real problem — the vehicle was not the issue.",
      pivot: "A shared e-scooter fleet with city permits. The vehicle was right; the ownership model was wrong."
    },
    {
      id: "reader", name: "Google Reader", born: 2005, died: 2013, category: "Web",
      funding: "n/a (Google internal)",
      what: "The RSS reader that organized the whole web into one clean, chronological feed.",
      epitaph: "Killed by the company that built it, mourned by everyone who used it.",
      causes: ["platform-risk", "monetization"],
      soul: "People want an open, chronological feed they control — not an algorithm's feed.",
      pivot: "An open-protocol reader with a paid premium tier, fediverse integration, and no ads at all."
    },
    {
      id: "windows-phone", name: "Windows Phone", born: 2010, died: 2017, category: "Mobile",
      funding: "n/a (Microsoft)",
      what: "Microsoft's mobile OS with live tiles — a genuinely different third option.",
      epitaph: "A beautiful OS with nowhere to get apps.",
      causes: ["competition", "platform-risk", "no-market"],
      soul: "A third mobile OS with a distinct design language was genuinely different — and many users loved it.",
      pivot: "A privacy-first Android fork for enterprise, with a real app-compat layer and a keyboard-first option."
    },
    {
      id: "flash", name: "Adobe Flash", born: 1996, died: 2020, category: "Web",
      funding: "n/a",
      what: "The animation and games platform that powered the playful early web.",
      epitaph: "Security holes killed it. Nostalgia keeps it alive.",
      causes: ["tech-debt", "platform-risk", "competition"],
      soul: "The open creative web needs a playful animation layer — Flash was the web's toy box.",
      pivot: "An open-source HTML5 runtime that imports old Flash files. (Ruffle already does this — this resurrection already happened.)"
    },
    {
      id: "pets", name: "Pets.com", born: 1998, died: 2000, category: "E-commerce",
      funding: "≈$300M",
      what: "Online pet supplies, famous for a sock-puppet mascot and a Super Bowl ad.",
      epitaph: "The mascot lived. The margins did not.",
      causes: ["unit-economics", "bad-timing", "cash"],
      soul: "Pet owners do buy online, happily and repeatedly — the demand was real.",
      pivot: "A pet-supplies subscription with tight delivery zones. (Chewy proved it: the idea was right, the 2000 ad spend was the killer.)"
    },
    {
      id: "webvan", name: "Webvan", born: 1996, died: 2001, category: "E-commerce",
      funding: "≈$1.2B",
      what: "Online grocery delivery with massive automated warehouses, built for a nation at once.",
      epitaph: "It built the warehouses before it had the customers.",
      causes: ["unit-economics", "cash", "bad-timing"],
      soul: "Grocery delivery is a real need — people hate the weekly shop.",
      pivot: "Dark-store grocery with tight delivery zones, expanding one neighborhood at a time. (Instacart and Amazon Fresh proved the demand.)"
    },
    {
      id: "friendster", name: "Friendster", born: 2002, died: 2015, category: "Social",
      funding: "≈$48M",
      what: "The first big social network — circles of real friends, before followers existed.",
      epitaph: "It invented social networking, then watched it walk away.",
      causes: ["tech-debt", "competition", "trust"],
      soul: "Circles of real friends, not followers — the original social graph was the right idea.",
      pivot: "A small private social app for real-life friend groups: no ads, no influencers, no public metrics."
    },
    {
      id: "google-plus", name: "Google+", born: 2011, died: 2019, category: "Social",
      funding: "n/a (Google internal)",
      what: "Google's social network, built around Circles and interest communities.",
      epitaph: "Nobody asked for it, and then a data breach ended the argument.",
      causes: ["no-market", "competition", "trust"],
      soul: "Interest-based communities (Circles) were the right idea — people gather around topics, not brands.",
      pivot: "Topic communities with strong human moderation and no algorithmic feed. Small, quiet, useful."
    },
    {
      id: "yahoo-answers", name: "Yahoo Answers", born: 2005, died: 2021, category: "Q&A",
      funding: "n/a (Yahoo)",
      what: "Everyday questions answered by everyday people — the internet's junk drawer and its oracle.",
      epitaph: "Sixteen years of questions, zero answers about the business model.",
      causes: ["trust", "monetization", "competition"],
      soul: "Everyday questions deserve human answers — not everything is a search query.",
      pivot: "Expert-verified Q&A with reputation staking: Stack Overflow's model, for everything else."
    },
    {
      id: "blackberry", name: "BlackBerry", born: 1999, died: 2016, category: "Mobile",
      funding: "n/a",
      what: "The keyboard phone that ran business and government — email, security, and BBM.",
      epitaph: "It typed faster than the future and lost anyway.",
      causes: ["competition", "tech-debt", "no-market"],
      soul: "A phone built for typing and security still has an audience that touchscreens ignore.",
      pivot: "A secure keyboard phone for regulated industries and the privacy-conscious — a tool, not a toy."
    },
    {
      id: "blockbuster", name: "Blockbuster", born: 1985, died: 2010, category: "Entertainment",
      funding: "n/a",
      what: "Video rental stores — Friday night, a wall of boxes, and late fees.",
      epitaph: "It had the chance to buy Netflix for $50 million. It laughed.",
      causes: ["competition", "unit-economics", "bad-timing"],
      soul: "Curated movie night is a ritual people love — choosing together is half the fun.",
      pivot: "A curated streaming boutique: one great film a week, human curation, no infinite scroll."
    },
    {
      id: "kodak", name: "Kodak", born: 1888, died: 2012, category: "Photo",
      funding: "n/a (bankrupt 2012)",
      what: "The film giant that invented the digital camera — and then buried it to protect film.",
      epitaph: "It invented its own killer and chose not to use it.",
      causes: ["cannibalized", "bad-timing", "competition"],
      soul: "The Kodak moment — film's look, and the ritual of a photograph that matters.",
      pivot: "A premium film photography brand for the analog revival. Film sales are growing again; the fear is gone."
    },
    {
      id: "nokia", name: "Nokia Phones", born: 1865, died: 2014, category: "Mobile",
      funding: "n/a (sold to Microsoft)",
      what: "The phones that were indestructible, lasted a week on a charge, and played Snake.",
      epitaph: "It connected people, then disconnected from the smartphone.",
      causes: ["competition", "tech-debt", "bad-timing"],
      soul: "Indestructible, week-long-battery phones — reliability as a feature, not a compromise.",
      pivot: "The dumbphone revival: HMD already sells Nokia-branded feature phones. This resurrection is real."
    },
    {
      id: "aim", name: "AIM", born: 1997, died: 2017, category: "Messaging",
      funding: "n/a (AOL)",
      what: "AOL Instant Messenger — buddy lists, away messages, and the sound of a door creaking open.",
      epitaph: "You have got mail. You no longer have AIM.",
      causes: ["competition", "platform-risk", "monetization"],
      soul: "Presence plus away messages plus buddy lists was social media before social media.",
      pivot: "Status-first messaging for close friends: no groups, no noise, just who is around and what they are doing."
    },
    {
      id: "altavista", name: "AltaVista", born: 1995, died: 2013, category: "Web",
      funding: "n/a",
      what: "The search engine that indexed the whole web before Google existed.",
      epitaph: "It found everything except a business model.",
      causes: ["competition", "monetization", "tech-debt"],
      soul: "Search was once a research tool, not an ad machine — and some people still want that.",
      pivot: "Ad-free, privacy-first search with transparent ranking. No ads, no tracking, a subscription instead."
    },
    {
      id: "napster", name: "Napster", born: 1999, died: 2001, category: "Music",
      funding: "≈$13M",
      what: "Peer-to-peer music sharing — your library, everyone's library, one search box.",
      epitaph: "The lawsuits won. The idea won bigger.",
      causes: ["regulation", "monetization"],
      soul: "Music discovery through other people's libraries — taste is social.",
      pivot: "Artist-direct streaming with fan libraries and fair splits. The idea won; the legality caught up."
    },
    {
      id: "pebble", name: "Pebble", born: 2012, died: 2016, category: "Wearables",
      funding: "≈$43M (crowdfunded + VC)",
      what: "The Kickstarter smartwatch: e-paper display, a week of battery, always-on face.",
      epitaph: "The crowd funded it. The giants buried it.",
      causes: ["competition", "cash", "platform-risk"],
      soul: "A week-long battery and an always-on e-paper watch — the practical smartwatch.",
      pivot: "An open-source e-paper watch. (PebbleOS is now open source — this resurrection already happened.)"
    },
    {
      id: "hq", name: "HQ Trivia", born: 2017, died: 2020, category: "Gaming",
      funding: "≈$15M",
      what: "Live trivia at 3pm and 9pm: a host, twelve questions, real money, millions playing at once.",
      epitaph: "Appointment viewing, until the appointments stopped paying.",
      causes: ["cash", "trust", "competition"],
      soul: "Live, communal, appointment viewing is powerful — everyone in the same moment.",
      pivot: "Live trivia as a branded event format: small stakes, sponsors instead of VCs, no pressure to be a unicorn."
    }
  ];

  var LAZARUS = { CAUSES: CAUSES, BURY_LINES: BURY_LINES, GENERIC_PIVOTS: GENERIC_PIVOTS, CORPSES: CORPSES };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = LAZARUS;
  } else {
    root.LAZARUS_DATA = LAZARUS;
  }
})(typeof window !== "undefined" ? window : globalThis);
