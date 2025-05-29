import { RoomCanvas } from "@/components/RoomCanvas";

interface PageParams {
  roomId: string;
}
export default async function CanvasPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const roomId = (await params).roomId;

  return <RoomCanvas roomId={roomId} />;
}
