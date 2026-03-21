import path from "path";

// This function is used to insert a new user in the database
const insertUSER = async (params: any) => { 
  const PATH = path.join(process.cwd(), "/insertuser");
  const res = await fetch(PATH, {
    method: "POST",
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data;
};

// This function is used to get the user details from the database
const getUser = async (params: any) => { 
  const PATH = path.join(process.cwd(), "/getUser");
  const res = await fetch(PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data;
};

// This function is used to get the conversation between two users from the database
const getConversation = async (params: any) => { 
  const PATH = path.join(process.cwd(), "/getconversation");
  const res = await fetch(PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data;
};

// This function is used to store the chat messages in the database
const storeChat = async (params: any) => { 
  const PATH = path.join(process.cwd(), "/storechat");
  const res = await fetch(PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data;
};

// This function is used to get the list of friends for a user
const getFriends = async (params: any) => { 
  const PATH = path.join(process.cwd(), "/getFriends");
  const res = await fetch(PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return data;
};

export { insertUSER, getUser, getConversation, storeChat, getFriends };
