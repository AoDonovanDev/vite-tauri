import { ChangeEvent, useState } from "react";
import { invoke } from "@tauri-apps/api";
import JSONView3 from "./JSONView3";

interface ResponseObject {
  resp_string: string
  resp_type: string,
}


export default function Test() {


  const [userJSON, setUserJSON] = useState({
    resp_string: "",
    resp_type: ""
  });
  const [input, setInput] = useState({
    url: ""
  });

  /* async function getUser(){
    const userJSON: string = await invoke('get_user');
    setUserJSON(userJSON)
  } */

  async function handleChange(e: ChangeEvent & {target: HTMLInputElement}){
    const change = {
      ...input,
      [e.target.name]: e.target.value
    }
    setInput(change)
  }

  async function get(){
    const test: ResponseObject = await invoke('get_text', {url: input.url});
    console.log('str return', test)
    setUserJSON(test)
  }



  return (
    <>
      {userJSON?.resp_type.includes("json") && <JSONView3 json_str={userJSON.resp_string}/>}
      {userJSON?.resp_type.includes("html") && <iframe className="w-full" srcDoc={userJSON.resp_string}>hey</iframe>}
      <input type="text" className="border-solid" name="url" onChange={(e)=>handleChange(e)}></input>
      <button onClick={get}>TEST</button>
    </>
  )
}