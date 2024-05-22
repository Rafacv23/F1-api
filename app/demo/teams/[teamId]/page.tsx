export default async function TeamId({
  params,
}: {
  params: { teamId: string }
}) {
  return <div>{params.teamId}</div>
}
