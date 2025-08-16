import { redirect } from 'next/navigation';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  
  // Redirect to main page with share parameter
  redirect(`/?share=${id}`);
}
