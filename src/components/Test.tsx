import { useState } from "react";
import { invoke } from "@tauri-apps/api";
import JSONView3 from "./JSONView3";


export default function Test() {

  
  const [user, setUser] = useState({
    info: {},
    results: [{name:{first:''}}],
    json: ''
  });

  async function getUser(){
    const userJSON: string = await invoke('get_user');
    const user = JSON.parse(userJSON);
    user.json = userJSON;
    setUser(user);
  }

  return (
    <>
      <h1>{user.results[0].name.first}</h1>
      {user.json && <JSONView3 json_str={user.json}/>}
      <button onClick={getUser}>TEST</button>
    </>
  )
}