

export const TOPICS = {
    WEBSITE_EVENTS: 'website.events',
    NOTIFICATIONS: 'notifications.send',
    ANALYTICS: 'analytics.events',
} as const;

export const EVENT_TYPES = {
    WEBSITE_DOWN: 'website.down',
    WEBSITE_UP: 'website.up',
    WEBSITE_SLOW: 'website.slow',
} as const;

export type Topic = typeof TOPICS[keyof typeof TOPICS];

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];