import { HomeIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Heading } from "~/components/primitive/Heading";

export const loader: LoaderFunction = () => {
  return redirect("/accounts");
};

export default function Index() {
  return <Heading title="Home" icon={<HomeIcon className="h-8 w-8" />} />;
}
