import { useEffect, useState } from "react";

export interface MessageResponse {
  message: string;
}

const useFetchServerMove = () => {
  // const [serverMove, setServerMove] = useState<MessageResponse | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  const fetchServerMove = async (nums: number[]): Promise<number | null> => {
    const response = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nums }),
    });
    if (response.ok) {
      const json = await response.json();
      console.log(json)
      return json.message;
    } 
    else {
      console.log('error')
      return null;
    }
  }

  return {
    fetchServerMove,
  };
};

export default useFetchServerMove;
