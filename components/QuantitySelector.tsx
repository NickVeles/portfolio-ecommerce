"use client";

import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = () => {
    // Placeholder for future cart functionality
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center flex-nowrap w-2/3 sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-r-none"
            aria-label="Decrease quantity"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </Button>
          <span className="flex items-center justify-center h-10 min-w-16 px-4 border border-input border-x-0 bg-background text-foreground text-sm font-medium">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-l-none"
            aria-label="Increase quantity"
            onClick={handleIncrement}
            disabled={quantity >= 99}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          className="h-10 text-base font-semibold px-10 w-2/3 sm:w-auto"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default QuantitySelector;
