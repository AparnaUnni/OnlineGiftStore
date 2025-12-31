// src/app/ProductCart/page.jsx

import CustomLayout from "@/components/CustomLayout";
import ProductCart from "@/components/ProductCart";

export default function CartPage() {
  return (
    <CustomLayout>
      <ProductCart className="pt-16"/>
    </CustomLayout>
  );
}

