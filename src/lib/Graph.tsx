import { ReactElement } from "react";

export class Node<T>{
  val: T;
  children: Node<T>[];
  constructor(val: T){
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
    this.domList.push(<li style={{marginLeft: margin}}>{head.val as string}</li>)
    if(!head.children.length) return
    for(const child of head.children){
       this.buildList(child, margin+24)
      }
  }

  init(json_str: string): Node<string | number>{

    function recursiveBuild(json_object: Record<string, unknown>, head: Node<string | number> | null): Node<string | number>{
    if(!json_object) return new Node('none')
    const keys: string[] = Object.keys(json_object);
    if(!head){
      head = new Node(keys[0])
    }
    head.children = keys.map(el => new Node(el));
    for(const child of head.children){
      if(json_object[child.val] instanceof Array){
        for(const el of json_object[child.val] as Array<string | unknown>){
          recursiveBuild(el as Record<string, unknown>, child)
        }
      } else if(typeof json_object[child.val] === "string" || typeof json_object[child.val] === "number"){
        const lastChild = new Node(json_object[child.val] as string)
        child.children.push(lastChild)
      } else {
        recursiveBuild(json_object[child.val] as Record<string, unknown>, child)
        } 
      }
      return head;
    }

    const json_object = JSON.parse(json_str);
    console.log('obj', json_object);
    return recursiveBuild(json_object, null);
  }

}