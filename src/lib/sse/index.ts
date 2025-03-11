export type EventType = 'none' | 'test';

export type SSE = null | {
  type: EventType;
};
