export default async function DriverId({
  params,
}: {
  params: { driverId: string }
}) {
  return <div>{params.driverId}</div>
}
