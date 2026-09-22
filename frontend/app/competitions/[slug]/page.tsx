import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CompetitionDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/live-raffles/${slug}`);
}
