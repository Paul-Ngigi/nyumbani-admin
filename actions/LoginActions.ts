"use server";

import { baseUrl } from "@/constants/urls";

const makeLoginRequest = async (payload: any) => {
  console.log({baseUrl});
  
  try {    
    const res = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {      
      throw new Error(`Failed to login: ${res.status} ${res.statusText}`);
    }

    const user = await res.json();    
    return user;
  } catch (error) {
    console.error("Error in makeLoginRequest:", error);
    // You can choose to re-throw the error here if needed
    throw error;
  }
};


export { makeLoginRequest };
