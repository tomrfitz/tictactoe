import { useEffect, useState } from "react";

export interface MessageResponse {
  message: string;
}

const useFetchServerMove = (nums: number[]) => {
  const [serverMove, setServerMove] = useState<MessageResponse | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("useEffect called");
    const fetchServerMove = async () => {
      // console.log("top of fetchServerMove");
      try {
        // setLoading(true);
        const response = await fetch("http://localhost:8080/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nums }),
        });
        const json = await response.json();
        if (response.ok) {
          setServerMove(json);
        } else {
          // setError(json.message);
        }
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setError("error");
        // setLoading(false);
      }
    };
    // console.log("bottom of fetchServerMove");
    fetchServerMove();
    // console.log("bottom of useEffect");
  }, [nums]);
  return {
    serverMove,
    // error,
    // loading
  };
};

export default useFetchServerMove;
