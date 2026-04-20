import type { LogoResolver, SportConfig } from '../../shared/types';
import { CHAMPIONS } from './data';

// ESPN's soccer logo CDN keys on numeric team IDs, e.g.
// https://a.espncdn.com/i/teamlogos/soccer/500/360.png for Manchester
// United. Every club that ever won the English top flight still has an
// ESPN record (current PL, Championship, or League One), so we map each
// EPL franchiseId to its ESPN numeric id and let the resolver build the
// URL. Keeping the table in the config (not on every data row) mirrors
// the franchiseId stability guarantee: no EPL club relocates, so one id
// per franchise is sufficient - and it avoids repeating the same id
// across the 20+ Man United / 19 Liverpool rows.
const ESPN_ID_BY_FRANCHISE: Record<string, string> = {
  preston: '394',
  everton: '368',
  sunderland: '366',
  aston_villa: '362',
  sheff_united: '398',
  liverpool: '364',
  sheff_wed: '399',
  newcastle: '361',
  man_united: '360',
  blackburn: '365',
  west_brom: '383',
  burnley: '379',
  huddersfield: '335',
  arsenal: '359',
  man_city: '382',
  portsmouth: '385',
  tottenham: '367',
  wolves: '380',
  chelsea: '363',
  ipswich: '373',
  leeds: '357',
  derby: '374',
  forest: '393',
  leicester: '375',
};

const logoResolver: LogoResolver = (c) => {
  const id = ESPN_ID_BY_FRANCHISE[c.franchiseId];
  return id ? [`https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`] : [];
};

export const eplConfig: SportConfig = {
  id: 'epl',
  route: '/epl',
  name: 'English top flight',
  trophyName: 'English league title',
  championshipName: 'English top-flight championship',
  firstYear: 1889,
  rows: CHAMPIONS,
  logoResolver,
  // Spot-check milestones: franchise totals across the First Division /
  // Premier League era boundary. Man City is the load-bearing case -
  // 2 First Division + 8 Premier League through 2024 must roll up as 10.
  // Keep in sync with milestones.test.ts.
  milestones: [
    { franchiseId: 'man_united', expectedCount: 20, throughYear: 2013 },
    { franchiseId: 'liverpool', expectedCount: 19, throughYear: 2020 },
    { franchiseId: 'arsenal', expectedCount: 13, throughYear: 2004 },
    { franchiseId: 'everton', expectedCount: 9, throughYear: 1987 },
    { franchiseId: 'man_city', expectedCount: 10, throughYear: 2024 },
  ],
};
