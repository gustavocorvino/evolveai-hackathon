export async function submitSelection(selection) {
  // selection: { userId, name, email, selectionId, details, timestamp }
  const res = await fetch('/api/append-selection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(selection)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to submit selection');
  }
  return res.json();
}

export async function fetchSelections() {
  const res = await fetch('/api/append-selection');
  if (!res.ok) {
    throw new Error('Failed to load selections');
  }
  return res.json();
}

export function getSelectionsDownloadUrl() {
  // Redirects to blob SAS URL via function
  return '/api/append-selection?download=1';
}
