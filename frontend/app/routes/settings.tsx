import { ContentHeader } from "~/components/layout/ContentHeader";
import { Paper } from "~/components/layout/Paper";
import { Heading } from "~/components/primitive/Heading";
import { SubHeading } from "~/components/primitive/SubHeading";

export default function Settings() {
  return (
    <div className="flex flex-col">
      <ContentHeader>
        <div className="flex w-full items-center">
          <Heading title="Settings" />
        </div>
      </ContentHeader>
      <div className="container mx-auto">
        <Paper>
          <SubHeading title="Display" />
        </Paper>
      </div>
    </div>
  );
}
