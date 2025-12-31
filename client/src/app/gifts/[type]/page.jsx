import GiftsPage from "@/components/GiftsPage";
import CustomLayout from "@/components/CustomLayout";

async function getCategory(type) {
  console.log("calling:", `http://localhost:4000/api/gifts/${type}`);
  const res = await fetch(`http://localhost:4000/api/gifts/${type}`, {
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
