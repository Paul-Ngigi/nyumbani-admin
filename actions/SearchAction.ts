"use server";

const makeSearchRequest = async (url: string, payload: any, token: string) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        skey: token,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to login: ${res.status} ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error in search request:", error);
    throw error;
  }
};

export { makeSearchRequest };
