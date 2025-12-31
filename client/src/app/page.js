import CustomLayout from "@/components/CustomLayout";
import HomePageComponent from "@/components/HomePageComponent";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProductCart from "@/components/ProductCart";


export default function Home() {
  return (
    <CustomLayout>
      
        <HomePageComponent/>
    </CustomLayout>
  );
}
