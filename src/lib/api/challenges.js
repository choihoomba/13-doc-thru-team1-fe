import clientFetch from '@/lib/api/clientFetch';

const CHALLENGES_ENDPOINT = '/api/challenges';

export async function createChallenge(data) {
  return clientFetch(CHALLENGES_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getChallenges(params = {}) {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  const queryString = new URLSearchParams(entries).toString();

  return clientFetch(
    `${CHALLENGES_ENDPOINT}${queryString ? `?${queryString}` : ''}`,
  );
}

export async function getChallenge(id) {
  return clientFetch(`${CHALLENGES_ENDPOINT}/${id}`);
}

export async function deleteChallenge(id, reason) {
  return clientFetch(`${CHALLENGES_ENDPOINT}/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}

export async function cancelChallenge(id) {
  return clientFetch(`${CHALLENGES_ENDPOINT}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'CANCEL' }),
  });
}
