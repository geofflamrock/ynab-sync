import type { DetailItem } from "../../routes/accounts/$id";

type DetailSectionProps = {
  icon: React.ReactElement;
  items: Array<DetailItem>;
};
export function DetailSection({ icon, items }: DetailSectionProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2 md:col-span-1">{icon}</div>
      <div className="col-span-10 md:col-span-11">
        <div className="grid w-full grid-cols-2 gap-4">
          {items.map((item) => (
            <div className="flex flex-col gap-1" key={item.name}>
              <span>{item.value}</span>
              <span className="text-sm text-neutral-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
