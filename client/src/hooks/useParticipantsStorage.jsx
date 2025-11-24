import { useEffect, useRef } from "react";

const STORAGE_KEY = "participants";
const TIMESTAMP_KEY = "participants_lastSeen";

export const removeStoredData = (dispatch) => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TIMESTAMP_KEY);
  localStorage.removeItem("userId");
  dispatch({ type: "update", participants: [] });
};

export const useParticipantsStorage = (participants, dispatch) => {
  const EXPIRY = 5000; // 5 seconds

  const participantsRef = useRef(participants);

  // Keep ref updated
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  const saveParticipants = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participantsRef.current));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  };

  const cleanupParticipants = () => {
    const lastSeen = parseInt(localStorage.getItem(TIMESTAMP_KEY) || "0", 10);
    if (Date.now() - lastSeen > EXPIRY) {
      removeStoredData(dispatch);
    }
  };

  useEffect(() => {
    // Cleanup expired data on mount
    cleanupParticipants();

    // Restore participants from storage
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (saved.length > 0) {
      dispatch({ type: "update", participants: saved });
    }

    // Save on tab close, refresh, or navigate away
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") saveParticipants();
    };

    window.addEventListener("beforeunload", saveParticipants);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", saveParticipants);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dispatch]);
};
