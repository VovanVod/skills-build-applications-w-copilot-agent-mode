const configuredCodespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

function inferCodespaceNameFromHost() {
  if (typeof window === 'undefined') {
    return '';
  }

  const match = window.location.hostname.match(/^(.+)-\d+\.app\.github\.dev$/);
  return match?.[1] ?? '';
}

const resolvedCodespaceName = configuredCodespaceName || inferCodespaceNameFromHost();

export const apiBaseUrl = resolvedCodespaceName
  ? `https://${resolvedCodespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

export const isCodespaceFallback = !resolvedCodespaceName;

function pickPaginationMeta(payload, itemCount) {
  const pagination = payload?.pagination ?? payload?.meta ?? null;

  if (!pagination) {
    return {
      count: itemCount,
      page: null,
      pageSize: null,
      total: itemCount,
      totalPages: null,
    };
  }

  return {
    count: itemCount,
    page: pagination.page ?? pagination.currentPage ?? null,
    pageSize: pagination.pageSize ?? pagination.limit ?? null,
    total: pagination.total ?? pagination.totalItems ?? itemCount,
    totalPages: pagination.totalPages ?? null,
  };
}

export function normalizeResourceResponse(payload) {
  const items = Array.isArray(payload)
    ? payload
    : payload?.items ?? payload?.data ?? payload?.results ?? payload?.docs ?? [];

  const normalizedItems = Array.isArray(items) ? items : [];

  return {
    items: normalizedItems,
    meta: pickPaginationMeta(payload, normalizedItems.length),
  };
}

export async function fetchResource(resource, signal) {
  const url = `${apiBaseUrl}/${resource}/`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`);
  }

  const payload = await response.json();
  return normalizeResourceResponse(payload);
}
