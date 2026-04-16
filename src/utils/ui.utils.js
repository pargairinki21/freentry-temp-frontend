// ── DOM Helpers ──────────────────────────────────────────────────────────────

export function $(id) {
  return document.getElementById(id);
}

export function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "—";
}

// ── Messages ─────────────────────────────────────────────────────────────────

export function showMessage(elementId, type, text) {
  const el = $(elementId);
  if (!el) return;
  el.className = `msg ${type}`;
  el.textContent = text;
}

export function clearMessage(elementId) {
  const el = $(elementId);
  if (!el) return;
  el.className = "msg";
  el.textContent = "";
}

// ── Buttons ───────────────────────────────────────────────────────────────────

export function setButtonLoading(btn, loading, idleLabel) {
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = `<span class="loading-spinner"></span>Working…`;
  } else {
    btn.disabled = false;
    btn.textContent = idleLabel;
  }
}

export function flashLabel(btn, label, duration = 2000) {
  const original = btn.textContent;
  btn.textContent = label;
  setTimeout(() => (btn.textContent = original), duration);
}

// ── Clipboard ─────────────────────────────────────────────────────────────────

export async function copyToClipboard(text, btn, successLabel = "✓ Copied!") {
  try {
    await navigator.clipboard.writeText(text);
    flashLabel(btn, successLabel);
  } catch {
    flashLabel(btn, "Copy failed");
  }
}

// ── Firebase error prettifier ─────────────────────────────────────────────────

export function parseFirebaseError(error) {
  return error.message?.replace("Firebase: ", "") ?? "An unknown error occurred.";
}
