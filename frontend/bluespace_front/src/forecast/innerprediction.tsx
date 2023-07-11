import { Reorder } from "framer-motion";
import { useState } from "react";
import { Item } from "./Item";
export default function InnerPrediction() {
  const initialItems = ["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"];
  const [items, setItems] = useState(initialItems);
  return (
    <div>
      <div className="input-items">
        <span className="input-tips">
            Username
        </span>
        <Reorder.Group axis="y" onReorder={setItems} values={items}>
          {items.map((item) => (
            <Item key={item} item={item} />
          ))}
        </Reorder.Group>
                  
      </div>
    </div>
  )
}