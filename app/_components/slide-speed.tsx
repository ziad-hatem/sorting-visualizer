"use client";
import { cn } from "../../lib/utils";
import { Slider } from "../../components/ui/slider";
import { SortingContext } from "../_context/sorting-context";
import { useContext } from "react";

export function SlideSpeed({
  speed,
  setSpeed,
}: {
  speed: number;
  setSpeed: (speed: number) => void;
}) {
  const { isSorting } = useContext<any>(SortingContext);
  return (
    <Slider
      disabled={isSorting}
      defaultValue={[speed]}
      max={100}
      step={1}
      className={cn("w-[200px]")}
      onValueChange={(value: any) => setSpeed(value[0])}
    />
  );
}
