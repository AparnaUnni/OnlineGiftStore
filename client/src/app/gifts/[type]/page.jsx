import GiftsPage from "@/components/GiftsPage";
import CustomLayout from "@/components/CustomLayout";

async function getCategory(type) {
  console.log("calling:", `${process.env.NEXT_PUBLIC_API_URL}/gifts/${type}`);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// IMPORTANT: await the params Promise
export default async function Page(props) {
  const { type } = await props.params;   // <- this removes the warning
  console.log("type in Page:", type);

  const config = await getCategory(type);

  if (!config) {
    return (
      <CustomLayout>
        <div className="p-8">Category not found. type = {String(type)}</div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <GiftsPage title={config.title} items={config.items} />
    </CustomLayout>
  );
}
