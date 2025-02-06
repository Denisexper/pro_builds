import React, { useState } from "react";
import ProductList from "../products.components/product.list.js";

function Dashboard() {
  const [ cart, setCart ] = useState([]); 

  return (
    <div>
      
      <ProductList setCart={setCart} />
    </div>
  );
}

export default Dashboard;
