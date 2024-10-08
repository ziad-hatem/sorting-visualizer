"use client";

import { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SortingContext } from "../_context/sorting-context";

export function SelectAlgorithm({
  algorithms,
}: {
  algorithms: {
    name: string;
    value: string;
    function: string;
  }[];
}) {
  const { setAlgorithm, isSorting } = useContext<any>(SortingContext);

  return (
    <Select
      onValueChange={(value: any) => setAlgorithm(value)}
      disabled={isSorting}
    >
      <SelectTrigger className="w-[180px] text-white">
        <SelectValue className="!bg-white" placeholder="Select Algorithm" />
      </SelectTrigger>
      <SelectContent className="!bg-slate-950 !text-white">
        <SelectGroup className="!text-white">
          <SelectLabel className="!text-white">Algorithm</SelectLabel>
          {algorithms.map(
            (algorithm: { name: string; value: string; function: string }) => (
              <SelectItem
                key={algorithm.value}
                value={algorithm.value}
                className="cursor-pointer text-white hover:!text-slate-300 hover:!bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {algorithm.name}
              </SelectItem>
            )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
