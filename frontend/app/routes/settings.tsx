import { ContentHeader } from "~/components/layout/ContentHeader";
import { Paper } from "~/components/layout/Paper";
import { Heading } from "~/components/primitive/Heading";

export default function Settings() {
  return (
    <div className="flex flex-col">
      <ContentHeader>
        <div className="flex w-full items-center">
          <Heading title="Settings" />
        </div>
      </ContentHeader>
      <div className="container mx-auto">
        <Paper>Nothing here yet</Paper>
      </div>
    </div>
  );
}
