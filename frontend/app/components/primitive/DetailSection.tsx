import classnames from "classnames";
import type { DetailItem } from "../../routes/accounts/$id";

type DetailSectionProps = {
  icon: React.ReactElement;
  items: Array<DetailItem>;
  layout?: "standard" | "condensed";
};
export function DetailSection({ icon, items, layout }: DetailSectionProps) {
  const detailItemClassNames = classnames("grid w-full gap-4", {
    "grid-cols-2": layout === undefined || layout === "standard",
    "grid-cols-4": layout === "condensed",
  });

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 md:col-span-1">{icon}</div>
      <div className="col-span-10 md:col-span-11">
        <div className={detailItemClassNames}>
          {items.map((item) => (
            <div
              className="flex flex-col gap-1 text-gray-700 dark:text-gray-300"
              key={item.name}
            >
              <span>{item.value}</span>
              <span className="text-sm text-gray-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
