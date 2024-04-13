import { ReactElement } from "react";


export default function JSONView( { json_str }: {json_str: string}){

  if(!json_str) return(<h1>nuthin</h1>)
  const domArray: ReactElement[] = [];
  const pairedArray: ReactElement[] = [];
  const json_object: Record<string, unknown> = JSON.parse(json_str);
  console.log('obj view', json_object);

  function recursiveBuild(json_object: Record<string, unknown>, parent: string) {
    if(!json_object) return
    const keys = Object.keys(json_object);
    for(const key of keys){
      console.log('found a head', key, json_object[key], typeof json_object[key])
      domArray.push(<ul data-parent={parent}>{key}</ul>)
      if(json_object[key] instanceof Array){
        for(const el of json_object[key] as Array<string | unknown>){
          console.log('looping elements of an array', el)
          recursiveBuild(el as Record<string, unknown>, key);
          }
        } else if ( typeof json_object[key] === "string" || typeof json_object[key] === 'number'){
          console.log('found a tail', json_object[key])
          const parent = domArray.pop();
          pairedArray.push(<li className="flex whitespace-pre" data-parent={parent?.props["data-parent"]}>{parent}:  <li data-parent={key}>{json_object[key] as string}</li></li>)
        } else {
          recursiveBuild(json_object[key] as Record<string, unknown>, key);
        }
    }
    const last = domArray.pop() as ReactElement;
    pairedArray.push(<h1 className="text-[26px] font-bold flex" data-parent={last?.props["data-parent"]}>{last}</h1>);
    pairedArray.reverse();
    console.log('arrs at end', domArray, pairedArray);
  }   

  recursiveBuild(json_object, 'root');


  


  
  for(const el of pairedArray){
    console.log(el.props["data-parent"])
  }
  return (
    <div className="w-full flex flex-col">
      <ul>
      {pairedArray}
      </ul>
      <ul>test
        <li>ing</li>
        <li>what</li>
        <ul className="ml-[24px]">the
          <li>fuck</li>
          <li>man</li>
        </ul>
        <li>hmm</li>
      </ul>
      <h1>here may be a json view</h1>
    </div>
  )
}