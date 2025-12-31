
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const HomePageComponent = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("http://localhost:4000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-gray-100 ">
   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-28">
       <h2 className="text-center mb-10 text-4xl text-extrabold italic">Create Perfect Gifts</h2>
       <div className=" mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:space-y-0 lg:gap-x-6">
         {categories.map((items) => (
              
              <div key={items.name} className=" bg-card rounded-lg cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group group relative">
                <img
                  alt={items.imageAlt}
                  src={items.imageSrc}
                  className="w-full rounded-t-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                />
                <h3 className="m-5 text-xl font-semibold text-gray-900">
                  <Link href={items.href}>
                    <span className="absolute inset-0" />
                    {items.name}
                  </Link>

                </h3>
                <p className=" m-5 text-sm text-gray-500 ">{items.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default HomePageComponent;
