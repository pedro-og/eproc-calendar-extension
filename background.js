// eProc Calendar - Background Service Worker
// Handles OAuth authentication and Google Calendar API calls

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const CLIENT_ID = '112413605418-cabgp5tco5n9tdg28j3m2md0s2h4i4i6.apps.googleusercontent.com';
const REDIRECT_URI = chrome.identity.getRedirectURL();
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

// Get or refresh authentication token
async function getAuthToken(interactive = true) {
  // Try to get token from storage first
  const stored = await chrome.storage.local.get('oauth_token');
  if (stored.oauth_token && !isTokenExpired(stored.oauth_token)) {
    return stored.oauth_token.access_token;
  }

  if (!interactive) {
    throw new Error('Autenticação do Google não disponível');
  }

  // Launch web auth flow
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', SCOPES.join(' '));

  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl.toString(),
      interactive: true
    });

    // Extract token from response URL
    const url = new URL(responseUrl);
    const token = url.hash.substring(1).split('&').reduce((acc, param) => {
      const [key, value] = param.split('=');
      if (key === 'access_token') {
        acc[key] = decodeURIComponent(value);
      } else if (key === 'expires_in') {
        acc[key] = parseInt(value);
      }
      return acc;
    }, {});

    if (!token.access_token) {
      throw new Error('Token não obtido');
    }

    // Store token with expiration time
    token.expires_at = Date.now() + (token.expires_in * 1000);
    await chrome.storage.local.set({ oauth_token: token });

    return token.access_token;
  } catch (error) {
    throw error;
  }
}

// Check if token is expired
function isTokenExpired(token) {
  if (!token.expires_at) return true;
  return Date.now() > token.expires_at - 60000; // Refresh 1 min before expiry
}

// Create event in Google Calendar via API
async function createCalendarEvent(eventData, colorId, guests) {
  try {
    const token = await getAuthToken(true);

    const payload = {
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location || undefined
    };

    // Add start and end dates/times
    if (eventData.startDateTime) {
      // With time (for hearings)
      payload.start = {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo'
      };
      payload.end = {
        dateTime: eventData.endDateTime,
        timeZone: 'America/Sao_Paulo'
      };
    } else {
      // All-day event (for deadlines)
      payload.start = { date: eventData.startDate };
      payload.end = { date: eventData.endDate };
    }

    // Add color if specified
    if (colorId && colorId !== '') {
      payload.colorId = colorId;
    }

    // Add guests/attendees if specified
    if (Array.isArray(guests) && guests.length > 0) {
      payload.attendees = guests.map(email => ({ email }));
    }

    const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      eventId: result.id,
      eventUrl: result.htmlLink
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Message handler for content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CREATE_EVENT') {
    createCalendarEvent(request.eventData, request.colorId, request.guests).then(sendResponse);
    return true; // Will respond asynchronously
  }

  sendResponse({ error: 'Unknown message type' });
});
