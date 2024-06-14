"use server";

import { baseUrl } from "@/constants/urls";

const listUsers = async (accessToken: string, body: any) => {
  try {    
    const res = await fetch(`${baseUrl}/listusers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "SKEY": accessToken
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {      
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }

    const users = await res.json();    
    return users;
  } catch (error) {
    console.error("Error in makeLoginRequest:", error);
    // You can choose to re-throw the error here if needed
    throw error;
  }
};


export { listUsers };
