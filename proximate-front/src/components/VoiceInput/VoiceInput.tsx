import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Languages, CheckCircle } from "lucide-react";
import { useSpeechRecognition } from "react-speech-recognition";
import { useProximateStore } from "../../store";
import { VoiceInput as VoiceInputType, ExtractedEntity } from "../../types";
import "./VoiceInput.css";

interface VoiceInputProps {
  onTranscript?: (transcript: string, entities: ExtractedEntity[]) => void;
  onSearchResults?: (results: any) => void;
  language?: string;
  disabled?: boolean;
  showConfirmation?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onSearchResults,
  language = "en-US",
  disabled = false,
  showConfirmation = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [detectedLanguage] = useState(language);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState("");

  const { addVoiceInput, voiceSearch } = useProximateStore();
  const recognitionRef = useRef<any>(null);

  const {
    transcript: speechTranscript,
    browserSupportsSpeechRecognition,
    resetTranscript,
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
      setIsRecording(true);
      resetTranscript(); // Clear previous transcript

      // Use browser's speech recognition API directly
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            }
          }

          // Only add final transcripts to avoid repetition
          if (finalTranscript.trim()) {
            setTranscript((prevTranscript) => {
              return prevTranscript + finalTranscript.trim() + " ";
            });
          }
        };

        recognition.onend = () => {
          // Only stop if user manually stopped, otherwise restart
          if (isRecording) {
            // Recognition ended unexpectedly, restart it
            setTimeout(() => {
              if (isRecording && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (error) {
                  console.error("Error restarting recognition:", error);
                  setIsRecording(false);
                }
              }
            }, 100);
          } else {
            setIsRecording(false);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (isRecording && recognitionRef.current) {
      setIsRecording(false); // Set this first to prevent auto-restart
      recognitionRef.current.stop();
      // Process the transcript after stopping
      setTimeout(() => {
        processTranscript();
      }, 500); // Small delay to ensure transcript is finalized
    }
  };

  const processTranscript = async () => {
    setIsProcessing(true);

    try {
      // Use the actual speech recognition transcript from our state
      const finalTranscript =
        transcript ||
        speechTranscript ||
        "I need a place near campus with parking and laundry";
      const entities = extractEntities(finalTranscript);

      const voiceInput: VoiceInputType = {
        id: Date.now().toString(),
        userId: "current-user", // Would be from auth context
        audioBlob: new Blob(), // Empty blob since we're using speech recognition
        transcript: finalTranscript,
        language: detectedLanguage,
        confidence,
        extractedEntities: entities,
        createdAt: new Date(),
      };

      addVoiceInput(voiceInput);

      // Perform intelligent voice search
      try {
        const searchResults = await voiceSearch(finalTranscript, confidence);
        if (onSearchResults) {
          onSearchResults(searchResults);
        }
      } catch (searchError) {
        console.error("Error in voice search:", searchError);
      }

      setEditedTranscript(finalTranscript);
      setShowConfirmationBox(true);
      setShowConfirmationMessage(true);
      setTimeout(() => setShowConfirmationMessage(false), 3000);
    } catch (error) {
      console.error("Error processing transcript:", error);
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

  const handleConfirmTranscript = () => {
    if (onTranscript) {
      const entities = extractEntities(editedTranscript);
      onTranscript(editedTranscript, entities);
    }
    setShowConfirmationBox(false);
  };

  const handleCancelTranscript = () => {
    setShowConfirmationBox(false);
    setEditedTranscript("");
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
              <span>Listening...</span>
            </div>
          )}

          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <span>Processing...</span>
            </div>
          )}

          {showConfirmationMessage && (
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

      {showConfirmationBox && (
        <div className="confirmation-box">
          <h3>Confirm Your Search</h3>
          <p>Please review and edit your search query:</p>
          <textarea
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            className="transcript-edit"
            rows={4}
            placeholder="Edit your search query here..."
          />
          <div className="confirmation-actions">
            <button onClick={handleCancelTranscript} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleConfirmTranscript} className="confirm-btn">
              Confirm & Search
            </button>
          </div>
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
