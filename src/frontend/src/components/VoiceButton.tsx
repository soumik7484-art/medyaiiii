import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

interface VoiceButtonProps {
  text: string;
}

export function VoiceButton({ text }: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleToggle = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <Button
      data-ocid="voice.toggle"
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-accent"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          Play Voice
        </>
      )}
    </Button>
  );
}
