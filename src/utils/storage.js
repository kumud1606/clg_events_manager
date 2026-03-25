const STUDENT_KEY = "geu-clubs-student";
const EVENT_REGISTRATIONS_KEY = "geu-clubs-registrations";
const CERTIFICATE_DOWNLOADS_KEY = "geu-clubs-certificate-downloads";
const THEME_KEY = "geu-clubs-theme";

export function getStudentProfile() {
  const raw = window.localStorage.getItem(STUDENT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveStudentProfile(profile) {
  window.localStorage.setItem(STUDENT_KEY, JSON.stringify(profile));
}

export function hasCompletedOnboarding() {
  const current = getStudentProfile();
  return Boolean(current?.onboardingComplete);
}

export function updateStudentClubs(clubs) {
  const current = getStudentProfile() || {};
  saveStudentProfile({ ...current, clubs, onboardingComplete: true });
}

export function clearStudentProfile() {
  window.localStorage.removeItem(STUDENT_KEY);
}

export function getEventRegistrations() {
  const raw = window.localStorage.getItem(EVENT_REGISTRATIONS_KEY);
  const parsed = raw ? JSON.parse(raw) : {};

  return Object.fromEntries(
    Object.entries(parsed).map(([eventId, registration]) => [
      eventId,
      {
        participate:
          typeof registration.participate === "boolean"
            ? { active: registration.participate, registeredAt: null }
            : registration.participate || { active: false, registeredAt: null },
        volunteer:
          typeof registration.volunteer === "boolean"
            ? { active: registration.volunteer, registeredAt: null }
            : registration.volunteer || { active: false, registeredAt: null }
      }
    ])
  );
}

export function toggleEventRegistration(eventId, registrationType) {
  const current = getEventRegistrations();
  const key = String(eventId);
  const eventRegistrations = current[key] || {};
  const currentRegistration = eventRegistrations[registrationType] || { active: false, registeredAt: null };
  const nextValue = !currentRegistration.active;
  const nextRegistrations = {
    ...current,
    [key]: {
      ...eventRegistrations,
      [registrationType]: {
        active: nextValue,
        registeredAt: nextValue ? new Date().toISOString() : null
      }
    }
  };

  window.localStorage.setItem(EVENT_REGISTRATIONS_KEY, JSON.stringify(nextRegistrations));
  return nextRegistrations;
}

export function getCertificateDownloads() {
  const raw = window.localStorage.getItem(CERTIFICATE_DOWNLOADS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function markCertificateDownloaded(eventId) {
  const current = getCertificateDownloads();
  const next = {
    ...current,
    [String(eventId)]: {
      downloaded: true,
      downloadedAt: new Date().toISOString()
    }
  };

  window.localStorage.setItem(CERTIFICATE_DOWNLOADS_KEY, JSON.stringify(next));
  return next;
}

export function getSavedTheme() {
  return window.localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  window.localStorage.setItem(THEME_KEY, theme);
}
