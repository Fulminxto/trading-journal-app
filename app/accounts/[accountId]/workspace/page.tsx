import { redirect } from "next/navigation";

type WorkspaceRedirectPageProps = {
  params: Promise<{ accountId: string }>;
};

export default async function WorkspaceRedirectPage({
  params,
}: WorkspaceRedirectPageProps) {
  const { accountId } = await params;

  redirect(`/accounts/${accountId}/dashboard`);
}
