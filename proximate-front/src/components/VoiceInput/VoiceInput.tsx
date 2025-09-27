import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Languages, CheckCircle } from "lucide-react";
import { useSpeechRecognition } from "react-speech-recognition";
import { useProximateStore } from "../../store";
import { VoiceInput as VoiceInputType, ExtractedEntity } from "../../types";
import "./VoiceInput.css";

interface VoiceInputProps {
  onTranscript?: (transcript: string, entities: ExtractedEntity[]) => void;
  language?: string;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  language = "en-US",
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState(language);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { addVoiceInput } = useProximateStore();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    transcript: speechTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (speechTranscript) {
      setTranscript(speechTranscript);
      setConfidence(0.85); // Mock confidence score
    }
  }, [speechTranscript]);

  const startRecording = async () => {
    if (disabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        processAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioBlob = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Mock processing - in real app, this would call your AI service
      const mockTranscript =
        transcript || "I need a place near campus with parking and laundry";
      const mockEntities = extractEntities(mockTranscript);

      const voiceInput: VoiceInputType = {
        id: Date.now().toString(),
        userId: "current-user", // Would be from auth context
        audioBlob,
        transcript: mockTranscript,
        language: detectedLanguage,
        confidence,
        extractedEntities: mockEntities,
        createdAt: new Date(),
      };

      addVoiceInput(voiceInput);

      if (onTranscript) {
        onTranscript(mockTranscript, mockEntities);
      }

      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractEntities = (text: string): ExtractedEntity[] => {
    const entities: ExtractedEntity[] = [];
    const lowerText = text.toLowerCase();

    // Extract commute modes
    if (lowerText.includes("walk") || lowerText.includes("walking")) {
      entities.push({
        type: "commute_mode",
        value: "walking",
        confidence: 0.9,
        startIndex: lowerText.indexOf("walk"),
        endIndex: lowerText.indexOf("walk") + 4,
      });
    }

    if (lowerText.includes("bike") || lowerText.includes("biking")) {
      entities.push({
        type: "commute_mode",
        value: "biking",
        confidence: 0.9,
        startIndex: lowerText.indexOf("bike"),
        endIndex: lowerText.indexOf("bike") + 4,
      });
    }

    // Extract amenities
    const amenities = [
      "parking",
      "laundry",
      "wifi",
      "furnished",
      "pet friendly",
    ];
    amenities.forEach((amenity) => {
      if (lowerText.includes(amenity)) {
        entities.push({
          type: "amenity",
          value: amenity,
          confidence: 0.8,
          startIndex: lowerText.indexOf(amenity),
          endIndex: lowerText.indexOf(amenity) + amenity.length,
        });
      }
    });

    // Extract budget
    const budgetMatch = text.match(/\$(\d+)/);
    if (budgetMatch) {
      entities.push({
        type: "budget",
        value: parseInt(budgetMatch[1]),
        confidence: 0.9,
        startIndex: budgetMatch.index || 0,
        endIndex: (budgetMatch.index || 0) + budgetMatch[0].length,
      });
    }

    return entities;
  };


  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-input-error">
        <p>Your browser doesn't support speech recognition.</p>
      </div>
    );
  }

  return (
    <div className="voice-input-container">
      <div className="voice-input-header">
        <Languages className="language-icon" />
        <span className="language-label">
          {detectedLanguage === "en-US"
            ? "English"
            : detectedLanguage === "es-ES"
            ? "Spanish"
            : detectedLanguage === "fr-FR"
            ? "French"
            : "English"}
        </span>
      </div>

      <div className="voice-input-main">
        <button
          className={`voice-button ${isRecording ? "recording" : ""} ${
            disabled ? "disabled" : ""
          }`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isProcessing}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <div className="voice-status">
          {isRecording && (
            <div className="recording-indicator">
              <div className="pulse"></div>
              <span>Recording...</span>
            </div>
          )}

          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <span>Processing...</span>
            </div>
          )}

          {showConfirmation && (
            <div className="confirmation-indicator">
              <CheckCircle size={20} />
              <span>Preferences captured!</span>
            </div>
          )}
        </div>
      </div>

      {transcript && (
        <div className="transcript-container">
          <div className="transcript-header">
            <Volume2 size={16} />
            <span>Transcript</span>
            <span className="confidence">
              ({Math.round(confidence * 100)}% confidence)
            </span>
          </div>
          <div className="transcript-text">{transcript}</div>
        </div>
      )}

      <div className="voice-input-footer">
        <p>
          Speak your housing preferences and we'll extract the key details
          automatically.
        </p>
      </div>
    </div>
  );
};

export default VoiceInput;
