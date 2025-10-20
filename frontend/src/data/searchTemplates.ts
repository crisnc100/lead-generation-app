import {
  Dumbbell,
  Heart,
  Flame,
  Waves,
  Wrench,
  Droplet,
  Wind,
  Zap,
  Trees,
  UtensilsCrossed,
  Coffee,
  Wine,
  Pizza,
  Cake,
  type LucideIcon,
} from 'lucide-react'

// =====================================================
// Search Template Types
// =====================================================

export interface SearchTemplate {
  id: string
  name: string
  description: string
  category: 'health-wellness' | 'home-services' | 'restaurants'
  icon: LucideIcon
  niche: string
  exampleLocations: string[]
  defaultRadius: number
  defaultMinScore: number
  service: string
  whyItWorks: string
  estimatedLeadsPerMonth: string
  popular?: boolean
  new?: boolean
}

// =====================================================
// Template Library
// =====================================================

export const searchTemplates: SearchTemplate[] = [
  // ========== HEALTH & WELLNESS ==========
  {
    id: 'gyms-fitness',
    name: 'Gyms & Fitness Studios',
    description: 'Find gyms struggling with class bookings and high call volume',
    category: 'health-wellness',
    icon: Dumbbell,
    niche: 'gym, fitness studio, crossfit box',
    exampleLocations: ['Los Angeles, CA', 'Miami, FL', 'Austin, TX'],
    defaultRadius: 15,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'Gyms receive 50-100+ calls/day for class bookings, membership inquiries, and cancellations. AI receptionists save 10-15 hours/week in admin time.',
    estimatedLeadsPerMonth: '15-30 per major city',
    popular: true,
  },
  {
    id: 'yoga-studios',
    name: 'Yoga & Pilates Studios',
    description: 'Target wellness studios needing 24/7 booking assistance',
    category: 'health-wellness',
    icon: Heart,
    niche: 'yoga studio, pilates studio, barre studio',
    exampleLocations: ['San Diego, CA', 'Portland, OR', 'Boulder, CO'],
    defaultRadius: 20,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'Yoga studios have high client turnover and constant booking changes. Most owners teach classes and miss calls. AI handles scheduling 24/7.',
    estimatedLeadsPerMonth: '10-25 per major city',
    popular: true,
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts Schools',
    description: 'Find karate, BJJ, and MMA gyms with scheduling challenges',
    category: 'health-wellness',
    icon: Flame,
    niche: 'karate, jiu jitsu, mma gym, martial arts',
    exampleLocations: ['Dallas, TX', 'Phoenix, AZ', 'Las Vegas, NV'],
    defaultRadius: 15,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'Martial arts schools juggle kids classes, adult classes, and private lessons. Owners are teaching, not answering phones. Perfect for AI automation.',
    estimatedLeadsPerMonth: '8-20 per major city',
  },
  {
    id: 'chiropractors',
    name: 'Chiropractors & Physical Therapy',
    description: 'Target healthcare practices with appointment scheduling needs',
    category: 'health-wellness',
    icon: Waves,
    niche: 'chiropractor, physical therapy, sports medicine',
    exampleLocations: ['Chicago, IL', 'Seattle, WA', 'Denver, CO'],
    defaultRadius: 10,
    defaultMinScore: 8,
    service: 'AI Receptionist',
    whyItWorks:
      'Healthcare practices need HIPAA-aware scheduling. Many still use paper calendars or miss calls during patient sessions. High-value clients.',
    estimatedLeadsPerMonth: '12-25 per city',
  },
  {
    id: 'med-spas',
    name: 'Med Spas & Aesthetic Clinics',
    description: 'Find high-end wellness spas needing premium booking systems',
    category: 'health-wellness',
    icon: Heart,
    niche: 'med spa, medical spa, aesthetic clinic, botox',
    exampleLocations: ['Beverly Hills, CA', 'Scottsdale, AZ', 'Miami Beach, FL'],
    defaultRadius: 25,
    defaultMinScore: 8,
    service: 'AI Receptionist',
    whyItWorks:
      'Med spas charge $200-500+ per appointment. Missing ONE call = lost revenue. They need professional, 24/7 booking and consultation scheduling.',
    estimatedLeadsPerMonth: '5-15 per metro area',
  },

  // ========== HOME SERVICES ==========
  {
    id: 'hvac-contractors',
    name: 'HVAC Contractors',
    description: 'Target heating/cooling companies with emergency call volume',
    category: 'home-services',
    icon: Wind,
    niche: 'hvac, air conditioning, heating repair',
    exampleLocations: ['Houston, TX', 'Atlanta, GA', 'Orlando, FL'],
    defaultRadius: 30,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'HVAC companies get slammed during summer/winter. Emergency calls come in 24/7. AI triages urgent vs. routine, books appointments, captures leads.',
    estimatedLeadsPerMonth: '20-40 per region',
    popular: true,
  },
  {
    id: 'plumbers',
    name: 'Plumbing Services',
    description: 'Find plumbers handling emergency and scheduled service calls',
    category: 'home-services',
    icon: Droplet,
    niche: 'plumber, plumbing, drain cleaning, water heater',
    exampleLocations: ['Philadelphia, PA', 'San Antonio, TX', 'Charlotte, NC'],
    defaultRadius: 25,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'Plumbers are on-site all day and miss 40-60% of calls. Emergencies need immediate response. AI captures every lead and schedules same-day service.',
    estimatedLeadsPerMonth: '15-35 per city',
    popular: true,
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Lawn Care',
    description: 'Target outdoor services with seasonal call surges',
    category: 'home-services',
    icon: Trees,
    niche: 'landscaping, lawn care, tree service, irrigation',
    exampleLocations: ['Nashville, TN', 'Raleigh, NC', 'Sacramento, CA'],
    defaultRadius: 20,
    defaultMinScore: 6,
    service: 'AI Receptionist',
    whyItWorks:
      'Landscape companies have crazy spring/summer call volume. Crews are outdoors without phones. AI handles quotes, scheduling, and recurring service setup.',
    estimatedLeadsPerMonth: '12-30 per region',
  },
  {
    id: 'electricians',
    name: 'Electrical Contractors',
    description: 'Find electricians needing emergency and appointment scheduling',
    category: 'home-services',
    icon: Zap,
    niche: 'electrician, electrical contractor, electrical repair',
    exampleLocations: ['Boston, MA', 'Minneapolis, MN', 'Columbus, OH'],
    defaultRadius: 25,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'Electrical emergencies require fast response. Most electricians work solo or small teams, missing 50%+ of calls. AI never misses an emergency.',
    estimatedLeadsPerMonth: '10-25 per city',
  },
  {
    id: 'roofing',
    name: 'Roofing Companies',
    description: 'Target roofers with storm season call spikes',
    category: 'home-services',
    icon: Wrench,
    niche: 'roofing, roof repair, roof replacement',
    exampleLocations: ['Dallas, TX', 'Oklahoma City, OK', 'Tampa, FL'],
    defaultRadius: 35,
    defaultMinScore: 6,
    service: 'AI Receptionist',
    whyItWorks:
      'After storms, roofers get 100+ calls/day for inspections. AI handles triage, books inspections, and qualifies leads while crews are on roofs.',
    estimatedLeadsPerMonth: '15-30 per storm region',
  },

  // ========== RESTAURANTS & HOSPITALITY ==========
  {
    id: 'fine-dining',
    name: 'Fine Dining Restaurants',
    description: 'Target upscale restaurants with reservation management needs',
    category: 'restaurants',
    icon: UtensilsCrossed,
    niche: 'fine dining, upscale restaurant, steakhouse',
    exampleLocations: ['New York, NY', 'San Francisco, CA', 'Chicago, IL'],
    defaultRadius: 15,
    defaultMinScore: 8,
    service: 'AI Receptionist',
    whyItWorks:
      'High-end restaurants need professional reservation handling 24/7. AI manages waitlists, special requests, and reduces no-shows with confirmations.',
    estimatedLeadsPerMonth: '8-20 per major city',
  },
  {
    id: 'fast-casual',
    name: 'Fast Casual & Quick Service',
    description: 'Find busy restaurants struggling with takeout and delivery orders',
    category: 'restaurants',
    icon: Pizza,
    niche: 'fast casual, quick service, sandwich shop, pizza',
    exampleLocations: ['Denver, CO', 'Austin, TX', 'Portland, OR'],
    defaultRadius: 10,
    defaultMinScore: 6,
    service: 'AI Receptionist',
    whyItWorks:
      'Fast-casual spots get slammed during lunch/dinner rushes. Staff can\'t keep up with phone orders. AI handles takeout, answers menu questions, upsells.',
    estimatedLeadsPerMonth: '20-40 per city',
    new: true,
  },
  {
    id: 'coffee-shops',
    name: 'Coffee Shops & Cafes',
    description: 'Target specialty coffee shops needing catering and event bookings',
    category: 'restaurants',
    icon: Coffee,
    niche: 'coffee shop, cafe, espresso bar',
    exampleLocations: ['Seattle, WA', 'Brooklyn, NY', 'San Diego, CA'],
    defaultRadius: 8,
    defaultMinScore: 6,
    service: 'AI Receptionist',
    whyItWorks:
      'Coffee shops miss catering orders and private event bookings while making drinks. AI captures these high-value opportunities 24/7.',
    estimatedLeadsPerMonth: '10-25 per metro',
    new: true,
  },
  {
    id: 'wineries-breweries',
    name: 'Wineries & Craft Breweries',
    description: 'Find tasting rooms needing event and tour reservations',
    category: 'restaurants',
    icon: Wine,
    niche: 'winery, brewery, tasting room, wine bar',
    exampleLocations: ['Napa, CA', 'Sonoma, CA', 'Willamette Valley, OR'],
    defaultRadius: 40,
    defaultMinScore: 7,
    service: 'AI Receptionist',
    whyItWorks:
      'Wineries and breweries host tours, tastings, and private events. AI handles group bookings, answers wine/beer questions, and upsells wine club memberships.',
    estimatedLeadsPerMonth: '5-15 per wine region',
  },
  {
    id: 'bakeries',
    name: 'Bakeries & Dessert Shops',
    description: 'Target bakeries with custom order and catering inquiries',
    category: 'restaurants',
    icon: Cake,
    niche: 'bakery, pastry shop, cake shop, dessert cafe',
    exampleLocations: ['Las Vegas, NV', 'Phoenix, AZ', 'Nashville, TN'],
    defaultRadius: 12,
    defaultMinScore: 6,
    service: 'AI Receptionist',
    whyItWorks:
      'Bakeries juggle walk-ins, custom cake orders, and catering calls. Bakers are in the kitchen, not answering phones. AI captures every custom order opportunity.',
    estimatedLeadsPerMonth: '8-20 per city',
  },
]

// =====================================================
// Helper Functions
// =====================================================

export function getTemplatesByCategory(
  category: SearchTemplate['category']
): SearchTemplate[] {
  return searchTemplates.filter((t) => t.category === category)
}

export function getTemplateById(id: string): SearchTemplate | undefined {
  return searchTemplates.find((t) => t.id === id)
}

export function getPopularTemplates(): SearchTemplate[] {
  return searchTemplates.filter((t) => t.popular)
}

export function getNewTemplates(): SearchTemplate[] {
  return searchTemplates.filter((t) => t.new)
}

export const categoryLabels: Record<SearchTemplate['category'], string> = {
  'health-wellness': 'Health & Wellness',
  'home-services': 'Home Services',
  restaurants: 'Restaurants & Hospitality',
}
