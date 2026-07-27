import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

export async function getMe() {
  return clientFetch(ENDPOINTS.auth.me);
}
