import { ReactElement } from "react";
import { v4 as uuidv4 } from 'uuid';

export class Node<T>{
  val: string | number;
  children: Node<T>[];
  constructor(val: string | number){
    this.val = val
    this.children = []
  }
}

export class Graph {
  head: Node<string | number>;
  domList: ReactElement[];
  constructor(json_str: string) {
    this.head = this.init(json_str);
    this.domList = [];
  }

  buildList(head: Node<string | number> = this.head, margin: number=0){
    const key = uuidv4();
    this.domList.push(<li style={{marginLeft: margin}} key={key}>{head.val}</li>)
    if(!head.children.length) return
    for(const child of head.children){
       this.buildList(child, margin+24)
      }
  }

  init(json_str: string): Node<string | number>{

    function recursiveBuild(this: Graph, json_object: Record<string, unknown>, head: Node<string | number> | null): Node<string | number>{

      const keys: string[] = Object.keys(json_object);
      if(!head){
        head = new Node("head");
        head.children = keys.map(el => new Node(el));
      } else {
        head.children = keys.map(el => new Node(el));
      }
      for(const child of head.children){
        if(json_object[child.val] instanceof Array){
          //special rule for if the child is a 1 length array containing a string or number
          if( ((json_object[child.val] as Array<string | unknown>).length === 1) && (typeof (json_object[child.val] as Array<string | number>)[0] === "string" || typeof (json_object[child.val] as Array<string | number>)[0] === "number")) {
            console.log("its fuckin happening**************************************************************")
            this.terminate(json_object[child.val], child)
          } else {
              for(const el of json_object[child.val] as Array<string | unknown>){
                recursiveBuild.call(this, el as Record<string, unknown>, child);
            }
          }
        } else if(typeof json_object[child.val] === "string" || typeof json_object[child.val] === "number"){
          this.terminate(json_object[child.val], child)
        } else {
          recursiveBuild.call(this, json_object[child.val] as Record<string, unknown>, child);
          } 
        }
      console.log(head);
      return head;
    }
    const json_object = JSON.parse(json_str);
    return recursiveBuild.call(this, json_object, null);
  }

  terminate( val: unknown, child: Node<string | number>){
    const concrete = typeof val === "string" ? val as string : val as number;
    const lastChild = new Node(concrete);
    child.children.push(lastChild);
  }

}