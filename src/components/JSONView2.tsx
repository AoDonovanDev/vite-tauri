import { ReactElement } from "react";


export default function JSONView( { json_str }: {json_str: string}){

  if(!json_str) return(<h1>nuthin</h1>)
  const domArray: ReactElement[] = [];
  const json_object: Record<string, unknown> = JSON.parse(json_str);
  console.log('obj view', json_object);

  function recursiveBuild(json_object: Record<string, unknown>, parent: string = 'head', margin: number = 0) {
    if(!json_object) return
    const keys = Object.keys(json_object);
    for(const key of keys){
      console.log('found a head', key, json_object[key], typeof json_object[key])
      domArray.push(<li data-parent={parent} data-self={key} style={{marginLeft: margin}}>{key}</li>)
      if(json_object[key] instanceof Array){
        for(const el of json_object[key] as Array<string | unknown>){
          console.log('looping elements of an array', el)
          recursiveBuild(el as Record<string, unknown>, key, margin+24);
          }
        } else if ( typeof json_object[key] === "string" || typeof json_object[key] === 'number'){
          console.log('found a tail', json_object[key])
          domArray.push(<li data-parent={key} data-self={json_object[key]} style={{marginLeft: margin}}>{json_object[key] as string}</li>)
        } else {
          recursiveBuild(json_object[key] as Record<string, unknown>, key, margin+24);
        }
    }
    console.log('arrs at end', domArray);
  }   

  recursiveBuild(json_object);


  
  const test = domArray.filter(child => child.props["data-parent"] === "location");
  console.log("do i know how filter works", test)

  
  for(const el of domArray){
    console.log(el.props["data-parent"])
  }
  return (
    <div>
      <ul className="w-[60px]">
      {domArray}
      </ul>
      <h1>here may be a json view</h1>
    </div>
  )
}