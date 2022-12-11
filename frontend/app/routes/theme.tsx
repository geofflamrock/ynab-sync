import { ContentHeader } from "~/components/layout/ContentHeader";
import { Paper } from "~/components/layout/Paper";
import { Heading } from "~/components/primitive/Heading";
import { SubHeading } from "~/components/primitive/SubHeading";

export default function Theme() {
  return (
    <div className="flex flex-col">
      <ContentHeader>
        <div className="flex w-full items-center">
          <Heading title="Theme" />
        </div>
      </ContentHeader>
      <div className="container mx-auto flex flex-col gap-4">
        <SubHeading title="Gray" />
        <div className="grid grid-cols-3 gap-4">
          <Paper className="bg-gray-800 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-700 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-600 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-500 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-400 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-300 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-200 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-100 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
          <Paper className="bg-gray-50 p-10">
            <p className="text-gray-800">This is some text</p>
            <p className="text-gray-700">This is some text</p>
            <p className="text-gray-600">This is some text</p>
            <p className="text-gray-500">This is some text</p>
            <p className="text-gray-400">This is some text</p>
            <p className="text-gray-300">This is some text</p>
            <p className="text-gray-200">This is some text</p>
            <p className="text-gray-100">This is some text</p>
            <p className="text-gray-50">This is some text</p>
          </Paper>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <p className="text-gray-800">This is some text</p>
          <p className="text-gray-700">This is some text</p>
          <p className="text-gray-600">This is some text</p>
          <p className="text-gray-500">This is some text</p>
          <p className="text-gray-400">This is some text</p>
          <p className="text-gray-300">This is some text</p>
          <p className="text-gray-200">This is some text</p>
          <p className="text-gray-100">This is some text</p>
          <p className="text-gray-50">This is some text</p>
        </div>
        <SubHeading title="Primary" />
        <div className="grid grid-cols-3 gap-4">
          <Paper className="bg-ynab-800 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-700 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-600 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-500 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-400 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-300 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-200 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-100 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
          <Paper className="bg-ynab-50 p-10">
            <p className="text-ynab-800">This is some text</p>
            <p className="text-ynab-700">This is some text</p>
            <p className="text-ynab-600">This is some text</p>
            <p className="text-ynab-500">This is some text</p>
            <p className="text-ynab-400">This is some text</p>
            <p className="text-ynab-300">This is some text</p>
            <p className="text-ynab-200">This is some text</p>
            <p className="text-ynab-100">This is some text</p>
            <p className="text-ynab-50">This is some text</p>
          </Paper>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <p className="text-ynab-800">This is some text</p>
          <p className="text-ynab-700">This is some text</p>
          <p className="text-ynab-600">This is some text</p>
          <p className="text-ynab-500">This is some text</p>
          <p className="text-ynab-400">This is some text</p>
          <p className="text-ynab-300">This is some text</p>
          <p className="text-ynab-200">This is some text</p>
          <p className="text-ynab-100">This is some text</p>
          <p className="text-ynab-50">This is some text</p>
          <p className="text-ynab">This is some text</p>
        </div>
      </div>
    </div>
  );
}
