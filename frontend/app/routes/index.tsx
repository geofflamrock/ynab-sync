import { HomeIcon } from "@heroicons/react/24/outline";
import { Heading } from "~/components/primitive/Heading";

export default function Index() {
  return <Heading title="Home" icon={<HomeIcon className="h-8 w-8" />} />;
}
