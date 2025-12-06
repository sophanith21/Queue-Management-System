import { useEffect, useRef } from "react";

const GENERIC_STORAGE_KEY = "queue_organizer_state";
export const clearLocalQueueData = (userId) => {
  if (userId) {
    localStorage.removeItem(`${GENERIC_STORAGE_KEY}_${userId}`);
  }
  localStorage.removeItem(GENERIC_STORAGE_KEY);
};

const EXPIRY_TIME = 24 * 60 * 60 * 1000;

export const usePersistentQueue = (currentState, dispatch, userId) => {
  const SCOPED_STORAGE_KEY = `${GENERIC_STORAGE_KEY}_${userId}`;
  const isRestoredRef = useRef(false);

  useEffect(() => {
    localStorage.removeItem(GENERIC_STORAGE_KEY);

    const rawData = localStorage.getItem(SCOPED_STORAGE_KEY);
    const now = Date.now();

    // If the user is currently a participant, immediately clear any stale organizer data.
    if (currentState.organizerId && currentState.organizerId !== userId) {
      localStorage.removeItem(SCOPED_STORAGE_KEY);
      return;
    }

    if (rawData) {
      try {
        const { state, timestamp } = JSON.parse(rawData);

        if (now - timestamp < EXPIRY_TIME) {
          dispatch({
            type: "update_full_state",
            participants: state.participants || [],
            queueName: state.queueName || "",
            attention: state.attention || "",
          });
        } else {
          localStorage.removeItem(SCOPED_STORAGE_KEY);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        localStorage.removeItem(SCOPED_STORAGE_KEY);
      }
    }

    isRestoredRef.current = true;
  }, [dispatch, userId, currentState.organizerId]);

  useEffect(() => {
    if (!isRestoredRef.current) {
      return;
    }

    if (currentState.organizerId && currentState.organizerId !== userId) {
      return;
    }

    const isEmpty =
      !currentState.queueName && currentState.participants.length === 0;
    if (isEmpty) return;

    const payload = {
      state: {
        participants: currentState.participants,
        queueName: currentState.queueName,
        attention: currentState.attention,
      },
      timestamp: Date.now(),
    };

    localStorage.setItem(SCOPED_STORAGE_KEY, JSON.stringify(payload));
  }, [currentState, userId]);

  const clearStorage = () => {
    localStorage.removeItem(SCOPED_STORAGE_KEY);
    isRestoredRef.current = false;
  };

  return { clearStorage };
};
