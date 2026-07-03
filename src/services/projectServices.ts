export type Project = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export async function getProjects(): Promise<Project[]> {
  // TODO: Replace with real backend call.
  return [];
}
