import { KeyIcon } from "@heroicons/react/24/outline";
import { Heading } from "~/components/primitive/Heading";

export default function Credentials() {
  return <Heading title="Credentials" icon={<KeyIcon className="h-8 w-8" />} />;
}
