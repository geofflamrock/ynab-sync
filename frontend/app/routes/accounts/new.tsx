import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSolid } from "@heroicons/react/24/solid";
import { Form, Link } from "@remix-run/react";
import { StGeorgeLogo } from "~/components/bank/StGeorgeLogo";
import { WestpacLogo } from "~/components/bank/WestpacLogo";
import { YnabIcon } from "~/components/ynab/YnabIcon";

export default function New() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <div className="group relative h-8 w-8 text-gray-500">
            <HomeIcon className="absolute h-8 w-8 group-hover:invisible" />
            <HomeIconSolid className="invisible absolute h-8 w-8 group-hover:visible" />
          </div>
        </Link>
        <ChevronRightIcon className="mt-0.5 h-4 w-4 text-gray-500" />
        <div className="text-xl">New Account</div>
      </div>
      <div className="text-xl">Bank</div>
      <div className="grid grid-cols-6 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-gray-300 p-8">
          <StGeorgeLogo className="h-16 w-16" />
          <div className="text-2xl">St George</div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-gray-300 p-8">
          <WestpacLogo className="h-16 w-16" />
          <div className="text-2xl">Westpac</div>
        </div>
      </div>
      <div>
        <Form className="flex gap-4">
          <input
            type="text"
            placeholder="BSB Number"
            className="rounded-md border-2 border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:ring-0"
          />
          <input
            type="text"
            placeholder="Account Number"
            className="rounded-md border-2 border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:ring-0"
          />
          <input
            type="text"
            placeholder="Account Name"
            className="rounded-md border-2 border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:ring-0"
          />
        </Form>
      </div>
      <div className="text-xl">YNAB Budget</div>
      <div className="grid grid-cols-6 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-gray-300 p-8">
          <YnabIcon className="h-16 w-16" />
          <div className="text-2xl">Lamrock</div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-gray-300 p-8">
          <YnabIcon className="h-16 w-16" />
          <div className="text-2xl">Test</div>
        </div>
      </div>
    </div>
  );
}
