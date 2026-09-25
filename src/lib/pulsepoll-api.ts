export type PollStatus = "live" | "closing" | "ended";

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  status: PollStatus;
  totalVotes: number;
  createdAt?: string;
  ownerId?: string;
};

export type SessionUser = {
  id?: string;
  email: string;
  name?: string;
};

export type Session = { token: string; user?: SessionUser };

const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_URL = (import.meta.env.PROD
  ? "https://live-polling-tool-s7ef.onrender.com"
  : configuredApiUrl || "http://localhost:8080").replace(/\/$/, "");
const SESSION_KEY = "pulsepoll.session";

function objectValue(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function unwrap(value: unknown): unknown {
  const root = objectValue(value);
  return root.data ?? root.result ?? root.poll ?? value;
}

function stringValue(...values: unknown[]): string {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
}

function numberValue(...values: unknown[]): number {
  const found = values.find((value) => typeof value === "number" || (typeof value === "string" && value.trim() !== ""));
  const parsed = typeof found === "number" ? found : Number(found);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeOption(value: unknown, index: number): PollOption {
  const item = objectValue(value);
  return {
    id: stringValue(item.id, item._id, item.optionId) || `option-${index + 1}`,
    label: stringValue(item.label, item.text, item.name, item.value) || `Option ${index + 1}`,
    votes: numberValue(item.votes, item.count, item.total, item.voteCount),
  };
}

export function normalizePoll(value: unknown): Poll | null {
  const item = objectValue(unwrap(value));
  const rawOptions = item.options ?? item.choices ?? item.answers;
  const options = Array.isArray(rawOptions) ? rawOptions.map(normalizeOption) : [];
  const totalVotes = numberValue(item.totalVotes, item.votes, item.voteCount, options.reduce((sum, option) => sum + option.votes, 0));
  const rawStatus = stringValue(item.status, item.state).toLowerCase();
  const status: PollStatus = rawStatus === "ended" || rawStatus === "closed" ? "ended" : rawStatus === "closing" ? "closing" : item.active === false ? "ended" : "live";
  const id = stringValue(item.id, item._id, item.pollId);
  const question = stringValue(item.question, item.title, item.prompt);
  if (!id && !question) return null;
  return { id: id || crypto.randomUUID(), question: question || "Untitled poll", options, status, totalVotes, createdAt: stringValue(item.createdAt, item.created_at), ownerId: stringValue(item.ownerId, item.userId, item.createdBy) || undefined };
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    return typeof parsed.token === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export const sessionStore = {
  get: readSession,
  set(session: Session) { window.localStorage.setItem(SESSION_KEY, JSON.stringify(session)); window.dispatchEvent(new Event("pulsepoll-session")); },
  clear() { window.localStorage.removeItem(SESSION_KEY); window.dispatchEvent(new Event("pulsepoll-session")); },
};

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const session = readSession();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (session?.token) headers.set("Authorization", "Bearer " + session.token);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const body = await response.text();
  let data: unknown = null;
  try { data = body ? JSON.parse(body) : null; } catch { data = body; }
  if (!response.ok) {
    const errorBody = objectValue(data);
    const message = stringValue(errorBody.message, errorBody.error);
    const fallbackMessage = typeof data === "string" && data.trim().startsWith("<")
      ? "The API endpoint is unavailable. Please try again shortly."
      : body;
    throw new Error(message || fallbackMessage || `Request failed with status ${response.status}`);
  }
  return data;
}

export async function login(email: string, password: string): Promise<Session> {
  const response = objectValue(await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }));
  const payload = objectValue(unwrap(response));
  const token = stringValue(payload.token, payload.accessToken, payload.jwt, response.token, response.accessToken);
  if (!token) throw new Error("The API did not return a JWT token.");
  const user = objectValue(payload.user ?? response.user);
  return { token, user: { id: stringValue(user.id, user._id) || undefined, email: stringValue(user.email, email), name: stringValue(user.name, user.displayName) || undefined } };
}

export async function signup(input: { name: string; email: string; password: string }): Promise<Session> {
  const response = objectValue(await request("/auth/signup", { method: "POST", body: JSON.stringify({ name: input.name, email: input.email, password: input.password }) }));
  const payload = objectValue(unwrap(response));
  const token = stringValue(payload.token, payload.accessToken, payload.jwt, response.token, response.accessToken);
  const user = objectValue(payload.user ?? response.user);
  return { token, user: { id: stringValue(user.id, user._id) || undefined, email: stringValue(user.email, input.email), name: stringValue(user.name, user.displayName, input.name) || undefined } };
}

export async function listPolls(): Promise<Poll[]> {
  const rawResponse = await request("/polls");
  const response = objectValue(rawResponse);
  const values = Array.isArray(rawResponse) ? rawResponse : (response.polls ?? response.items ?? response.data ?? response.results);
  return Array.isArray(values) ? values.map(normalizePoll).filter((poll): poll is Poll => poll !== null) : [];
}

export async function getPoll(id: string): Promise<Poll> {
  const poll = normalizePoll(await request(`/polls/${encodeURIComponent(id)}`));
  if (!poll) throw new Error("The API returned an unreadable poll.");
  return poll;
}

export async function createPoll(question: string, options: string[]): Promise<Poll> {
  const poll = normalizePoll(await request("/polls", { method: "POST", body: JSON.stringify({ question, options }) }));
  if (!poll) throw new Error("The API did not return the created poll.");
  return poll;
}

export async function vote(pollId: string, optionId: string): Promise<Poll | null> {
  return normalizePoll(await request(`/polls/${encodeURIComponent(pollId)}/vote`, { method: "POST", body: JSON.stringify({ optionId }) }));
}

export function getStreamUrl(pollId: string): string {
  return `${API_URL}/polls/${encodeURIComponent(pollId)}/stream`;
}

export function parseStreamPoll(eventData: string): Poll | null {
  try { return normalizePoll(JSON.parse(eventData)); } catch { return null; }
}

export function getApiUrl(): string { return API_URL; }