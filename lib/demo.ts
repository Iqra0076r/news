import type { Article } from './types';

const now = new Date();
const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();

export const demoArticles: Article[] = [
  {
    id: 'demo-1', slug: 'cities-rethink-night-time-transit-networks',
    headline: 'Cities rethink night-time transit as late-hour demand reshapes urban travel',
    standfirst: 'Transport planners are testing more frequent late services, smaller vehicles and data-led scheduling as work and leisure patterns shift.',
    body: `Urban transport agencies are reassessing how buses and trains operate after dark, with several systems testing schedules that respond more closely to late-hour demand.\n\nThe emerging model relies less on a fixed assumption that demand falls sharply after the evening commute. Instead, planners are examining anonymized travel data, major event calendars and shift-work patterns to identify corridors where more frequent service could improve reliability.\n\nOperators are also experimenting with smaller vehicles on lower-demand routes, timed transfers and safer waiting areas. The aim is to improve coverage without simply extending daytime service patterns into the night.\n\nTransport researchers say the most useful trials will be those that measure not only ridership, but also missed connections, average wait times and whether workers in late-shift industries can reach home more predictably.`,
    category: 'World', tags: ['Transport', 'Cities', 'Mobility'], author: 'News Desk',
    publishedAt: ago(18), modifiedAt: ago(18), imageUrl: '/api/illustration?topic=Urban%20Transit&kind=world', imageAlt: 'Editorial illustration representing modern urban transit at night', featured: true, breaking: false, status: 'published',
    seoTitle: 'Cities rethink night-time transit networks', seoDescription: 'Urban transport agencies are testing data-led late-night services, timed transfers and new operating models as travel patterns change.'
  },
  {
    id: 'demo-2', slug: 'small-businesses-adopt-ai-customer-support-tools',
    headline: 'Small businesses move toward AI-assisted customer support without abandoning human teams',
    standfirst: 'A new generation of support tools is being used to triage common requests while complex cases remain with human staff.',
    body: `Small businesses are increasingly using AI-assisted support systems to sort common customer requests before they reach a human agent.\n\nThe systems are typically being deployed for repetitive tasks such as order-status questions, appointment changes and basic product guidance. Businesses using the tools effectively are keeping escalation paths visible so customers can reach a person when the automated response is not enough.\n\nThe practical challenge is accuracy. Companies are placing tighter controls around which data the assistant can use and are reviewing conversations that generate low-confidence answers.\n\nThe trend suggests automation is moving from a replacement narrative toward a workflow model in which software handles routine classification while people retain responsibility for unusual or sensitive cases.`,
    category: 'Technology', tags: ['AI', 'Small Business', 'Customer Support'], author: 'Technology Desk',
    publishedAt: ago(43), modifiedAt: ago(43), imageUrl: '/api/illustration?topic=AI%20Support&kind=technology', imageAlt: 'Editorial illustration of an AI-assisted customer support interface', status: 'published',
    seoTitle: 'Small businesses adopt AI-assisted support tools', seoDescription: 'Small companies are using AI to triage routine customer requests while keeping human agents responsible for complex cases.'
  },
  {
    id: 'demo-3', slug: 'battery-storage-projects-reshape-electricity-planning',
    headline: 'Battery storage projects are changing how power grids plan for peak demand',
    standfirst: 'Utilities are pairing renewable generation with larger storage systems to move electricity from low-demand periods into evening peaks.',
    body: `Grid planners are giving battery storage a larger role in managing the daily mismatch between electricity generation and demand.\n\nLarge storage projects can absorb electricity when supply is abundant and release it later, helping utilities respond to sharp evening peaks without relying on the same mix of generation used in previous years.\n\nThe economics vary by market, but project developers are focusing on duration, battery degradation, interconnection capacity and the value of fast response to sudden grid changes.\n\nAs deployment grows, regulators are also examining how storage should be compensated when it provides several services at once, including reserve capacity, frequency response and peak shaving.`,
    category: 'Business', tags: ['Energy', 'Batteries', 'Infrastructure'], author: 'Business Desk',
    publishedAt: ago(76), modifiedAt: ago(76), imageUrl: '/api/illustration?topic=Energy%20Storage&kind=business', imageAlt: 'Editorial illustration representing utility-scale battery storage and electricity grids', status: 'published',
    seoTitle: 'Battery storage reshapes electricity planning', seoDescription: 'Utilities are expanding battery storage to shift electricity across the day and manage increasingly complex peak-demand patterns.'
  },
  {
    id: 'demo-4', slug: 'sports-teams-use-recovery-data-more-carefully',
    headline: 'Sports teams refine recovery tracking as coaches seek better context around athlete data',
    standfirst: 'Wearables are becoming more common, but performance staff are placing greater emphasis on trends rather than isolated numbers.',
    body: `Professional sports teams are refining how they interpret recovery data collected from wearables and training systems.\n\nPerformance staff are increasingly treating individual metrics as part of a broader picture that includes workload, travel, sleep patterns and how an athlete reports feeling.\n\nCoaches have found that a single score can be misleading when used without context. Teams are therefore focusing on longer trends and athlete-specific baselines instead of applying one universal threshold.\n\nThe shift is also influencing how information is presented to players, with simpler dashboards replacing dense data displays that can distract from training decisions.`,
    category: 'Sports', tags: ['Performance', 'Training', 'Data'], author: 'Sports Desk',
    publishedAt: ago(112), modifiedAt: ago(112), imageUrl: '/api/illustration?topic=Sports%20Performance&kind=sports', imageAlt: 'Editorial illustration showing sports performance and recovery data', status: 'published',
    seoTitle: 'Sports teams refine athlete recovery tracking', seoDescription: 'Coaches are using wearable data more carefully, focusing on long-term trends and individual context rather than isolated scores.'
  },
  {
    id: 'demo-5', slug: 'researchers-improve-flood-mapping-with-local-sensors',
    headline: 'Researchers combine local sensors with satellite data to sharpen flood mapping',
    standfirst: 'New mapping approaches aim to give emergency planners a more precise view of how water moves through streets and low-lying areas.',
    body: `Flood researchers are combining satellite observations with local sensor networks to improve the speed and detail of inundation maps.\n\nSatellite imagery provides wide-area coverage, while ground sensors can capture rapidly changing water levels in places that are difficult to resolve from orbit. Merging the two can help produce more useful estimates during fast-moving events.\n\nThe approach is especially valuable in dense urban areas where roads, drainage channels and buildings can change how water spreads over short distances.\n\nEmergency planners are interested in systems that can update quickly enough to support road closures, evacuation planning and the placement of temporary barriers.`,
    category: 'Science', tags: ['Climate', 'Flooding', 'Satellites'], author: 'Science Desk',
    publishedAt: ago(150), modifiedAt: ago(150), imageUrl: '/api/illustration?topic=Flood%20Mapping&kind=science', imageAlt: 'Editorial illustration of satellite and sensor-based flood mapping', status: 'published',
    seoTitle: 'Local sensors sharpen satellite flood mapping', seoDescription: 'Researchers are combining satellite observations and ground sensors to improve fast-changing flood maps for emergency planning.'
  },
  {
    id: 'demo-6', slug: 'streaming-platforms-test-shorter-release-windows',
    headline: 'Streaming platforms test shorter release windows for selected original series',
    standfirst: 'Services are experimenting with release timing as they balance subscriber engagement, conversation and binge viewing.',
    body: `Streaming services are continuing to experiment with how quickly episodes of original series are released.\n\nRather than relying exclusively on full-season drops or one-episode-per-week schedules, some programming teams are testing shorter windows designed to keep discussion active without stretching a season across several months.\n\nThe strategy reflects a broader effort to balance audience convenience with retention. A release pattern can affect social conversation, review timing and the likelihood that viewers remain subscribed through the end of a season.\n\nThere is no single model emerging across the industry, suggesting release schedules are increasingly being treated as a title-by-title programming decision.`,
    category: 'Entertainment', tags: ['Streaming', 'Television', 'Media'], author: 'Culture Desk',
    publishedAt: ago(205), modifiedAt: ago(205), imageUrl: '/api/illustration?topic=Streaming%20Media&kind=entertainment', imageAlt: 'Editorial illustration representing streaming media and episodic releases', status: 'published',
    seoTitle: 'Streaming platforms test shorter release windows', seoDescription: 'Streaming services are experimenting with hybrid episode schedules to balance convenience, engagement and subscriber retention.'
  }
];
