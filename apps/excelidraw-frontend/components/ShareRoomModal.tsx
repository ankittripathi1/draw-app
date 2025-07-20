"use client";

import { Button } from "@/components/ui/Button";
import Card from "@repo/ui/card";
import { Copy, Mail, MessageSquare, X } from "lucide-react";
import { useState } from "react";

interface ShareRoomModalProps {
  roomId: string;
  roomName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareRoomModal({
  roomId,
  roomName,
  isOpen,
  onClose,
}: ShareRoomModalProps) {
  const [copied, setCopied] = useState(false);
  const roomUrl = `${window.location.origin}/canvas/${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join my drawing room: ${roomName}`);
    const body = encodeURIComponent(
      `I'd like to invite you to collaborate on "${roomName}".\n\nJoin the room here: ${roomUrl}\n\nHappy drawing!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `Join my drawing room "${roomName}": ${roomUrl}`
    );
    window.open(`sms:?body=${message}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Room</h3>
          <Button variant="outline"  onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Room Name
            </label>
            <div className="text-lg font-semibold">{roomName}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Room Link
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={roomUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-muted"
              />
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className={copied ? "bg-green-100 text-green-700" : ""}
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Share via
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={shareViaSMS}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                SMS
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            Anyone with this link can join and collaborate in your room
          </div>
        </div>
      </Card>
    </div>
  );
}
