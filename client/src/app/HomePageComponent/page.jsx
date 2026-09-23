// // client/src/app/HomePageComponent/page.jsx

// import CustomLayout from "@/components/CustomLayout";
// import HomePageComponent from "@/components/HomePageComponent";
// import UserSection from "@/components/UserSection";

// export default function HomePage() {
//     return (
//         <CustomLayout>
//             <UserSection />
//             <HomePageComponent />
//         </CustomLayout>
//     );
// }

// client/src/app/HomePageComponent/page.jsx

'use client';

import CustomLayout from "@/components/CustomLayout";
import HomePageComponent from "@/components/HomePageComponent";

export default function HomePage() {
    return (
        <CustomLayout>
            
            <HomePageComponent />
        </CustomLayout>
    );
}