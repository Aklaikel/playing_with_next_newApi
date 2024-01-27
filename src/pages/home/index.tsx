import React from "react";
import { useState } from "react";

export default function Home() {
  const [array, setArray] = useState([1,2,3,4,5,6,7,8,9,0]);
  return (
    <div className="flex items-center justify-center flex-col gap-4">
      {array.map((item) => (
        <div key={item}>{item}</div>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
        "
        onClick={() => {
          fetch("/api/todos/swap", {
            method: "POST",
            body: JSON.stringify({ array: array }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json()).then(
            (result) => {
              setArray(result);
            },
            (error) => {
              console.log(error);
            }
          );
          
        }}
        
      >
        swap
      </button>
    </div>
  );
}
