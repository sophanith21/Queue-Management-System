import { QRCodeCanvas } from "qrcode.react";

export const QRCodeComponent = ({ id }) => {
  const url = `https://72082a0bf410.ngrok-free.app/queue/${id}/participant`;
  return <QRCodeCanvas value={url} size={150} />;
};
