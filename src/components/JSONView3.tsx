import { Graph } from "../lib/Graph";
import { useState, useEffect } from "react";

export default function JSONView( { json_str }: {json_str: string}){

  const [domList, setDomList] = useState([<></>])
  
  useEffect(() => {
    try {
      const graph = new Graph(json_str);
      graph.buildList()
      setDomList(graph.domList)
    } catch(e) {
      console.log('graph failed to build', e)
    }
    
  }, [json_str])
 

  

  return (
    <div>
      <ul className="w-[60px]">
        {domList}
      </ul>
      <h1>here may be a json view</h1>
    </div>
  )
}