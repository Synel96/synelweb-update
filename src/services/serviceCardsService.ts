export type ServiceCard = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price?: string;
};

export async function getServiceCards(): Promise<ServiceCard[]> {
  // TODO: Replace with real backend call.
  return [];
}
