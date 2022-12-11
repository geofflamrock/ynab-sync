import classNames from "classnames";

type SubHeadingProps = {
  title: string;
  icon?: React.ReactNode;
  className?: string;
};

export function SubHeading({ title, icon, className }: SubHeadingProps) {
  return (
    <div
      className={classNames(
        "flex items-center gap-4 text-gray-700 dark:text-gray-300",
        className
      )}
    >
      {icon}
      <div className="text-lg">{title}</div>
    </div>
  );
}
