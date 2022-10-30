import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Heading } from "~/components/primitive/Heading";

export default function Settings() {
  return (
    <Heading title="Settings" icon={<Cog6ToothIcon className="h-8 w-8" />} />
  );
}
