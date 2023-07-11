
import * as React from "react";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { Item } from "./Item";
const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];
export default function InnerPrediction() {
  const [items, setItems] = useState(initialItems);
  return (
    <div className='ReorderContent'>
      <Reorder.Group  axis="y" onReorder={setItems} values={items}>
      {items.map((item) => (
        <Item key={item} item={item} />
      ))}
      </Reorder.Group>
    </div>
  )
}